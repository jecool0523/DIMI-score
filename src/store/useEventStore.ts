import { create } from 'zustand';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type EventStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
export type ViewMode = 'TIMETABLE' | 'IN_PROGRESS' | 'PREPARATION';

export interface SportEvent {
  id: string;
  name: string;
  time: string;
  icon: string; // lucide icon name
  status: EventStatus;
  teamA?: string;
  teamB?: string;
  scoreA: number;
  scoreB: number;
  actualStartTime?: number;
  duration?: number;
  setDuration?: number;
  setStartTime?: number;
}

interface EventStore {
  viewMode: ViewMode;
  announcement: string;
  announcementTimestamp: number;
  events: SportEvent[];
  bonusScoreA: number;
  bonusScoreB: number;
  serverTimeOffset: number;
  setViewMode: (mode: ViewMode) => void;
  setAnnouncement: (text: string) => void;
  setEventStatus: (id: string, status: EventStatus) => void;
  updateScore: (id: string, team: 'A' | 'B', delta: number) => void;
  resetScore: (id: string) => void;
  updateBonusScore: (team: 'A' | 'B', delta: number) => void;
  resetBonusScore: () => void;
  triggerAnnouncement: () => void;
  updateEventDuration: (id: string, duration: number) => void;
  updateEventSetDuration: (id: string, duration: number) => void;
  resetSetTimer: (id: string) => void;
  resetToDefaultSchedule: () => Promise<void>;
  syncTimeOffset: () => Promise<void>;
  lastLocalUpdate: number;
}

type AppStateRow = Tables<'app_state'>;
type EventRow = Tables<'events'>;

type StoreRuntime = {
  initialized: boolean;
  listenersBound: boolean;
  pollingTimer: number | null;
  realtimeChannel: RealtimeChannel | null;
  realtimeStatus: string;
  reconnectTimer: number | null;
  syncPromise: Promise<void> | null;
};

type EventStoreWindow = Window & {
  __eventStoreRuntime?: StoreRuntime;
};

const APP_STATE_ID = 1;
const DEFAULT_ANNOUNCEMENT = '🎉 제25회 체육대회에 오신 것을 환영합니다! 안전하고 즐거운 대회가 되길 바랍니다.';
const POLLING_INTERVAL_MS = 2000;
const REALTIME_RETRY_MS = 3000;

const createStoreRuntime = (): StoreRuntime => ({
  initialized: false,
  listenersBound: false,
  pollingTimer: null,
  realtimeChannel: null,
  realtimeStatus: 'IDLE',
  reconnectTimer: null,
  syncPromise: null,
});

const storeRuntime: StoreRuntime =
  typeof window === 'undefined'
    ? createStoreRuntime()
    : (((window as EventStoreWindow).__eventStoreRuntime ??= createStoreRuntime()) as StoreRuntime);

