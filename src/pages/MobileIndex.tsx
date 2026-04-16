import { useCallback, useEffect, useState } from 'react';
import DigitalClock from '@/components/DigitalClock';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import MarqueeBanner from '@/components/MarqueeBanner';
import AnnouncementOverlay from '@/components/AnnouncementOverlay';
import { useEventStore, type SportEvent } from '@/store/useEventStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Trophy, Info } from 'lucide-react';

const MobileIndex = () => {
    const viewMode = useEventStore((s) => s.viewMode);
    const announcement = useEventStore((s) => s.announcement);
    const announcementTimestamp = useEventStore((s) => s.announcementTimestamp);
    const events = useEventStore((s) => s.events);
    const setViewMode = useEventStore((s) => s.setViewMode);

    const [showBigAnnouncement, setShowBigAnnouncement] = useState(false);
    const [activeTab, setActiveTab] = useState<'status' | 'schedule'>('status');

    const currentIdx = events.findIndex((e) => e.status === 'IN_PROGRESS');
    const currentEvent = currentIdx >= 0 ? events[currentIdx] : null;

    useEffect(() => {
        if (announcementTimestamp > 0) {
            setShowBigAnnouncement(true);
            const timer = setTimeout(() => setShowBigAnnouncement(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [announcementTimestamp]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Trophy className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        DIMI-SCORE
                    </h1>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="text-sm font-bold text-gray-700 tabular-nums">
                        <RealTimeClock />
                    </span>
                </div>
            </header>

            {/* Main Content Scrollable Area */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
                <AnimatePresence mode="wait">
                    {viewMode === 'IN_PROGRESS' && currentEvent && (
                        <motion.div
                            key="in-progress"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Trophy size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        LIVE NOW
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-blue-100 opacity-80 uppercase tracking-widest font-bold">EVENT</p>
                                        <p className="text-lg font-black">{currentEvent.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 relative z-10">
                                    <div className="flex-1 text-center">
                                        <motion.div
                                            key={currentEvent.scoreA}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-7xl font-black mb-2"
                                        >
                                            {currentEvent.scoreA}
                                        </motion.div>
                                        <p className="text-[10px] font-bold opacity-60 uppercase">TEAM A</p>
                                    </div>
                                    <div className="w-px h-16 bg-white/20" />
                                    <div className="flex-1 text-center">
                                        <motion.div
                                            key={currentEvent.scoreB}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-7xl font-black mb-2"
                                        >
                                            {currentEvent.scoreB}
                                        </motion.div>
                                        <p className="text-[10px] font-bold opacity-60 uppercase">TEAM B</p>
                                    </div>
                                </div>

                                {/* Mobile Progress Bar */}
                                <div className="mt-8 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-blue-100 opacity-60">
                                        <span>PROGRESS</span>
                                        <span>{Math.round(currentEvent.scoreA / (currentEvent.scoreA + currentEvent.scoreB + 1) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '65%' }}
                                            className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'PREPARATION' && (
                        <motion.div
                            key="preparation"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-2">
                                <Clock size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">NEXT MATCH READY</h2>
                            <p className="text-gray-500 font-medium">The stadium is preparing for the next event. Stay tuned!</p>
                            <button
                                onClick={() => setViewMode('TIMETABLE')}
                                className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                View Timetable
                            </button>
                        </motion.div>
                    )}

                    {(viewMode === 'TIMETABLE' || !viewMode) && (
                        <motion.div
                            key="timetable"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-black text-gray-900">TODAY'S SCHEDULE</h3>
                                <Calendar size={20} className="text-gray-400" />
                            </div>

                            <div className="space-y-3">
                                {events.map((event, idx) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`p-5 rounded-2xl border transition-all ${event.status === 'IN_PROGRESS'
                                                ? 'bg-blue-50 border-blue-100 ring-2 ring-blue-500/20'
                                                : 'bg-white border-gray-100 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 text-center py-2 rounded-xl font-bold ${event.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <span className="text-sm">{event.time}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{event.name}</h4>
                                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-0.5">
                                                    {event.status === 'IN_PROGRESS' ? '• LIVE NOW' : event.status}
                                                </p>
                                            </div>
                                            {event.status === 'COMPLETED' && (
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">FINAL</p>
                                                    <p className="text-sm font-bold text-gray-700">{event.scoreA} : {event.scoreB}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Persistent Bottom UI */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40">
                <MarqueeBanner />
            </footer>

            {/* Announcements */}
            <AnnouncementOverlay show={showBigAnnouncement} announcement={announcement} />
        </div>
    );
};

const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span>
            {time.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

export default MobileIndex;
