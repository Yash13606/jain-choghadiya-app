export type ChoghadiyaKey =
  | "AMRIT"
  | "SHUBH"
  | "LABH"
  | "CHANCHAL"
  | "UDVEG"
  | "KAAL"
  | "ROG";

export type Favorability = "good" | "neutral" | "bad";

export interface ChoghadiyaMeta {
  key: ChoghadiyaKey;
  devanagari: string;
  english: string;
  description: string;
  favorability: Favorability;
}

export const CHOGHADIYA_META: Record<ChoghadiyaKey, ChoghadiyaMeta> = {
  AMRIT: {
    key: "AMRIT",
    devanagari: "अमृत",
    english: "Amrit",
    description: "Nectar – Best for all work",
    favorability: "good"
  },
  SHUBH: {
    key: "SHUBH",
    devanagari: "शुभ",
    english: "Shubh",
    description: "Auspicious – Good for work",
    favorability: "good"
  },
  LABH: {
    key: "LABH",
    devanagari: "लाभ",
    english: "Labh",
    description: "Profit – Good for gains",
    favorability: "good"
  },
  CHANCHAL: {
    key: "CHANCHAL",
    devanagari: "चंचल",
    english: "Chanchal",
    description: "Unstable – Not for important tasks",
    favorability: "neutral"
  },
  UDVEG: {
    key: "UDVEG",
    devanagari: "उद्वेग",
    english: "Udveg",
    description: "Stress – Avoid major tasks",
    favorability: "bad"
  },
  KAAL: {
    key: "KAAL",
    devanagari: "काल",
    english: "Kaal",
    description: "Negative – Avoid important work",
    favorability: "bad"
  },
  ROG: {
    key: "ROG",
    devanagari: "रोग",
    english: "Rog",
    description: "Illness – Avoid travel / important work",
    favorability: "bad"
  }
};

export type Weekday =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export const WEEKDAY_LABELS: Record<
  Weekday,
  { english: string; devanagari: string }
> = {
  SUNDAY: { english: "Sunday", devanagari: "रवि" },
  MONDAY: { english: "Monday", devanagari: "सोम" },
  TUESDAY: { english: "Tuesday", devanagari: "मंगल" },
  WEDNESDAY: { english: "Wednesday", devanagari: "बुध" },
  THURSDAY: { english: "Thursday", devanagari: "गुरु" },
  FRIDAY: { english: "Friday", devanagari: "शुक्र" },
  SATURDAY: { english: "Saturday", devanagari: "शनि" }
};

export const FIXED_SUNRISE_MINUTES = 6 * 60; // 6:00 AM
export const FIXED_SUNSET_MINUTES = 18 * 60; // 6:00 PM

export interface ChoghadiyaSlot {
  startMinutes: number;
  endMinutes: number;
  type: ChoghadiyaKey;
}

export type ChoghadiyaPattern = ChoghadiyaKey[];

// Standard Choghadiya patterns for day and night for each weekday.
// Sequences based on traditional Choghadiya chart.
export const DAY_PATTERNS: Record<Weekday, ChoghadiyaPattern> = {
  MONDAY: [
    "AMRIT",
    "KAAL",
    "SHUBH",
    "ROG",
    "UDVEG",
    "CHANCHAL",
    "LABH",
    "AMRIT"
  ],
  TUESDAY: [
    "ROG",
    "UDVEG",
    "CHANCHAL",
    "LABH",
    "AMRIT",
    "KAAL",
    "SHUBH",
    "ROG"
  ],
  WEDNESDAY: [
    "LABH",
    "AMRIT",
    "KAAL",
    "SHUBH",
    "ROG",
    "UDVEG",
    "CHANCHAL",
    "LABH"
  ],
  THURSDAY: [
    "SHUBH",
    "ROG",
    "UDVEG",
    "CHANCHAL",
    "LABH",
    "AMRIT",
    "KAAL",
    "SHUBH"
  ],
  FRIDAY: [
    "CHANCHAL",
    "LABH",
    "AMRIT",
    "KAAL",
    "SHUBH",
    "ROG",
    "UDVEG",
    "CHANCHAL"
  ],
  SATURDAY: [
    "KAAL",
    "SHUBH",
    "ROG",
    "UDVEG",
    "CHANCHAL",
    "LABH",
    "AMRIT",
    "KAAL"
  ],
  SUNDAY: [
    "UDVEG",
    "CHANCHAL",
    "LABH",
    "AMRIT",
    "KAAL",
    "SHUBH",
    "ROG",
    "UDVEG"
  ]
};

export const NIGHT_PATTERNS: Record<Weekday, ChoghadiyaPattern> = {
  MONDAY: [
    "CHANCHAL",
    "ROG",
    "KAAL",
    "LABH",
    "UDVEG",
    "SHUBH",
    "AMRIT",
    "CHANCHAL"
  ],
  TUESDAY: [
    "KAAL",
    "LABH",
    "UDVEG",
    "SHUBH",
    "AMRIT",
    "CHANCHAL",
    "ROG",
    "KAAL"
  ],
  WEDNESDAY: [
    "UDVEG",
    "SHUBH",
    "AMRIT",
    "CHANCHAL",
    "ROG",
    "KAAL",
    "LABH",
    "UDVEG"
  ],
  THURSDAY: [
    "AMRIT",
    "CHANCHAL",
    "ROG",
    "KAAL",
    "LABH",
    "UDVEG",
    "SHUBH",
    "AMRIT"
  ],
  FRIDAY: [
    "ROG",
    "KAAL",
    "LABH",
    "UDVEG",
    "SHUBH",
    "AMRIT",
    "CHANCHAL",
    "ROG"
  ],
  SATURDAY: [
    "LABH",
    "UDVEG",
    "SHUBH",
    "AMRIT",
    "CHANCHAL",
    "ROG",
    "KAAL",
    "LABH"
  ],
  SUNDAY: [
    "SHUBH",
    "AMRIT",
    "CHANCHAL",
    "ROG",
    "KAAL",
    "LABH",
    "UDVEG",
    "SHUBH"
  ]
};

export function getWeekdayFromDate(date: Date): Weekday {
  const index = date.getDay(); // 0-6, Sunday = 0
  const values: Weekday[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ];
  return values[index];
}

export function generateSlots(
  startMinutes: number,
  endMinutes: number,
  pattern: ChoghadiyaPattern
): ChoghadiyaSlot[] {
  const total = endMinutes - startMinutes;
  const segment = total / pattern.length;
  return pattern.map((type, index) => {
    const slotStart = startMinutes + segment * index;
    const slotEnd = slotStart + segment;
    return {
      startMinutes: Math.round(slotStart),
      endMinutes: Math.round(slotEnd),
      type
    };
  });
}

export function formatMinutesToTime(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const paddedMin = m.toString().padStart(2, "0");
  return `${hour12}:${paddedMin} ${period}`;
}


