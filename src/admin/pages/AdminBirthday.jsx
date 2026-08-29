import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Eye, X, Clock, Calendar, CheckCircle2, Heart, AlertTriangle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { birthdayData } from '../../data/birthdayData';
import { useAdminToast } from '../../context/AdminToastContext';
import { BirthdayHero } from '../../components/BirthdayHero';
import { BirthdayLetter } from '../../components/BirthdayLetter';
import { BirthdayGifts } from '../../components/BirthdayGifts';
import { BirthdaySongSection } from '../../components/BirthdaySongSection';
import { BirthdayStorySection } from '../../components/BirthdayStorySection';
import { BirthdayLittleThingsSection } from '../../components/BirthdayLittleThingsSection';
import { UniverseRecap } from '../../components/UniverseRecap';
import { BirthdayEnding } from '../../components/BirthdayEnding';
import { api } from '../../services/api';

export const AdminBirthday = () => {
  const { showToast } = useAdminToast();
  const [bdayDate, setBdayDate] = useState(siteConfig.birthdayDate);
  const [herName, setHerName] = useState(siteConfig.herName);
  const [heroMessage, setHeroMessage] = useState(birthdayData.subheading);
  const [birthdayLetter, setBirthdayLetter] = useState(birthdayData.letter.paragraphs.join("\n\n"));
  const [finalMessage, setFinalMessage] = useState(birthdayData.finalMessage.paragraph);
  const [statusState, setStatusState] = useState('BEFORE_BIRTHDAY');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.getBirthdayStatus();
        if (res.success && res.data) {
          setStatusState(res.data.state);
          setBdayDate(res.data.birthdayDate || siteConfig.birthdayDate);
          setHerName(res.data.herName || siteConfig.herName);
        }

        const configRes = await api.getBirthdayConfig();
        if (configRes.success && configRes.data) {
          setHeroMessage(configRes.data.heroMessage || birthdayData.subheading);
          setBirthdayLetter(configRes.data.birthdayLetter || birthdayData.letter.paragraphs.join("\n\n"));
          setFinalMessage(configRes.data.finalMessage || birthdayData.finalMessage.paragraph);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchStatus();
  }, []);

  const hasPlaceholders =
    [herName, heroMessage, birthdayLetter, finalMessage].some((str) =>
      Boolean(
        str &&
          (str.includes('[WRITE') ||
            str.includes('[ADD') ||
            str.includes('[HER_NAME]') ||
            str.includes('[PLACEHOLDER]'))
      )
    );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateBirthdayConfig({
        birthdayDate: bdayDate,
        herName,
        heroMessage,
        birthdayLetter,
        finalMessage,
      });
      showToast('Birthday settings saved successfully');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Birthday Experience Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Configure Kashish's birthday messages, countdown date, and preview reveal experience.</p>
        </div>

        <button
          onClick={() => setIsPreviewOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Preview as Kashish (Simulate Reveal)</span>
        </button>
      </div>

      {/* Admin Placeholder Completeness Warning */}
      {hasPlaceholders && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Birthday content is incomplete.</strong> Replace remaining placeholder text (e.g. <code>[WRITE YOUR MESSAGE HERE]</code>) before her birthday date.
          </span>
        </div>
      )}

      {/* Live Birthday State Status Badge */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">CURRENT ENGINE STATE</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {statusState === 'BEFORE_BIRTHDAY' && '⏳ BEFORE_BIRTHDAY (Countdown Active)'}
              {statusState === 'BIRTHDAY' && '🎂 BIRTHDAY (Experience Unlocked Today)'}
              {statusState === 'AFTER_BIRTHDAY' && '❤️ AFTER_BIRTHDAY (Permanent Historical Record)'}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Asia/Kolkata Timezone
        </span>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Configured Birthday Date (YYYY-MM-DDTHH:MM:SS)</label>
              <input
                type="text"
                value={bdayDate}
                onChange={(e) => setBdayDate(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Her Name / Title</label>
              <input
                type="text"
                value={herName}
                onChange={(e) => setHerName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hero Subheading</label>
            <input
              type="text"
              value={heroMessage}
              onChange={(e) => setHeroMessage(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-serif"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Birthday Letter Content</label>
            <textarea
              rows="5"
              value={birthdayLetter}
              onChange={(e) => setBirthdayLetter(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-serif"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Final Personal Message</label>
            <textarea
              rows="3"
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-serif"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold uppercase tracking-wider text-xs shadow-md cursor-pointer"
            >
              Save Birthday Settings
            </button>
          </div>
        </form>
      </div>

      {/* Birthday Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative w-full max-w-5xl bg-[#080B16] rounded-3xl p-6 sm:p-10 border border-[#D9A6B2]/30 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-5 right-5 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6 pb-4 border-b border-[#151B30]">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold bg-[#101528] text-[#D8B477] border border-[#D8B477]/30">
                ADMIN PREVIEW MODE - SIMULATING PUBLIC EXPERIENCE FOR KASHISH
              </span>
            </div>

            <BirthdayHero herName={herName} birthdayDate={bdayDate} />
            <BirthdayLetter letterText={birthdayLetter} />
            <BirthdayGifts onOpenLetter={() => {}} onOpenMemories={() => {}} onPlaySong={() => {}} />
            <BirthdaySongSection isPlaying={false} onTogglePlay={() => {}} />
            <BirthdayStorySection />
            <BirthdayLittleThingsSection />
            <UniverseRecap />
            <BirthdayEnding finalMessageText={finalMessage} />
          </div>
        </div>
      )}
    </div>
  );
};
