import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
}

interface EventStore {
  viewMode: ViewMode;
  announcement: string;
  announcementTimestamp: number;
  events: SportEvent[];
  bonusScoreA: number;
  bonusScoreB: number;
  setViewMode: (mode: ViewMode) => void;
  setAnnouncement: (text: string) => void;
  setEventStatus: (id: string, status: EventStatus) => void;
  updateScore: (id: string, team: 'A' | 'B', delta: number) => void;
  resetScore: (id: string) => void;
  updateBonusScore: (team: 'A' | 'B', delta: number) => void;
  resetBonusScore: () => void;
  triggerAnnouncement: () => void;
}

const defaultEvents: SportEvent[] = [
  { id: '1', name: '개회식', time: '09:00', icon: 'Flag', status: 'COMPLETED', scoreA: 0, scoreB: 0 },
  { id: '2', name: '사제족구', time: '09:30', icon: 'Circle', status: 'COMPLETED', teamA: '1학년', teamB: '2학년', scoreA: 3, scoreB: 2 },
  { id: '3', name: '농구', time: '10:00', icon: 'CircleDot', status: 'IN_PROGRESS', teamA: '청팀', teamB: '백팀', scoreA: 24, scoreB: 18 },
  { id: '4', name: '줄다리기', time: '10:40', icon: 'Grip', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '5', name: '축구', time: '11:20', icon: 'Target', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '6', name: '점심시간', time: '12:00', icon: 'UtensilsCrossed', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
  { id: '7', name: '이어달리기', time: '13:00', icon: 'Zap', status: 'UPCOMING', teamA: '청팀', teamB: '백팀', scoreA: 0, scoreB: 0 },
  { id: '8', name: '폐회식', time: '14:00', icon: 'Trophy', status: 'UPCOMING', scoreA: 0, scoreB: 0 },
];

export const useEventStore = create<EventStore>((set, get) => ({
  viewMode: 'TIMETABLE',
  announcement: '🎉 제25회 체육대회에 오신 것을 환영합니다! 안전하고 즐거운 대회가 되길 바랍니다.',
  announcementTimestamp: 0,
  events: [],
  bonusScoreA: 0,
  bonusScoreB: 0,

  setViewMode: async (mode) => {
    set({ viewMode: mode });
    await supabase.from('app_state').update({ view_mode: mode }).eq('id', 1);
  },
  setAnnouncement: async (text) => {
    const timestamp = Date.now();
    set({ announcement: text, announcementTimestamp: timestamp });
    await supabase.from('app_state').update({
      announcement: text,
      announcement_timestamp: timestamp
    }).eq('id', 1);
  },

  setEventStatus: async (id, status) => {
    const actualStartTime = status === 'IN_PROGRESS' ? Date.now() : undefined;

    // Optimistic update
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, status, actualStartTime: actualStartTime ?? e.actualStartTime } : e
      ),
    }));

    await supabase.from('events').update({
      status,
      actual_start_time: actualStartTime
    }).eq('id', id);
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
    await supabase.from('events').update({
      [scoreKey]: newScore
    } as any).eq('id', id);
  },

  resetScore: async (id) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, scoreA: 0, scoreB: 0 } : e)),
    }));
    await supabase.from('events').update({ score_a: 0, score_b: 0 }).eq('id', id);
  },

  updateBonusScore: async (team, delta) => {
    const newBonusA = team === 'A' ? get().bonusScoreA + delta : get().bonusScoreA;
    const newBonusB = team === 'B' ? get().bonusScoreB + delta : get().bonusScoreB;

    set({ bonusScoreA: newBonusA, bonusScoreB: newBonusB });
    await supabase.from('app_state').update({
      bonus_score_a: newBonusA,
      bonus_score_b: newBonusB
    }).eq('id', 1);
  },

  resetBonusScore: async () => {
    set({ bonusScoreA: 0, bonusScoreB: 0 });
    await supabase.from('app_state').update({ bonus_score_a: 0, bonus_score_b: 0 }).eq('id', 1);
  },

  triggerAnnouncement: async () => {
    const timestamp = Date.now();
    set({ announcementTimestamp: timestamp });
    await supabase.from('app_state').update({ announcement_timestamp: timestamp }).eq('id', 1);
  },
}));

