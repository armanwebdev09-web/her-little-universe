import React from 'react';
import { Hero } from '../components/Hero';
import { BirthdayCountdown } from '../components/BirthdayCountdown';
import { DailySurpriseTeaserCard } from '../components/DailySurpriseTeaserCard';
import { StoryPreviewSection } from '../components/StoryPreviewSection';
import { LittleThingsTeaserSection } from '../components/LittleThingsTeaserSection';
import { UniverseTeaserSection } from '../components/UniverseTeaserSection';
import { DailySong } from '../components/DailySong';
import { LoveQuote } from '../components/LoveQuote';

export const Home = () => {
  return (
    <>
      <Hero />
      <BirthdayCountdown />
      <DailySurpriseTeaserCard />
      <StoryPreviewSection />
      <LittleThingsTeaserSection />
      <UniverseTeaserSection />
      <DailySong />
      <LoveQuote />
    </>
  );
};