const defaultEvents: SportEvent[] = [
  { id: '1', name: '개회식', time: '09:00', duration: 30, icon: 'Flag', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '2', name: '사제 족구', time: '09:30', duration: 30, icon: 'Circle', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '3', name: '여자 피구', time: '10:05', duration: 30, icon: 'Users', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '4', name: '줄다리기', time: '10:35', duration: 25, icon: 'Grip', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '5', name: '어스', time: '11:05', duration: 15, icon: 'Music', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '6', name: '농구', time: '11:30', duration: 50, icon: 'CircleDot', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '7', name: 'O/X 퀴즈', time: '12:25', duration: 15, icon: 'HelpCircle', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '8', name: '점심 식사', time: '12:50', duration: 60, icon: 'UtensilsCrossed', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '9', name: '종목 릴레이', time: '14:00', duration: 30, icon: 'Activity', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '10', name: '사제 축구 전반', time: '14:35', duration: 25, icon: 'Target', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '11', name: '노래 자랑', time: '15:00', duration: 5, icon: 'Mic2', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '12', name: '사제 축구 후반', time: '15:05', duration: 25, icon: 'Target', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '13', name: '노래 자랑', time: '15:35', duration: 5, icon: 'Mic2', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '14', name: '계주', time: '15:50', duration: 25, icon: 'Zap', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '15', name: '폐회식', time: '16:15', duration: 10, icon: 'Trophy', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
];

const defaultAppState: AppStateRow = {
  id: APP_STATE_ID,
  view_mode: 'TIMETABLE',
  announcement: DEFAULT_ANNOUNCEMENT,
  announcement_timestamp: 0,
  bonus_score_a: 0,
  bonus_score_b: 0,
};

// Only include columns that exist in the DB schema (duration/set_duration/set_start_time are local-only)
const defaultEventRows = defaultEvents.map((event) => ({
  id: event.id,
  name: event.name,
  time: event.time,
  icon: event.icon,
  status: event.status,
  team_a: event.teamA ?? null,
  team_b: event.teamB ?? null,
  score_a: event.scoreA,
  score_b: event.scoreB,
  actual_start_time: event.actualStartTime ?? null,
}));

const mapEventRow = (event: EventRow): SportEvent => ({
  id: event.id,
  name: event.name,
  time: event.time,
  icon: event.icon,
  status: event.status as EventStatus,
  teamA: event.team_a ?? undefined,
  teamB: event.team_b ?? undefined,
  scoreA: event.score_a,
  scoreB: event.score_b,
  actualStartTime: event.actual_start_time ? Number(event.actual_start_time) : undefined,
  duration: event.duration ?? undefined,
  setDuration: event.set_duration ?? undefined,
  setStartTime: event.set_start_time ? Number(event.set_start_time) : undefined,
});

const applyAppState = (appState: AppStateRow) => {
  useEventStore.setState({
    viewMode: appState.view_mode as ViewMode,
    announcement: appState.announcement,
    announcementTimestamp: Number(appState.announcement_timestamp),
    bonusScoreA: appState.bonus_score_a,
    bonusScoreB: appState.bonus_score_b,
  });
};

const applyEvents = (events: EventRow[]) => {
  const lastUpdate = useEventStore.getState().lastLocalUpdate;
  if (Date.now() - lastUpdate < 3000) {
    console.log('⏳ Skipping events full sync to protect recent local update');
    return;
  }

  useEventStore.setState({
    events: events
      .map(mapEventRow)
      .sort((a, b) => a.time.localeCompare(b.time)),
  });
};

const loadAppState = async () => {
  console.log('📡 Fetching app state...');
  const { data, error } = await supabase
    .from('app_state')
    .select('*')
    .eq('id', APP_STATE_ID)
    .maybeSingle();

  if (error) {
    console.error('❌ Error fetching app state:', error);
    return;
  }

  if (data) {
    applyAppState(data);
    return;
  }

  console.log('ℹ️ App state row not found, creating initial row...');
  const { data: inserted, error: insertError } = await supabase
    .from('app_state')
    .insert(defaultAppState)
    .select('*')
    .single();

  if (insertError) {
    console.error('❌ Error inserting initial app state:', insertError);
    applyAppState(defaultAppState);
    return;
  }

  applyAppState(inserted);
};

const loadEvents = async () => {
  console.log('📡 Fetching events...');
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('time', { ascending: true });

  if (error) {
    console.error('❌ Error fetching events:', error);
    return;
  }

  if (data && data.length > 0) {
    applyEvents(data);
    return;
  }

  console.log('ℹ️ No events in database, seeding default data...');
  const { data: inserted, error: insertError } = await supabase
    .from('events')
    .insert(defaultEventRows)
    .select('*');

  if (insertError) {
    console.error('❌ Error seeding default events:', insertError);

    const { data: refetched, error: refetchError } = await supabase
      .from('events')
      .select('*')
      .order('time', { ascending: true });

    if (refetchError) {
      console.error('❌ Error refetching events after seed failure:', refetchError);
      useEventStore.setState({ events: defaultEvents });
      return;
    }

    if (refetched && refetched.length > 0) {
      applyEvents(refetched);
      return;
    }

    useEventStore.setState({ events: defaultEvents });
    return;
  }

  if (inserted) {
    applyEvents(inserted as EventRow[]);
  } else {
    useEventStore.setState({ events: defaultEvents });
  }
};

const syncFromDatabase = async (reason: string) => {
  if (storeRuntime.syncPromise) {
    return storeRuntime.syncPromise;
  }

  storeRuntime.syncPromise = (async () => {
    console.log(`🔄 Syncing store (${reason})...`);
    await Promise.all([loadAppState(), loadEvents()]);
  })().finally(() => {
    storeRuntime.syncPromise = null;
  });

  return storeRuntime.syncPromise;
};

const stopPolling = () => {
  if (typeof window === 'undefined' || storeRuntime.pollingTimer === null) {
    return;
  }

  window.clearInterval(storeRuntime.pollingTimer);
  storeRuntime.pollingTimer = null;
  console.log('🟢 Fallback polling stopped');
};

const startPolling = () => {
  if (typeof window === 'undefined' || storeRuntime.pollingTimer !== null) {
    return;
  }

  console.log('🟡 Starting fallback polling...');
  storeRuntime.pollingTimer = window.setInterval(() => {
    void syncFromDatabase('polling');
  }, POLLING_INTERVAL_MS);
};

const clearReconnectTimer = () => {
  if (typeof window === 'undefined' || storeRuntime.reconnectTimer === null) {
    return;
  }

  window.clearTimeout(storeRuntime.reconnectTimer);
  storeRuntime.reconnectTimer = null;
};

const scheduleRealtimeReconnect = () => {
  if (typeof window === 'undefined' || storeRuntime.reconnectTimer !== null) {
    return;
  }

  storeRuntime.reconnectTimer = window.setTimeout(() => {
    storeRuntime.reconnectTimer = null;
    void startRealtime();
  }, REALTIME_RETRY_MS);
};

const handleRealtimeStatus = (status: string) => {
  storeRuntime.realtimeStatus = status;
  console.log('📡 Realtime status:', status);

  if (status === 'SUBSCRIBED') {
    clearReconnectTimer();
    stopPolling();
    return;
  }

  if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED') {
    startPolling();
    void syncFromDatabase(`realtime:${status.toLowerCase()}`);
    scheduleRealtimeReconnect();
  }
};

