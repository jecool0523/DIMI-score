import { useState, useEffect } from 'react';
import { useEventStore, type ViewMode } from '@/store/useEventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Monitor, Play, AlertTriangle, Plus, Minus, RotateCcw, Send, Lock } from 'lucide-react';
import { toast } from 'sonner';

const modeButtons: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'TIMETABLE', label: '시간표', icon: <Monitor size={18} /> },
  { mode: 'IN_PROGRESS', label: '경기 진행', icon: <Play size={18} /> },
  { mode: 'PREPARATION', label: '준비 화면', icon: <AlertTriangle size={18} /> },
];

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('dimi-admin-auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dimi') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dimi-admin-auth', 'true');
      toast.success('관리자 페이지에 로그인되었습니다.');
    } else {
      toast.error('비밀번호가 틀렸습니다.');
    }
  };

  const { viewMode, setViewMode, events, setEventStatus, updateScore, resetScore, setAnnouncement, bonusScoreA, bonusScoreB, updateBonusScore, resetBonusScore } = useEventStore();
  const [announcementInput, setAnnouncementInput] = useState('');

  const handleSendAnnouncement = () => {
    if (announcementInput.trim()) {
      setAnnouncement(announcementInput.trim());
      setAnnouncementInput('');
      toast.success('공지사항이 전송되었습니다.');
    }
  };

  let calculatedTotalA = bonusScoreA;
  let calculatedTotalB = bonusScoreB;
  events.forEach((e) => {
    if (e.teamA && e.teamB) {
      calculatedTotalA += e.scoreA;
      calculatedTotalB += e.scoreB;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-card border border-border p-8 rounded-xl shadow-lg w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Lock className="text-primary" size={24} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground text-center">관리자 로그인</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">페이지에 접근하려면 비밀번호를 입력해주세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center"
              autoFocus
            />
            <Button type="submit" className="w-full">접속하기</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h1 className="font-display text-3xl text-foreground">⚙️ 컨트롤 패널</h1>
        <Button variant="outline" size="sm" onClick={() => {
          sessionStorage.removeItem('dimi-admin-auth');
          setIsAuthenticated(false);
          toast.info('로그아웃 되었습니다.');
        }}>
          로그아웃
        </Button>
      </div>

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

      {/* Global Score control */}
      <section className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mb-3">
          <h2 className="text-xl font-semibold text-muted-foreground">전체 점수판 관리 🏆</h2>
          <Button size="sm" variant="destructive" onClick={resetBonusScore} className="gap-1 h-8">
            <RotateCcw size={14} /> 보너스 초기화
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-card rounded-lg p-6 border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Team A (청팀)</p>
              <p className="font-display text-6xl text-primary mt-2 leading-none">{calculatedTotalA}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-3 font-medium">수동 보너스: <span className="text-primary">{bonusScoreA > 0 ? `+${bonusScoreA}` : bonusScoreA}</span></p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon" onClick={() => updateBonusScore('A', 1)}><Plus size={16} /></Button>
              <Button variant="outline" size="icon" onClick={() => updateBonusScore('A', -1)}><Minus size={16} /></Button>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Team B (백팀)</p>
              <p className="font-display text-6xl text-primary mt-2 leading-none">{calculatedTotalB}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-3 font-medium">수동 보너스: <span className="text-primary">{bonusScoreB > 0 ? `+${bonusScoreB}` : bonusScoreB}</span></p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon" onClick={() => updateBonusScore('B', 1)}><Plus size={16} /></Button>
              <Button variant="outline" size="icon" onClick={() => updateBonusScore('B', -1)}><Minus size={16} /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-3">공지사항</h2>
        <div className="flex gap-3 max-w-3xl">
          <Input
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="공지 내용을 입력하세요..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendAnnouncement()}
          />
          <Button onClick={handleSendAnnouncement} className="gap-2 shrink-0">
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
                  <span className={`text-sm px-2 py-0.5 rounded ${event.status === 'COMPLETED' ? 'bg-completed text-completed-foreground' :
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
