import { useState } from 'react';
import { useEventStore, type ViewMode } from '@/store/useEventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Monitor, Play, AlertTriangle, Plus, Minus, RotateCcw, Send } from 'lucide-react';

const modeButtons: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'TIMETABLE', label: '시간표', icon: <Monitor size={18} /> },
  { mode: 'IN_PROGRESS', label: '경기 진행', icon: <Play size={18} /> },
  { mode: 'PREPARATION', label: '준비 화면', icon: <AlertTriangle size={18} /> },
];

const AdminPage = () => {
  const { viewMode, setViewMode, events, setEventStatus, updateScore, resetScore, setAnnouncement } = useEventStore();
  const [announcementInput, setAnnouncementInput] = useState('');

  const handleSendAnnouncement = () => {
    if (announcementInput.trim()) {
      setAnnouncement(announcementInput.trim());
      setAnnouncementInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="font-display text-3xl text-foreground mb-6">⚙️ 컨트롤 패널</h1>

      {/* Mode switch */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-3">화면 모드 전환</h2>
        <div className="flex gap-3">
          {modeButtons.map((m) => (
            <Button
              key={m.mode}
              variant={viewMode === m.mode ? 'default' : 'secondary'}
              className="gap-2"
              onClick={() => setViewMode(m.mode)}
            >
              {m.icon}
              {m.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Announcement */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-3">공지사항</h2>
        <div className="flex gap-3 max-w-xl">
          <Input
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="공지 내용을 입력하세요..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendAnnouncement()}
          />
          <Button onClick={handleSendAnnouncement} className="gap-2">
            <Send size={16} /> 전송
          </Button>
        </div>
      </section>

      {/* Events control */}
      <section>
        <h2 className="text-xl font-semibold text-muted-foreground mb-3">종목 관리</h2>
        <div className="space-y-3 max-w-3xl">
          {events.map((event) => (
            <div key={event.id} className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono">{event.time}</span>
                  <span className="font-display text-lg text-foreground">{event.name}</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${
                    event.status === 'COMPLETED' ? 'bg-completed text-completed-foreground' :
                    event.status === 'IN_PROGRESS' ? 'bg-inprogress/20 text-inprogress' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {event.status === 'COMPLETED' ? '완료' : event.status === 'IN_PROGRESS' ? '진행중' : '예정'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={event.status === 'IN_PROGRESS' ? 'default' : 'secondary'}
                    onClick={() => setEventStatus(event.id, 'IN_PROGRESS')}
                  >
                    진행중
                  </Button>
                  <Button
                    size="sm"
                    variant={event.status === 'COMPLETED' ? 'default' : 'secondary'}
                    onClick={() => setEventStatus(event.id, 'COMPLETED')}
                  >
                    완료
                  </Button>
                </div>
              </div>

              {/* Score controls */}
              {event.teamA && event.teamB && (
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-16">{event.teamA}</span>
                    <Button size="sm" variant="secondary" onClick={() => updateScore(event.id, 'A', -1)}>
                      <Minus size={14} />
                    </Button>
                    <span className="font-display text-xl w-8 text-center text-foreground">{event.scoreA}</span>
                    <Button size="sm" variant="secondary" onClick={() => updateScore(event.id, 'A', 1)}>
                      <Plus size={14} />
                    </Button>
                  </div>
                  <span className="text-muted-foreground">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-16">{event.teamB}</span>
                    <Button size="sm" variant="secondary" onClick={() => updateScore(event.id, 'B', -1)}>
                      <Minus size={14} />
                    </Button>
                    <span className="font-display text-xl w-8 text-center text-foreground">{event.scoreB}</span>
                    <Button size="sm" variant="secondary" onClick={() => updateScore(event.id, 'B', 1)}>
                      <Plus size={14} />
                    </Button>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => resetScore(event.id)} className="gap-1">
                    <RotateCcw size={14} /> 초기화
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