const resetRealtimeChannel = async () => {
  clearReconnectTimer();

  if (!storeRuntime.realtimeChannel) {
    return;
  }

  const channel = storeRuntime.realtimeChannel;
  storeRuntime.realtimeChannel = null;
  storeRuntime.realtimeStatus = 'IDLE';

  try {
    await supabase.removeChannel(channel);
  } catch (error) {
    console.error('❌ Error removing realtime channel:', error);
  }
};

const startRealtime = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (
    storeRuntime.realtimeChannel &&
    (storeRuntime.realtimeStatus === 'CONNECTING' || storeRuntime.realtimeStatus === 'SUBSCRIBED')
  ) {
    return;
  }

  await resetRealtimeChannel();

  console.log('📡 Setting up realtime listeners...');
  const channel = supabase.channel('dimi-score-sync');
  storeRuntime.realtimeChannel = channel;
  storeRuntime.realtimeStatus = 'CONNECTING';

  channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, (payload) => {
      console.log('🔔 App state change received:', payload.new);
      if (payload.new) {
        applyAppState(payload.new as AppStateRow);
      } else {
        void loadAppState();
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
      console.log('🔔 Event change received:', (payload.new as any)?.id, (payload.new as any)?.status);
      if (payload.new) {
        const lastUpdate = useEventStore.getState().lastLocalUpdate;
        if (Date.now() - lastUpdate < 3000) {
          console.log('⏳ Skipping realtime event update to protect recent local update');
          return;
        }

        const updatedEvent = mapEventRow(payload.new as EventRow);
        useEventStore.setState((state) => ({
          events: state.events.map((e) => {
            if (e.id === updatedEvent.id) return updatedEvent;
            // If the arriving event is IN_PROGRESS, any other IN_PROGRESS should become COMPLETED
            // to maintain exclusivity across multiple clients
            if (updatedEvent.status === 'IN_PROGRESS' && e.status === 'IN_PROGRESS') {
              return { ...e, status: 'COMPLETED' };
            }
            return e;
          }),
        }));
      } else {
        void loadEvents();
      }
    })
    // Timer sync via Realtime Broadcast (no DB columns needed)
    .on('broadcast', { event: 'timer-update' }, (payload) => {
      const { eventId, setStartTime, setDuration } = payload.payload as {
        eventId: string;
        setStartTime?: number;
        setDuration?: number;
      };
      console.log('⏱️ Timer broadcast received:', eventId, { setStartTime, setDuration });
      useEventStore.setState((state) => ({
        events: state.events.map((e) =>
          e.id === eventId
            ? {
              ...e,
              ...(setStartTime !== undefined && { setStartTime }),
              ...(setDuration !== undefined && { setDuration }),
            }
            : e
        ),
      }));
    })
    .subscribe((status) => {
      if (storeRuntime.realtimeChannel !== channel) {
        return;
      }

      handleRealtimeStatus(status);
    });
};

