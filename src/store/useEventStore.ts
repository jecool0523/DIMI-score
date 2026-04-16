import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      viewMode: 'TIMETABLE',
      announcement: '🎉 제25회 체육대회에 오신 것을 환영합니다! 안전하고 즐거운 대회가 되길 바랍니다.',
      announcementTimestamp: 0,
      events: defaultEvents,
      bonusScoreA: 0,
      bonusScoreB: 0,

      setViewMode: (mode) => set({ viewMode: mode }),
      setAnnouncement: (text) => set({ announcement: text, announcementTimestamp: Date.now() }),

      setEventStatus: (id, status) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id
              ? {
                ...e,
                status,
                actualStartTime: status === 'IN_PROGRESS' ? Date.now() : e.actualStartTime
              }
              : e
          ),
        })),

      updateScore: (id, team, delta) =>
        set((state) => ({
          events: state.events.map((e) => {
            if (e.id !== id) return e;
            if (team === 'A') return { ...e, scoreA: Math.max(0, e.scoreA + delta) };
            return { ...e, scoreB: Math.max(0, e.scoreB + delta) };
          }),
        })),

      resetScore: (id) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, scoreA: 0, scoreB: 0 } : e)),
        })),

      updateBonusScore: (team, delta) =>
        set((state) => ({
          bonusScoreA: team === 'A' ? state.bonusScoreA + delta : state.bonusScoreA,
          bonusScoreB: team === 'B' ? state.bonusScoreB + delta : state.bonusScoreB,
        })),

      resetBonusScore: () => set({ bonusScoreA: 0, bonusScoreB: 0 }),
      triggerAnnouncement: () => set({ announcementTimestamp: Date.now() }),
    }),
    {
      name: 'dimi-score-storage',
    }
  )
);

// Cross-tab synchronization via BroadcastChannel
const channel = new BroadcastChannel('dimi-score-sync');
let isReceiving = false;

channel.onmessage = (event) => {
  isReceiving = true;
  useEventStore.setState(event.data);
  isReceiving = false;
};

useEventStore.subscribe((state) => {
  if (!isReceiving) {
    channel.postMessage({
      viewMode: state.viewMode,
      announcement: state.announcement,
      announcementTimestamp: state.announcementTimestamp,
      events: state.events,
      bonusScoreA: state.bonusScoreA,
      bonusScoreB: state.bonusScoreB,
    });
  }
});

