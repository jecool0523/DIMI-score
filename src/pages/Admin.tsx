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

  const { viewMode, setViewMode, events, setEventStatus, updateScore, resetScore, setAnnouncement, bonusScoreA, bonusScoreB, updateBonusScore, resetBonusScore, triggerAnnouncement, updateEventDuration } = useEventStore();
  const [announcementInput, setAnnouncementInput] = useState('');
  const [manualBonusA, setManualBonusA] = useState('');
  const [manualBonusB, setManualBonusB] = useState('');
  const [eventManualInputs, setEventManualInputs] = useState<Record<string, { A: string; B: string }>>({});
  const [durationInputs, setDurationInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const inputs: Record<string, string> = {};
    events.forEach(e => {
      inputs[e.id] = e.duration?.toString() || '40';
    });
    setDurationInputs(inputs);
  }, [events]);

  const handleEventManualInputChange = (eventId: string, team: 'A' | 'B', value: string) => {
    setEventManualInputs(prev => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || { A: '', B: '' }),
        [team]: value
      }
    }));
  };

  const handleAddManualBonus = (team: 'A' | 'B') => {
    const val = parseInt(team === 'A' ? manualBonusA : manualBonusB);
    if (!isNaN(val)) {
      updateBonusScore(team, val);
      if (team === 'A') setManualBonusA('');
      else setManualBonusB('');
      toast.success(`${team === 'A' ? '청팀' : '백팀'}에 ${val}점이 추가되었습니다.`);
    }
  };

  const handleAddManualEventScore = (id: string, team: 'A' | 'B') => {
    const val = parseInt(eventManualInputs[id]?.[team] || '');
    if (!isNaN(val)) {
      updateScore(id, team, val);
      handleEventManualInputChange(id, team, '');
      const eventName = events.find(e => e.id === id)?.name || '경기';
      toast.success(`${eventName} ${team === 'A' ? 'A팀' : 'B팀'}에 ${val}점이 추가되었습니다.`);
    }
  };

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
            <h1 className="font-['Pretendard'] text-2xl font-semibold text-foreground text-center">관리자 로그인</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">페이지에 접근하려면 비밀번호를 입력해주세요.</p>
            <p className="text-sm text-muted-foreground text-center mt-2">학생회 혹은 관련자가 아닌 분들은 접근하지 말아주세요.</p>
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
        <h1 className="font-['Pretendard'] text-3xl text-foreground">⚙️ 컨트롤 패널</h1>
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

        {viewMode === 'IN_PROGRESS' && !events.some(e => e.status === 'IN_PROGRESS') && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 max-w-3xl animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm">진행 중인 경기가 없습니다.</p>
              <p className="text-xs opacity-90">메인 화면은 이전 상태(시간표 또는 준비 화면)를 유지합니다. 하단에서 종목의 상태를 '진행중'으로 변경해 주세요.</p>
            </div>
          </div>
        )}
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
              <p className="font-['Pretendard'] text-6xl text-primary mt-2 leading-none">{calculatedTotalA}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-3 font-medium">수동 보너스: <span className="text-primary">{bonusScoreA > 0 ? `+${bonusScoreA}` : bonusScoreA}</span></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', 1)}>+1</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', 50)}>+50</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', 100)}>+100</Button>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', -1)}>-1</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', -50)}>-50</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('A', -100)}>-100</Button>
              </div>
              <div className="flex gap-1 mt-1 border-t border-border/50 pt-1.5">
                <Input
                  type="number"
                  placeholder="직접 입력"
                  className="h-7 w-20 text-[11px]"
                  value={manualBonusA}
                  onChange={(e) => setManualBonusA(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddManualBonus('A')}
                />
                <Button size="xs" onClick={() => handleAddManualBonus('A')}>추가</Button>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Team B (백팀)</p>
              <p className="font-['Pretendard'] text-6xl text-primary mt-2 leading-none">{calculatedTotalB}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-3 font-medium">수동 보너스: <span className="text-primary">{bonusScoreB > 0 ? `+${bonusScoreB}` : bonusScoreB}</span></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', 1)}>+1</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', 50)}>+50</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', 100)}>+100</Button>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', -1)}>-1</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', -50)}>-50</Button>
                <Button variant="outline" size="xs" className="w-10" onClick={() => updateBonusScore('B', -100)}>-100</Button>
              </div>
              <div className="flex gap-1 mt-1 border-t border-border/50 pt-1.5">
                <Input
                  type="number"
                  placeholder="직접 입력"
                  className="h-7 w-20 text-[11px]"
                  value={manualBonusB}
                  onChange={(e) => setManualBonusB(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddManualBonus('B')}
                />
                <Button size="xs" onClick={() => handleAddManualBonus('B')}>추가</Button>
              </div>
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
          <Button variant="secondary" onClick={triggerAnnouncement} className="gap-2 shrink-0">
            대형 공지 띄우기
          </Button>
          <Button variant="outline" onClick={() => setAnnouncement('')} className="gap-2 shrink-0 text-destructive border-destructive hover:bg-destructive/10">
            초기화
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
                  <span className="font-['Pretendard'] text-lg text-foreground">{event.name}</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${event.status === 'COMPLETED' ? 'bg-completed text-completed-foreground' :
                    event.status === 'IN_PROGRESS' ? 'bg-inprogress/20 text-inprogress' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                    {event.status === 'COMPLETED' ? '완료' : event.status === 'IN_PROGRESS' ? '진행중' : '예정'}
                  </span>
                  <div className="flex items-center gap-2 bg-secondary/30 px-2 py-1 rounded border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">경과 시간 (분)</span>
                    <Input
                      type="number"
                      value={durationInputs[event.id] || ''}
                      onChange={(e) => setDurationInputs(prev => ({ ...prev, [event.id]: e.target.value }))}
                      onBlur={() => {
                        const val = parseInt(durationInputs[event.id]);
                        if (!isNaN(val) && val > 0) {
                          updateEventDuration(event.id, val);
                        }
                      }}
                      className="h-6 w-14 text-xs px-1 text-center"
                    />
                  </div>
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

              {event.teamA && event.teamB && (
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-1 bg-secondary/20 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground w-12 truncate">{event.teamA}</span>
                    <Button size="xs" variant="ghost" className="h-7 w-7 p-0" onClick={() => updateScore(event.id, 'A', -1)}><Minus size={14} /></Button>
                    <span className="font-['Pretendard'] text-lg font-bold w-6 text-center text-foreground">{event.scoreA}</span>
                    <Button size="xs" variant="ghost" className="h-7 w-7 p-0" onClick={() => updateScore(event.id, 'A', 1)}><Plus size={14} /></Button>
                    <div className="flex gap-1 ml-1 border-l border-border pl-2 pr-2">
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'A', 2)}>+2</Button>
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'A', 3)}>+3</Button>
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'A', 5)}>+5</Button>
                    </div>
                    <div className="flex gap-1 border-l border-border pl-2">
                      <Input
                        type="number"
                        placeholder="+n"
                        className="h-6 w-12 text-[10px] px-1"
                        value={eventManualInputs[event.id]?.A || ''}
                        onChange={(e) => handleEventManualInputChange(event.id, 'A', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddManualEventScore(event.id, 'A')}
                      />
                      <Button size="xs" className="h-6 px-1.5 text-[10px]" onClick={() => handleAddManualEventScore(event.id, 'A')}>추가</Button>
                    </div>
                  </div>

                  <span className="text-muted-foreground font-bold text-xs">VS</span>

                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-1 bg-secondary/20 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground w-12 truncate">{event.teamB}</span>
                    <Button size="xs" variant="ghost" className="h-7 w-7 p-0" onClick={() => updateScore(event.id, 'B', -1)}><Minus size={14} /></Button>
                    <span className="font-['Pretendard'] text-lg font-bold w-6 text-center text-foreground">{event.scoreB}</span>
                    <Button size="xs" variant="ghost" className="h-7 w-7 p-0" onClick={() => updateScore(event.id, 'B', 1)}><Plus size={14} /></Button>
                    <div className="flex gap-1 ml-1 border-l border-border pl-2 pr-2">
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'B', 2)}>+2</Button>
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'B', 3)}>+3</Button>
                      <Button size="xs" variant="secondary" className="h-6 px-1.5 text-[10px]" onClick={() => updateScore(event.id, 'B', 5)}>+5</Button>
                    </div>
                    <div className="flex gap-1 border-l border-border pl-2">
                      <Input
                        type="number"
                        placeholder="+n"
                        className="h-6 w-12 text-[10px] px-1"
                        value={eventManualInputs[event.id]?.B || ''}
                        onChange={(e) => handleEventManualInputChange(event.id, 'B', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddManualEventScore(event.id, 'B')}
                      />
                      <Button size="xs" className="h-6 px-1.5 text-[10px]" onClick={() => handleAddManualEventScore(event.id, 'B')}>추가</Button>
                    </div>
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