const bindBrowserSyncListeners = () => {
  if (typeof window === 'undefined' || storeRuntime.listenersBound) {
    return;
  }

  const resync = () => {
    void syncFromDatabase('browser-event');

    if (storeRuntime.realtimeStatus !== 'SUBSCRIBED') {
      void startRealtime();
    }
  };

  window.addEventListener('focus', resync);
  window.addEventListener('online', resync);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      resync();
    }
  });

  storeRuntime.listenersBound = true;
};

export const useEventStore = create<EventStore>((set, get) => ({
  viewMode: 'TIMETABLE',
  announcement: DEFAULT_ANNOUNCEMENT,
  announcementTimestamp: 0,
  events: defaultEvents,
  bonusScoreA: 0,
  bonusScoreB: 0,
  serverTimeOffset: 0,
  lastLocalUpdate: 0,

  setViewMode: async (mode) => {
    set({ viewMode: mode });
    const { error } = await supabase.from('app_state').update({ view_mode: mode }).eq('id', APP_STATE_ID);
    if (error) console.error('Error setting view mode:', error);
  },
  setAnnouncement: async (text) => {
    const timestamp = Date.now();
    set({ announcement: text, announcementTimestamp: timestamp });
    const { error } = await supabase.from('app_state').update({
      announcement: text,
      announcement_timestamp: timestamp
    }).eq('id', APP_STATE_ID);
    if (error) console.error('Error setting announcement:', error);
  },

  setEventStatus: async (id, status) => {
    const timestamp = Date.now();
    const actualStartTime = status === 'IN_PROGRESS' ? timestamp : undefined;

    // Snapshot previous state for rollback
    const previousEvents = get().events;

    // Optimistic update: Ensure only one event is IN_PROGRESS
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id === id) {
          return { ...e, status, actualStartTime: actualStartTime ?? e.actualStartTime };
        }
        if (status === 'IN_PROGRESS' && e.status === 'IN_PROGRESS') {
          return { ...e, status: 'COMPLETED' };
        }
        return e;
      }),
      lastLocalUpdate: timestamp,
    }));

    console.log(`🔄 setEventStatus: id=${id}, status=${status}`);

    const { error } = await supabase.from('events').update({
      status,
      actual_start_time: actualStartTime
    }).eq('id', id);

    if (error) {
      console.error('❌ setEventStatus DB update failed, rolling back:', error);
      // Rollback optimistic update
      set({ events: previousEvents, lastLocalUpdate: 0 });
      return;
    }

    console.log(`✅ setEventStatus DB update succeeded: id=${id}, status=${status}`);

    if (status === 'IN_PROGRESS') {
      // Also update others to COMPLETED in DB to maintain exclusivity
      const { error: bulkError } = await supabase.from('events')
        .update({ status: 'COMPLETED' })
        .neq('id', id)
        .eq('status', 'IN_PROGRESS');
      if (bulkError) {
        console.error('❌ setEventStatus bulk-complete update failed:', bulkError);
      }
    }
  },

  updateScore: async (id, team, delta) => {
    const event = get().events.find(e => e.id === id);
    if (!event) return;

    const newScore = team === 'A'
      ? Math.max(0, event.scoreA + delta)
      : Math.max(0, event.scoreB + delta);

    // Optimistic update
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, [team === 'A' ? 'scoreA' : 'scoreB']: newScore } : e
      ),
    }));

    const scoreKey = team === 'A' ? 'score_a' : 'score_b';
    const { error } = await supabase.from('events').update({
      [scoreKey]: newScore
    } as any).eq('id', id);
    if (error) console.error('Error updating score:', error);
  },

  resetScore: async (id) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, scoreA: 0, scoreB: 0 } : e)),
    }));
    const { error } = await supabase.from('events').update({ score_a: 0, score_b: 0 }).eq('id', id);
    if (error) console.error('Error resetting score:', error);
  },

  updateBonusScore: async (team, delta) => {
    const newBonusA = team === 'A' ? get().bonusScoreA + delta : get().bonusScoreA;
    const newBonusB = team === 'B' ? get().bonusScoreB + delta : get().bonusScoreB;

    set({ bonusScoreA: newBonusA, bonusScoreB: newBonusB });
    const { error } = await supabase.from('app_state').update({
      bonus_score_a: newBonusA,
      bonus_score_b: newBonusB
    }).eq('id', APP_STATE_ID);
    if (error) console.error('Error updating bonus score:', error);
  },

  resetBonusScore: async () => {
    set({ bonusScoreA: 0, bonusScoreB: 0 });
    const { error } = await supabase.from('app_state').update({ bonus_score_a: 0, bonus_score_b: 0 }).eq('id', APP_STATE_ID);
    if (error) console.error('Error resetting bonus score:', error);
  },

  triggerAnnouncement: async () => {
    const timestamp = Date.now();
    set({ announcementTimestamp: timestamp });
    const { error } = await supabase.from('app_state').update({ announcement_timestamp: timestamp }).eq('id', APP_STATE_ID);
    if (error) console.error('Error triggering announcement:', error);
  },
  updateEventDuration: async (id, duration) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, duration } : e)),
    }));
    const { error } = await supabase.from('events').update({ duration }).eq('id', id);
    if (error) {
      if (error.code === 'PGRST204') {
        console.warn('⚠️ duration column missing in DB — timer is local-only. Run migration SQL.');
      } else {
        console.error('Error updating duration:', error);
      }
    }
  },
  updateEventSetDuration: async (id, set_duration) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, setDuration: set_duration } : e)),
    }));
    // Sync via Realtime Broadcast (no DB column required)
    if (storeRuntime.realtimeChannel && storeRuntime.realtimeStatus === 'SUBSCRIBED') {
      await storeRuntime.realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-update',
        payload: { eventId: id, setDuration: set_duration },
      });
    }
  },
  resetSetTimer: async (id) => {
    const timestamp = Date.now() + get().serverTimeOffset;
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, setStartTime: timestamp } : e)),
    }));
    // Sync via Realtime Broadcast (no DB column required)
    if (storeRuntime.realtimeChannel && storeRuntime.realtimeStatus === 'SUBSCRIBED') {
      const currentSetDuration = get().events.find(e => e.id === id)?.setDuration;
      await storeRuntime.realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-update',
        payload: { eventId: id, setStartTime: timestamp, setDuration: currentSetDuration },
      });
      console.log('⏱️ Timer broadcast sent:', id, timestamp);
    } else {
      console.warn('⚠️ Realtime not connected — timer is local-only.');
    }
  },
  resetToDefaultSchedule: async () => {
    // 1. Delete all existing events
    const { error: deleteError } = await supabase.from('events').delete().neq('id', '0'); // Delete all
    if (deleteError) {
      console.error('Error deleting events:', deleteError);
      return;
    }

    // 2. Insert default events
    const { data, error: insertError } = await supabase.from('events').insert(defaultEventRows).select('*');
    if (insertError) {
      console.error('Error inserting default events:', insertError);
      return;
    }

    // 3. Update local state
    if (data) {
      applyEvents(data);
    }
  },

  syncTimeOffset: async () => {
    try {
      const start = Date.now();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(`${supabaseUrl}/rest/v1/?t=${start}`, {
        method: 'HEAD',
        cache: 'no-store',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const end = Date.now();

      const serverDateStr = response.headers.get('date');
      if (serverDateStr) {
        const serverTime = new Date(serverDateStr).getTime();
        const localTimeAtServerCall = (start + end) / 2;
        const offset = serverTime - localTimeAtServerCall;
        set({ serverTimeOffset: offset });
        console.log('⏰ Time synced with server. Offset:', offset, 'ms');
      }
    } catch (e) {
      console.warn('Time sync fallback to local:', e);
    }
  },
}));

const initStore = async () => {
  if (storeRuntime.initialized) {
    return;
  }

  storeRuntime.initialized = true;
  console.log('🔄 Initializing Supabase store...');

  try {
    bindBrowserSyncListeners();
    // startPolling();
    await syncFromDatabase('initial');
    await startRealtime();
    void useEventStore.getState().syncTimeOffset();
  } catch (err) {
    console.error('💥 Critical error in initStore:', err);
  }
};

initStore();