// Initialize data and setup realtime
const initStore = async () => {
  // 1. Fetch App State
  const { data: appState, error: appError } = await supabase.from('app_state').select('*').single();

  if (appError || !appState) {
    // If table is empty, initialize it
    await supabase.from('app_state').insert([{
      id: 1,
      view_mode: 'TIMETABLE',
      announcement: '🎉 제25회 체육대회에 오신 것을 환영합니다! 안전하고 즐거운 대회가 되길 바랍니다.',
      announcement_timestamp: 0,
      bonus_score_a: 0,
      bonus_score_b: 0
    }]);
  } else {
    useEventStore.setState({
      viewMode: appState.view_mode as any,
      announcement: appState.announcement,
      announcementTimestamp: Number(appState.announcement_timestamp),
      bonusScoreA: appState.bonus_score_a,
      bonusScoreB: appState.bonus_score_b,
    });
  }

  // 2. Fetch Events
  const { data: events, error: eventsError } = await supabase.from('events').select('*').order('time');

  if (eventsError || !events || events.length === 0) {
    // If table is empty, initialize with default events
    const initialEvents = defaultEvents.map(e => ({
      id: e.id,
      name: e.name,
      time: e.time,
      icon: e.icon,
      status: e.status,
      team_a: e.teamA,
      team_b: e.teamB,
      score_a: e.scoreA,
      score_b: e.scoreB,
      actual_start_time: e.actualStartTime
    }));
    await supabase.from('events').insert(initialEvents);
    useEventStore.setState({ events: defaultEvents });
  } else {
    useEventStore.setState({
      events: events.map(e => ({
        id: e.id,
        name: e.name,
        time: e.time,
        icon: e.icon,
        status: e.status as any,
        teamA: e.team_a,
        teamB: e.team_b,
        scoreA: e.score_a,
        scoreB: e.score_b,
        actualStartTime: e.actual_start_time ? Number(e.actual_start_time) : undefined
      }))
    });
  }

  // 3. Setup Realtime Listeners
  supabase
    .channel('all-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, (payload) => {
      const newData = payload.new as any;
      useEventStore.setState({
        viewMode: newData.view_mode,
        announcement: newData.announcement,
        announcementTimestamp: Number(newData.announcement_timestamp),
        bonusScoreA: newData.bonus_score_a,
        bonusScoreB: newData.bonus_score_b,
      });
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
      const newEvent = payload.new as any;
      const oldEvent = payload.old as any;

      if (payload.eventType === 'DELETE') {
        useEventStore.setState((state) => ({
          events: state.events.filter(e => e.id !== oldEvent.id)
        }));
      } else {
        useEventStore.setState((state) => ({
          events: state.events.some(e => e.id === newEvent.id)
            ? state.events.map(e => e.id === newEvent.id ? {
              id: newEvent.id,
              name: newEvent.name,
              time: newEvent.time,
              icon: newEvent.icon,
              status: newEvent.status,
              teamA: newEvent.team_a,
              teamB: newEvent.team_b,
              scoreA: newEvent.score_a,
              scoreB: newEvent.score_b,
              actualStartTime: newEvent.actual_start_time ? Number(newEvent.actual_start_time) : undefined
            } : e)
            : [...state.events, {
              id: newEvent.id,
              name: newEvent.name,
              time: newEvent.time,
              icon: newEvent.icon,
              status: newEvent.status,
              teamA: newEvent.team_a,
              teamB: newEvent.team_b,
              scoreA: newEvent.score_a,
              scoreB: newEvent.score_b,
              actualStartTime: newEvent.actual_start_time ? Number(newEvent.actual_start_time) : undefined
            }].sort((a, b) => a.time.localeCompare(b.time))
        }));
      }
    })
    .subscribe();
};

initStore();

