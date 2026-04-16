import { useState, useEffect } from 'react';
import { useEventStore, type ViewMode } from '@/store/useEventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Monitor, Play, AlertTriangle, Plus, Minus, RotateCcw, Send, Lock, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const { viewMode, setViewMode, events, setEventStatus, updateScore, resetScore, setAnnouncement, bonusScoreA, bonusScoreB, updateBonusScore, resetBonusScore, triggerAnnouncement, updateEventDuration, updateEventSetDuration, resetSetTimer, resetToDefaultSchedule } = useEventStore();
  const [announcementInput, setAnnouncementInput] = useState('');
  const [manualBonusA, setManualBonusA] = useState('');
  const [manualBonusB, setManualBonusB] = useState('');
  const [eventManualInputs, setEventManualInputs] = useState<Record<string, { A: string; B: string }>>({});
  const [overallDurationInputs, setOverallDurationInputs] = useState<Record<string, string>>({});
  const [setDurationInputs, setSetSetDurationInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const dInputs: Record<string, string> = {};
    const sInputs: Record<string, string> = {};
    events.forEach(e => {
      dInputs[e.id] = e.duration?.toString() || '40';
      sInputs[e.id] = e.setDuration?.toString() || '15';
    });
    setOverallDurationInputs(dInputs);
    setSetSetDurationInputs(sInputs);
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

  const [suggestion, setSuggestion] = useState<{ viewMode: ViewMode; eventId?: string; eventName?: string } | null>(null);
  const [lastSuggestedId, setLastSuggestedId] = useState<string>('');

  useEffect(() => {
    const checkSchedule = () => {
      if (events.length === 0) return;

      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

      const getMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };

      let recommended: { viewMode: ViewMode; eventId?: string; eventName?: string } | null = null;

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const nextEvent = events[i + 1];
        const startTime = getMinutes(event.time);
        const duration = event.duration || 40;
        const endTime = startTime + duration;

        if (currentTotalMinutes >= startTime && currentTotalMinutes < endTime) {
          if (event.name === '개회식' || event.name === '폐회식') {
            recommended = { viewMode: 'TIMETABLE', eventId: event.id, eventName: event.name };
          } else {
            recommended = { viewMode: 'IN_PROGRESS', eventId: event.id, eventName: event.name };
          }
          break;
        } else if (nextEvent && currentTotalMinutes >= endTime && currentTotalMinutes < getMinutes(nextEvent.time)) {
          recommended = { viewMode: 'PREPARATION', eventId: nextEvent.id, eventName: nextEvent.name };
          break;
        }
      }

      if (!recommended) {
        recommended = { viewMode: 'TIMETABLE' };
      }

      const activeEvent = events.find(e => e.status === 'IN_PROGRESS');
      let isMismatch = false;

      if (recommended.viewMode !== viewMode) {
        isMismatch = true;
      } else if (recommended.viewMode === 'IN_PROGRESS' && activeEvent?.id !== recommended.eventId) {
        isMismatch = true;
      }

      if (isMismatch) {
        const suggestionKey = `${recommended.viewMode}-${recommended.eventId || 'none'}`;
        if (suggestionKey !== lastSuggestedId) {
          setSuggestion(recommended);
        }
      } else {
        setSuggestion(null);
      }
    };

    const timer = setInterval(checkSchedule, 5000);
    return () => clearInterval(timer);
  }, [events, viewMode, lastSuggestedId]);

  const applySuggestion = () => {
    if (!suggestion) return;

    if (suggestion.viewMode === 'IN_PROGRESS' && suggestion.eventId) {
      setEventStatus(suggestion.eventId, 'IN_PROGRESS');
      setViewMode('IN_PROGRESS');
    } else if (suggestion.viewMode === 'PREPARATION') {
      setViewMode('PREPARATION');
    } else {
      setViewMode('TIMETABLE');
    }

    setLastSuggestedId(`${suggestion.viewMode}-${suggestion.eventId || 'none'}`);
    setSuggestion(null);
    toast.success('시간표에 맞춰 화면이 자동으로 설정되었습니다.');
  };

  const ignoreSuggestion = () => {
    if (!suggestion) return;
    setLastSuggestedId(`${suggestion.viewMode}-${suggestion.eventId || 'none'}`);
    setSuggestion(null);
  };

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
            <p className="text-sm text-muted-foreground text-center mt-2">학생회 관련자가 아닌 분들은 접근하지 말아주세요.</p>
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

      <section>
        <div className="flex items-center justify-between mb-3 max-w-3xl">
          <h2 className="text-xl font-semibold text-muted-foreground">종목 관리</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              if (confirm('모든 종목 데이터를 초기화하고 기본 시간표로 덮어씌우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                await resetToDefaultSchedule();
                toast.success('기본 시간표로 초기화되었습니다.');
              }
            }}
            className="gap-1 h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
          >
            <RotateCcw size={14} /> 기본 시간표로 초기화
          </Button>
        </div>
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-secondary/30 px-2 py-1 rounded border border-border/50">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">경기 시간(분)</span>
                      <Input
                        type="number"
                        value={overallDurationInputs[event.id] || ''}
                        onChange={(e) => setOverallDurationInputs(prev => ({ ...prev, [event.id]: e.target.value }))}
                        onBlur={() => {
                          const val = parseInt(overallDurationInputs[event.id]);
                          if (!isNaN(val) && val > 0) {
                            updateEventDuration(event.id, val);
                          }
                        }}
                        className="h-6 w-14 text-xs px-1 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-pink-50/50 px-2 py-1 rounded border border-pink-100">
                      <span className="text-[10px] uppercase font-bold text-pink-600">세트 시간(분)</span>
                      <Input
                        type="number"
                        value={setDurationInputs[event.id] || ''}
                        onChange={(e) => setSetSetDurationInputs(prev => ({ ...prev, [event.id]: e.target.value }))}
                        onBlur={() => {
                          const val = parseInt(setDurationInputs[event.id]);
                          if (!isNaN(val) && val > 0) {
                            updateEventSetDuration(event.id, val);
                          }
                        }}
                        className="h-6 w-14 text-xs px-1 text-center border-pink-200"
                      />
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const val = parseInt(setDurationInputs[event.id]);
                            if (!isNaN(val) && val > 0 && val !== event.setDuration) {
                              updateEventSetDuration(event.id, val);
                            }
                            resetSetTimer(event.id);
                            toast.success(`${event.name} 세트 타이머가 시작되었습니다.`);
                          }}
                          className="h-7 px-2 text-xs font-bold text-pink-500 hover:text-pink-600 hover:bg-pink-100 gap-1 border border-pink-100"
                        >
                          <Play size={12} fill="currentColor" /> 시작
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            resetSetTimer(event.id);
                            toast.success(`${event.name} 세트 타이머가 초기화되었습니다.`);
                          }}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-50"
                          title="카운트다운 초기화"
                        >
                          <RotateCcw size={12} />
                        </Button>
                      </div>
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
            </div>
          ))}
        </div>
      </section>
      {/* Auto Suggestion Dialog */}
      <Dialog open={suggestion !== null} onOpenChange={(open) => !open && ignoreSuggestion()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="text-primary" size={20} />
              자동 화면 전환 제안
            </DialogTitle>
            <DialogDescription className="py-2">
              현재 시간은 <strong>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>입니다. <br />
              시간표에 따라 화면을 <strong>{
                suggestion?.viewMode === 'TIMETABLE' ? '시간표(기본)' :
                  suggestion?.viewMode === 'IN_PROGRESS' ? `경기 진행 (${suggestion.eventName})` :
                    `준비 화면 (${suggestion?.eventName} 대기)`
              }</strong> 모드로 전환할까요?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="secondary" onClick={ignoreSuggestion}>
              나중에 하기
            </Button>
            <Button onClick={applySuggestion}>
              지금 전환하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
