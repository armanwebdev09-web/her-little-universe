import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Camera,
  Mail,
  Lock,
  Gift,
  Plus,
  ArrowRight,
  Sparkles,
  Quote,
  Clock,
  AlertTriangle,
  Flame,
  Gift as SurpriseIcon,
  CheckCircle2,
  XCircle,
  Heart as StoryIcon,
  Flower2 as ThingIcon,
  CheckSquare,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { siteConfig } from '../../data/siteConfig';
import { api } from '../../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    songs: 0,
    memories: 0,
    letters: 0,
    secret: 0,
    story: 0,
    littleThings: 0,
    stars: 0,
    surprises: 0,
  });

  const [activities, setActivities] = useState([]);
  const [streak, setStreak] = useState(2);
  const [isTomorrowMissing, setIsTomorrowMissing] = useState(false);
  const [surpriseReadiness, setSurpriseReadiness] = useState({ today: false, tomorrow: false });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Birthday Readiness calculation state
  const [bdayChecklist, setBdayChecklist] = useState({
    name: false,
    date: false,
    hero: false,
    letter: false,
    finalMessage: false,
    song: false,
    memories: false,
    story: false,
    littleThings: false,
    universe: false,
    secret: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const songs = await adminService.getSongs();
      const memories = await adminService.getMemories();
      const letters = await adminService.getLetters();
      const secret = await adminService.getSecretItems();
      const acts = await adminService.getActivityLogs();

      let storyCount = 0;
      let thingsCount = 0;
      let starsCount = 0;
      let surprisesCount = 0;

      try {
        const storyRes = await api.getStoryEvents();
        if (storyRes.success && Array.isArray(storyRes.data)) storyCount = storyRes.data.length;
        const thingsRes = await api.getLittleThings();
        if (thingsRes.success && Array.isArray(thingsRes.data)) thingsCount = thingsRes.data.length;
        const starsRes = await api.getUniverseStars();
        if (starsRes.success && Array.isArray(starsRes.data)) starsCount = starsRes.data.length;
        const surprisesRes = await api.getSurprises();
        if (surprisesRes.success && Array.isArray(surprisesRes.data)) surprisesCount = surprisesRes.data.length;
      } catch (err) {
        // Fallback
      }

      setCounts({
        songs: songs.length,
        memories: memories.length,
        letters: letters.length,
        secret: secret.length,
        story: storyCount,
        littleThings: thingsCount,
        stars: starsCount,
        surprises: surprisesCount,
      });
      setActivities(acts);

      // Check if tomorrow's song is scheduled
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const tomorrowSong = songs.find((s) => s.date === tomorrowStr);
      setIsTomorrowMissing(!tomorrowSong);
      setStreak(songs.length > 0 ? songs.length : 1);

      // Check surprise readiness
      try {
        const surprisesRes = await api.getSurprises();
        if (surprisesRes.success && Array.isArray(surprisesRes.data)) {
          const todayStr = new Date().toISOString().split('T')[0];
          const hasTodaySurprise = surprisesRes.data.some((s) => s.date === todayStr && s.status === 'PUBLISHED');
          const hasTomorrowSurprise = surprisesRes.data.some((s) => s.date === tomorrowStr && s.status === 'PUBLISHED');
          setSurpriseReadiness({ today: hasTodaySurprise, tomorrow: hasTomorrowSurprise });
        }
      } catch (err) {
        // Fallback
      }

      // Compute Birthday Readiness Checklist
      try {
        const bdayRes = await api.getBirthdayConfig();
        if (bdayRes.success && bdayRes.data) {
          const cfg = bdayRes.data;
          setBdayChecklist({
            name: Boolean(cfg.herName && cfg.herName !== '[PLACEHOLDER]'),
            date: Boolean(cfg.birthdayDate),
            hero: Boolean(cfg.heroMessage),
            letter: Boolean(cfg.birthdayLetter),
            finalMessage: Boolean(cfg.finalMessage),
            song: Boolean(cfg.birthdaySongId || songs.length > 0),
            memories: memories.length > 0,
            story: storyCount > 0,
            littleThings: thingsCount > 0,
            universe: starsCount > 0,
            secret: secret.length > 0,
          });
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchData();
  }, []);

  // Calculate readiness percentage
  const totalChecks = Object.keys(bdayChecklist).length;
  const passedChecks = Object.values(bdayChecklist).filter(Boolean).length;
  const readinessPercent = Math.round((passedChecks / totalChecks) * 100);

  // Birthday Countdown timer logic
  useEffect(() => {
    const calc = () => {
      const target = new Date(siteConfig.birthdayDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Creator Content Center 💌
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage real personal content, track readiness, and schedule daily gifts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-semibold">
            Birthday Readiness: {readinessPercent}%
          </span>
        </div>
      </div>

      {/* Warning Banner */}
      {isTomorrowMissing && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Tomorrow's song hasn't been prepared yet.</strong> Add or schedule tomorrow's daily song to keep the soundtrack streak alive.
            </span>
          </div>
          <button
            onClick={() => navigate('/admin/songs')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs shrink-0 cursor-pointer"
          >
            Schedule Song
          </button>
        </div>
      )}

      {/* Birthday Readiness Engine & Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
              AUTOMATED READINESS CALCULATOR
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Birthday Grand Finale Readiness Score: <span className="text-rose-600">{readinessPercent}%</span>
            </h3>
          </div>

          <button
            onClick={() => navigate('/admin/birthday')}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-rose-500 transition-colors cursor-pointer"
          >
            Configure Birthday
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-sans">
          {Object.entries({
            'Her Name': bdayChecklist.name,
            'Birthday Date': bdayChecklist.date,
            'Hero Message': bdayChecklist.hero,
            'Birthday Letter': bdayChecklist.letter,
            'Final Message': bdayChecklist.finalMessage,
            'Birthday Song': bdayChecklist.song,
            'Memories': bdayChecklist.memories,
            'Story Milestones': bdayChecklist.story,
            'Little Things': bdayChecklist.littleThings,
            'Universe Stars': bdayChecklist.universe,
            'Secret Space': bdayChecklist.secret,
          }).map(([label, ok]) => (
            <div key={label} className={`p-2.5 rounded-xl border flex items-center space-x-2 ${ok ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-medium' : 'bg-amber-50/80 border-amber-200 text-amber-900'}`}>
              {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-amber-600 shrink-0" />}
              <span className="line-clamp-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Surprise Readiness Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <SurpriseIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">TODAY'S SURPRISE</span>
              <span className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                {surpriseReadiness.today ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>✓ Ready</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span>○ Not prepared</span>
                  </>
                )}
              </span>
            </div>
          </div>
          <button onClick={() => navigate('/admin/surprises')} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">
            Manage
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <SurpriseIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">TOMORROW'S SURPRISE</span>
              <span className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                {surpriseReadiness.tomorrow ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>✓ Ready</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span>○ Not prepared</span>
                  </>
                )}
              </span>
            </div>
          </div>
          <button onClick={() => navigate('/admin/surprises')} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">
            Manage
          </button>
        </div>
      </div>

      {/* Summary Cards Grid (All 9 Systems) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <div onClick={() => navigate('/admin/story')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Story Moments</span>
            <span className="text-3xl font-bold text-slate-900">{counts.story}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <StoryIcon className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/songs')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Songs & Streak</span>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-slate-900">{counts.songs}</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-semibold flex items-center space-x-1">
                <Flame className="w-3 h-3 text-rose-500" />
                <span>{streak}d</span>
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Music className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/memories')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Memories</span>
            <span className="text-3xl font-bold text-slate-900">{counts.memories}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/little-things')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">The Little Things</span>
            <span className="text-3xl font-bold text-slate-900">{counts.littleThings}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <ThingIcon className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/letters')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Letters</span>
            <span className="text-3xl font-bold text-slate-900">{counts.letters}</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/universe')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Universe Stars</span>
            <span className="text-3xl font-bold text-slate-900">{counts.stars}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/secret')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Secret Items</span>
            <span className="text-3xl font-bold text-slate-900">{counts.secret}</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div onClick={() => navigate('/admin/surprises')} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">Daily Surprises</span>
            <span className="text-3xl font-bold text-slate-900">{counts.surprises}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <SurpriseIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Birthday & Today's Song Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Birthday Countdown Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-3">
              <Gift className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-mono font-semibold">
                BIRTHDAY COUNTDOWN
              </span>
            </div>

            <h3 className="text-3xl font-bold mb-4">
              {timeLeft.days} <span className="text-xl font-normal text-slate-400">DAYS LEFT</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 mb-6">
              <div>
                <span className="text-base font-bold block">{timeLeft.days}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Days</span>
              </div>
              <div>
                <span className="text-base font-bold block">{timeLeft.hours}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Hours</span>
              </div>
              <div>
                <span className="text-base font-bold block">{timeLeft.minutes}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Mins</span>
              </div>
              <div>
                <span className="text-base font-bold block">{timeLeft.seconds}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/birthday')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Manage Birthday</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Song Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest font-mono font-semibold text-slate-500">
                TODAY'S SONG
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold font-mono">
                ✓ Published & Active
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={siteConfig.todaysSong.cover}
                alt={siteConfig.todaysSong.title}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {siteConfig.todaysSong.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {siteConfig.todaysSong.artist}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/songs')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Manage Today's Song</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold mb-4">
          RECENT ACTIVITY
        </h3>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{act.icon || '📌'}</span>
                <span className="text-xs font-semibold text-slate-800">
                  {act.action}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-[#B8B6C4] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{act.time || 'Recently'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
