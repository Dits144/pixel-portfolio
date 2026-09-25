"use client";

import Timeline, { type JourneyItem } from "@/components/ui/timeline";
import type { Experience } from "@/types";

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  // Map experiences to JourneyItem structure
  // Top items: Even indices (e.g. 0, 2)
  // Bottom items: Odd indices (e.g. 1, 3)
  // Use English month names that match monthOrder in timeline.tsx for accurate chronological ordering
  const englishMonths = ["March", "July", "November", "October", "April", "September"] as const;

  const mappedItems: JourneyItem[] = (experiences || []).map((exp, idx) => {
    // Extract year from period e.g. "2024 — Sekarang", "2022 — 2024", "2019 — 2020"
    const startYearMatch = exp.period.match(/\b(20\d\d|19\d\d)\b/);
    const year = startYearMatch ? startYearMatch[0] : "2024";

    // Content: Position @ Company + description
    const content = `${exp.position} — ${exp.company}. ${exp.description}`;

    return {
      id: exp.id,
      year,
      month: englishMonths[idx % englishMonths.length] ?? "January",
      content,
    };
  });

  // Sort chronologically ascending (earliest year first, e.g. 2019 -> 2021 -> 2022 -> 2024)
  // so the timeline flows from left (past/2019) to right (present/2026)
  const sortedItems = [...mappedItems].sort((a, b) => {
    return Number(a.year) - Number(b.year);
  });

  const topItems: JourneyItem[] = [];
  const bottomItems: JourneyItem[] = [];

  sortedItems.forEach((item, index) => {
    if (index % 2 === 0) {
      topItems.push(item);
    } else {
      bottomItems.push(item);
    }
  });

  return (
    <Timeline
      title="Jejak Karir"
      periodLabel="2019 — 2026"
      textColor="var(--color-foreground, #f4f4f5)"
      mutedTextColor="var(--color-muted-foreground, #a1a1aa)"
      activeColor="oklch(0.68 0.22 250)"
      backgroundColor="transparent"
      imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
      imageAlt="Muhammad Raditya Anwar - Cyber Security & Fullstack Developer"
      duration={1.2}
      topItems={topItems.length > 0 ? topItems : undefined}
      bottomItems={bottomItems.length > 0 ? bottomItems : undefined}
    />
  );
}
