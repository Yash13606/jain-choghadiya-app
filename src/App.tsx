import React, { useMemo, useState, useRef, useEffect } from "react";
import { CalendarDays, Clock3, SunMedium, Info, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  CHOGHADIYA_META,
  DAY_PATTERNS,
  FIXED_SUNRISE_MINUTES,
  FIXED_SUNSET_MINUTES,
  NIGHT_PATTERNS,
  WEEKDAY_LABELS,
  ChoghadiyaSlot,
  Favorability,
  formatMinutesToTime,
  getWeekdayFromDate,
  Weekday,
  generateSlots
} from "./choghadiyaData";
import {
  JAIN_TITHI_2026,
  TITHI_COLORS,
  TITHI_DESCRIPTIONS,
  getDaysInMonth,
  getFirstDayOfMonth,
  getTithiForDate,
  MonthData
} from "./jainTithiData";


type TabKey = "DAY" | "NIGHT";
type ViewKey = "CHOGHADIYA" | "CALENDAR";

interface CurrentInfo {
  period: TabKey;
  slot: ChoghadiyaSlot | null;
}

function getCurrentInfo(
  daySlots: ChoghadiyaSlot[],
  nightSlots: ChoghadiyaSlot[]
): CurrentInfo {
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  if (
    minutesNow >= FIXED_SUNRISE_MINUTES &&
    minutesNow < FIXED_SUNSET_MINUTES
  ) {
    const slot =
      daySlots.find(
        (slot) =>
          minutesNow >= slot.startMinutes && minutesNow < slot.endMinutes
      ) ?? null;
    return { period: "DAY", slot };
  }

  // Night period spans from 18:00 to next day 06:00
  const normalizedNow =
    minutesNow >= FIXED_SUNSET_MINUTES
      ? minutesNow
      : minutesNow + 24 * 60; // after midnight, push into next day range
  const nightStart = FIXED_SUNSET_MINUTES;
  const nightEnd = 24 * 60 + FIXED_SUNRISE_MINUTES;

  if (normalizedNow >= nightStart && normalizedNow < nightEnd) {
    const slot =
      nightSlots.find(
        (slot) =>
          normalizedNow >= slot.startMinutes &&
          normalizedNow < slot.endMinutes
      ) ?? null;
    return { period: "NIGHT", slot };
  }

  return { period: "DAY", slot: null };
}

function favorabilityLabel(favorability: Favorability): string {
  if (favorability === "good") return "GOOD";
  if (favorability === "neutral") return "NEUTRAL";
  return "UNFAVORABLE";
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewKey>("CHOGHADIYA");
  const [activeTab, setActiveTab] = useState<TabKey>("DAY");


  const today = useMemo(() => new Date(), []);
  const weekday: Weekday = getWeekdayFromDate(today);
  const weekdayLabels = WEEKDAY_LABELS[weekday];

  const dayPattern = DAY_PATTERNS[weekday];
  const nightPattern = NIGHT_PATTERNS[weekday];

  const daySlots = useMemo(
    () =>
      generateSlots(FIXED_SUNRISE_MINUTES, FIXED_SUNSET_MINUTES, dayPattern),
    [dayPattern]
  );
  const nightSlots = useMemo(
    () =>
      generateSlots(
        FIXED_SUNSET_MINUTES,
        24 * 60 + FIXED_SUNRISE_MINUTES,
        nightPattern
      ),
    [nightPattern]
  );

  // Weekly overview state (defaults to today)
  const [weeklyWeekday, setWeeklyWeekday] = useState<Weekday>(weekday);

  // Jain Tithi Calendar state
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(today.getMonth());
  const [selectedTithiFilter, setSelectedTithiFilter] = useState<string | null>(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState<{ date: number; tithis: string[] } | null>(null);

  const weeklyDaySlots = useMemo(
    () =>
      generateSlots(
        FIXED_SUNRISE_MINUTES,
        FIXED_SUNSET_MINUTES,
        DAY_PATTERNS[weeklyWeekday]
      ),
    [weeklyWeekday]
  );

  const weeklyNightSlots = useMemo(
    () =>
      generateSlots(
        FIXED_SUNSET_MINUTES,
        24 * 60 + FIXED_SUNRISE_MINUTES,
        NIGHT_PATTERNS[weeklyWeekday]
      ),
    [weeklyWeekday]
  );

  const currentInfo = getCurrentInfo(daySlots, nightSlots);
  const effectiveTab: TabKey = activeTab;

  const currentMeta =
    currentInfo.slot != null
      ? CHOGHADIYA_META[currentInfo.slot.type]
      : null;

  const currentFavorability: Favorability | null = currentMeta
    ? currentMeta.favorability
    : null;

  const currentBadgeClass =
    currentFavorability === "good"
      ? "badge-good"
      : currentFavorability === "neutral"
        ? "badge-neutral"
        : currentFavorability === "bad"
          ? "badge-bad"
          : "";

  const slotsToRender = effectiveTab === "DAY" ? daySlots : nightSlots;

  const isSlotCurrent = (slot: ChoghadiyaSlot): boolean => {
    if (!currentInfo.slot) return false;
    return (
      slot.startMinutes === currentInfo.slot.startMinutes &&
      slot.endMinutes === currentInfo.slot.endMinutes &&
      currentInfo.period === effectiveTab
    );
  };

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const formattedTime = today.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });

  const WEEK_ORDER: Weekday[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  const isWeeklyCurrent = (slot: ChoghadiyaSlot, period: TabKey): boolean => {
    if (!currentInfo.slot) return false;
    if (weeklyWeekday !== weekday) return false;
    return (
      currentInfo.period === period &&
      slot.startMinutes === currentInfo.slot.startMinutes &&
      slot.endMinutes === currentInfo.slot.endMinutes
    );
  };



  return (
    <div className="min-h-screen bg-[rgb(253,251,247)] text-stone-900">
      <header className="px-4 pt-6 pb-2">
        <div className="mx-auto max-w-5xl">
          {/* Tab Navigation */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <button
              type="button"
              onClick={() => setActiveView("CHOGHADIYA")}
              className={`text-center transition-all duration-200 ${activeView === "CHOGHADIYA"
                ? "opacity-100"
                : "opacity-40 hover:opacity-70"
                }`}
            >
              <h1 className="font-devanagari text-2xl sm:text-3xl md:text-4xl tracking-normal text-stone-900">
                चौघड़िया कैल्कुलेटर
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Choghadiya Calculator – Find Auspicious Time Periods
              </p>
              {activeView === "CHOGHADIYA" && (
                <div className="mt-2 h-0.5 w-full bg-stone-900 rounded-full" />
              )}
            </button>

            <div className="hidden sm:block h-12 w-px bg-stone-300" />

            <button
              type="button"
              onClick={() => setActiveView("CALENDAR")}
              className={`text-center transition-all duration-200 ${activeView === "CALENDAR"
                ? "opacity-100"
                : "opacity-40 hover:opacity-70"
                }`}
            >
              <h1 className="font-devanagari text-2xl sm:text-3xl md:text-4xl tracking-normal text-stone-900">
                जैन तिथि कैलेंडर 2026
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Jain Tithi Calendar 2026 – Traditional Lunar Dates
              </p>
              {activeView === "CALENDAR" && (
                <div className="mt-2 h-0.5 w-full bg-stone-900 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-8">
        {/* Choghadiya Calculator Content */}
        {activeView === "CHOGHADIYA" && (
          <>
            {/* Top summary card */}
            <section className="grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-stone-200/80 sm:grid-cols-[1.1fr,1.3fr,0.9fr] sm:p-5 md:p-6">
              {/* Left: date + sunrise/sunset */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 rounded-full bg-stone-100 p-1.5 text-stone-500">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{formattedDate}</div>
                    <div className="mt-0.5 text-xs text-stone-500">
                      <span className="font-devanagari font-serif text-sm font-semibold">
                        {weekdayLabels.devanagari}
                      </span>
                      <span className="mx-1">·</span>
                      <span>{weekdayLabels.english}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2 py-1">
                    <SunMedium className="h-3.5 w-3.5 text-amber-500" />
                    <span>Sunrise: {formatMinutesToTime(FIXED_SUNRISE_MINUTES)}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2 py-1">
                    <SunMedium className="h-3.5 w-3.5 rotate-180 text-orange-600" />
                    <span>Sunset: {formatMinutesToTime(FIXED_SUNSET_MINUTES)}</span>
                  </div>
                </div>
              </div>

              {/* Center: current choghadiya */}
              <div className="text-left">
                <div className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-stone-500">
                  CURRENT CHOGHADIYA
                </div>
                {currentMeta ? (
                  <div className={`rounded-xl border px-3 py-2.5 ${currentFavorability === "good"
                    ? "border-emerald-100/90 bg-emerald-50/40"
                    : currentFavorability === "neutral"
                      ? "border-amber-100/90 bg-amber-50/40"
                      : "border-red-100/90 bg-red-50/40"
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-3 w-3 rounded-full ${currentFavorability === "good"
                        ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]"
                        : currentFavorability === "neutral"
                          ? "bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.35)]"
                          : "bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.35)]"
                        }`} />
                      <span className="font-devanagari font-serif text-lg font-semibold">
                        {currentMeta.devanagari}
                      </span>
                      <span className="text-sm font-medium text-stone-700">
                        {currentMeta.english}
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs text-stone-500">
                      {currentMeta.description}
                    </div>

                  </div>
                ) : (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-500">
                    No active slot
                  </div>
                )}
              </div>

              {/* Right: time + badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-xs text-stone-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{formattedTime}</span>
                </div>
                {currentFavorability && (
                  <div
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] ${currentBadgeClass === "badge-good"
                      ? "border border-emerald-400 bg-emerald-50 text-emerald-600"
                      : currentBadgeClass === "badge-neutral"
                        ? "border border-amber-400 bg-amber-50 text-amber-700"
                        : "border border-red-400 bg-red-50 text-red-600"
                      }`}
                  >
                    {favorabilityLabel(currentFavorability)}
                  </div>
                )}
              </div>
            </section>

            {/* Tabs */}
            <section className="mt-6 flex justify-center">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/80 p-1 text-xs shadow-sm">
                <button
                  className={`px-4 py-1.5 rounded-full transition-colors ${effectiveTab === "DAY"
                    ? "bg-stone-900 text-stone-50 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                    }`}
                  onClick={() => setActiveTab("DAY")}
                >
                  Day Choghadiya
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full transition-colors ${effectiveTab === "NIGHT"
                    ? "bg-stone-900 text-stone-50 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                    }`}
                  onClick={() => setActiveTab("NIGHT")}
                >
                  Night Choghadiya
                </button>
              </div>
            </section>

            {/* Timeline list */}
            <section className="mt-6">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                    <SunMedium className="h-4 w-4" />
                  </span>
                  <span>
                    {effectiveTab === "DAY" ? "Day Choghadiya" : "Night Choghadiya"}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  {effectiveTab === "DAY"
                    ? `${formatMinutesToTime(
                      FIXED_SUNRISE_MINUTES
                    )} – ${formatMinutesToTime(FIXED_SUNSET_MINUTES)}`
                    : `${formatMinutesToTime(
                      FIXED_SUNSET_MINUTES
                    )} – ${formatMinutesToTime(
                      24 * 60 + FIXED_SUNRISE_MINUTES
                    )}`}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {slotsToRender.map((slot) => {
                  const meta = CHOGHADIYA_META[slot.type];
                  const current = isSlotCurrent(slot);
                  const dotClass =
                    meta.favorability === "good"
                      ? "bg-emerald-500"
                      : meta.favorability === "neutral"
                        ? "bg-amber-500"
                        : "bg-red-500";

                  return (
                    <article
                      key={`${slot.startMinutes}-${slot.endMinutes}-${meta.key}`}
                      className={`grid items-center gap-3 rounded-2xl border bg-white/90 px-3.5 py-3 text-sm shadow-sm ring-1 ring-stone-200/80 sm:grid-cols-[minmax(120px,1.1fr)_2fr_auto] ${current
                        ? "border-emerald-400/80 bg-emerald-50/70 shadow-md ring-emerald-100"
                        : ""
                        }`}
                    >
                      <div className="text-xs font-medium text-stone-600">
                        {formatMinutesToTime(slot.startMinutes)} –{" "}
                        {formatMinutesToTime(slot.endMinutes)}
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-devanagari font-serif text-lg font-semibold">
                            {meta.devanagari}
                          </span>
                          <span className="text-xs text-stone-500">
                            {meta.english}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {meta.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-xs">
                        {current && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Current
                          </span>
                        )}
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full ${dotClass}`}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Legend / understanding card */}
            <section className="mt-8">
              <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-stone-500" />
                  <h2 className="text-sm font-semibold text-stone-800">
                    Understanding Choghadiya
                  </h2>
                </div>

                <div className="grid gap-4 text-xs text-stone-600 md:grid-cols-3">
                  {/* Favorable */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>FAVORABLE TIMES</span>
                    </div>
                    <ul className="space-y-0.5">
                      {["AMRIT", "SHUBH", "LABH"].map((key) => {
                        const meta =
                          CHOGHADIYA_META[key as keyof typeof CHOGHADIYA_META];
                        return (
                          <li key={meta.key}>
                            <span className="font-devanagari font-serif">{meta.devanagari}</span>{" "}
                            <span className="text-stone-500">
                              ({meta.english}) – {meta.description}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Neutral */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <span>NEUTRAL TIME</span>
                    </div>
                    <ul className="space-y-0.5">
                      {["CHANCHAL"].map((key) => {
                        const meta =
                          CHOGHADIYA_META[key as keyof typeof CHOGHADIYA_META];
                        return (
                          <li key={meta.key}>
                            <span className="font-devanagari font-serif">{meta.devanagari}</span>{" "}
                            <span className="text-stone-500">
                              ({meta.english}) – {meta.description}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Unfavorable */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span>UNFAVORABLE TIMES</span>
                    </div>
                    <ul className="space-y-0.5">
                      {["UDVEG", "KAAL", "ROG"].map((key) => {
                        const meta =
                          CHOGHADIYA_META[key as keyof typeof CHOGHADIYA_META];
                        return (
                          <li key={meta.key}>
                            <span className="font-devanagari font-serif">{meta.devanagari}</span>{" "}
                            <span className="text-stone-500">
                              ({meta.english}) – {meta.description}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-stone-500">
                  Times are based on fixed sunrise (
                  {formatMinutesToTime(FIXED_SUNRISE_MINUTES)}) and sunset (
                  {formatMinutesToTime(FIXED_SUNSET_MINUTES)}). Each Choghadiya
                  period lasts approximately 1 hour and 30 minutes.
                </p>
              </div>
            </section>

            {/* Weekly overview */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-stone-800">
                    Weekly Overview
                  </h2>
                </div>
                <p className="text-[11px] text-stone-500">
                  Tap a day to view all 16 Choghadiya periods (day and night).
                </p>
              </div>

              {/* Weekday selector */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {WEEK_ORDER.map((wd) => {
                  const label = WEEKDAY_LABELS[wd];
                  const isActive = wd === weeklyWeekday;
                  return (
                    <button
                      key={wd}
                      type="button"
                      onClick={() => setWeeklyWeekday(wd)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${isActive
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-200 bg-white text-stone-600 hover:text-stone-900"
                        }`}
                    >
                      <span className="font-devanagari font-serif text-sm">
                        {label.devanagari}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.14em]">
                        {label.english.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Weekly day list */}
                <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-medium">Day Choghadiya</span>
                    <span>
                      {formatMinutesToTime(FIXED_SUNRISE_MINUTES)} –{" "}
                      {formatMinutesToTime(FIXED_SUNSET_MINUTES)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {weeklyDaySlots.map((slot) => {
                      const meta = CHOGHADIYA_META[slot.type];
                      const current = isWeeklyCurrent(slot, "DAY");
                      const dotClass =
                        meta.favorability === "good"
                          ? "bg-emerald-500"
                          : meta.favorability === "neutral"
                            ? "bg-amber-500"
                            : "bg-red-500";
                      return (
                        <div
                          key={`weekly-day-${slot.startMinutes}-${meta.key}`}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] ${current
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-stone-200 bg-white"
                            }`}
                        >
                          <div className="text-[11px] text-stone-600">
                            {formatMinutesToTime(slot.startMinutes)} –{" "}
                            {formatMinutesToTime(slot.endMinutes)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-devanagari font-serif text-sm">
                              {meta.devanagari}
                            </span>
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly night list */}
                <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-medium">Night Choghadiya</span>
                    <span>
                      {formatMinutesToTime(FIXED_SUNSET_MINUTES)} –{" "}
                      {formatMinutesToTime(24 * 60 + FIXED_SUNRISE_MINUTES)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {weeklyNightSlots.map((slot) => {
                      const meta = CHOGHADIYA_META[slot.type];
                      const current = isWeeklyCurrent(slot, "NIGHT");
                      const dotClass =
                        meta.favorability === "good"
                          ? "bg-emerald-500"
                          : meta.favorability === "neutral"
                            ? "bg-amber-500"
                            : "bg-red-500";
                      return (
                        <div
                          key={`weekly-night-${slot.startMinutes}-${meta.key}`}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] ${current
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-stone-200 bg-white"
                            }`}
                        >
                          <div className="text-[11px] text-stone-600">
                            {formatMinutesToTime(slot.startMinutes)} –{" "}
                            {formatMinutesToTime(slot.endMinutes)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-devanagari font-serif text-sm">
                              {meta.devanagari}
                            </span>
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

          </>
        )}

        {/* Jain Tithi Calendar Content */}
        {activeView === "CALENDAR" && (
          <>
            <section className="mt-8">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-stone-500" />
                  <h2 className="text-lg font-semibold text-stone-800">
                    Jain Tithi Calendar 2026
                  </h2>
                </div>
                <p className="text-xs text-stone-500">
                  Traditional Jain lunar dates marked by color
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="mb-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMonthIndex(Math.max(0, selectedMonthIndex - 1))}
                  disabled={selectedMonthIndex === 0}
                  className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="text-center">
                  <div className="text-sm font-semibold text-stone-800">
                    {JAIN_TITHI_2026[selectedMonthIndex].name} 2026
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMonthIndex(Math.min(11, selectedMonthIndex + 1))}
                  disabled={selectedMonthIndex === 11}
                  className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Today Button + Tithi Filters */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedMonthIndex(today.getMonth())}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Today
                </button>

                {/* Tithi Filters */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTithiFilter(null)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${selectedTithiFilter === null
                      ? "border-stone-900 bg-stone-900 text-stone-50"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      }`}
                  >
                    All
                  </button>
                  {["Pancham", "Aatham", "Choudas", "Poonam"].map((tithi) => {
                    const colorName = TITHI_COLORS[tithi];
                    const activeColor =
                      colorName === "emerald"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : colorName === "purple"
                          ? "border-purple-500 bg-purple-500 text-white"
                          : colorName === "orange"
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-blue-500 bg-blue-500 text-white";

                    return (
                      <button
                        key={tithi}
                        type="button"
                        onClick={() => setSelectedTithiFilter(selectedTithiFilter === tithi ? null : tithi)}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${selectedTithiFilter === tithi
                          ? activeColor
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                          }`}
                      >
                        {tithi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month selector (horizontal scroll) */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
                {JAIN_TITHI_2026.map((monthData, idx) => (
                  <button
                    key={monthData.name}
                    type="button"
                    onClick={() => setSelectedMonthIndex(idx)}
                    className={`flex-shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${idx === selectedMonthIndex
                      ? "border-stone-900 bg-stone-900 text-stone-50 scale-105"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                      }`}
                  >
                    {monthData.name}
                  </button>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 shadow-sm transition-all duration-300 sm:p-5">
                {/* Weekday headers */}
                <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-stone-500 sm:gap-1">
                  <div>SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                </div>

                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {(() => {
                    const monthData = JAIN_TITHI_2026[selectedMonthIndex];
                    const daysInMonth = getDaysInMonth(selectedMonthIndex, 2026);
                    const firstDay = getFirstDayOfMonth(selectedMonthIndex, 2026);
                    const cells: JSX.Element[] = [];

                    // Empty cells before first day
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(
                        <div
                          key={`empty-${i}`}
                          className="aspect-square"
                        />
                      );
                    }

                    // Date cells
                    for (let date = 1; date <= daysInMonth; date++) {
                      const tithis = getTithiForDate(monthData, date);

                      // Apply filter
                      const filteredTithis = selectedTithiFilter
                        ? tithis.filter(t => t === selectedTithiFilter)
                        : tithis;

                      const shouldShow = !selectedTithiFilter || filteredTithis.length > 0;

                      const isToday =
                        today.getMonth() === selectedMonthIndex &&
                        today.getDate() === date &&
                        today.getFullYear() === 2026;

                      cells.push(
                        <div
                          key={`date-${date}`}
                          onClick={() => {
                            if (tithis.length > 0) {
                              setSelectedDateInfo({ date, tithis });
                            }
                          }}
                          className={`group relative flex flex-col items-center justify-start rounded-lg border p-1 text-xs transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[80px] ${isToday
                            ? "border-emerald-400 bg-emerald-50 font-semibold text-emerald-700"
                            : shouldShow && tithis.length > 0
                              ? "border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-stone-100 hover:scale-105"
                              : "border-transparent text-stone-400"
                            } ${!shouldShow && selectedTithiFilter ? "opacity-30" : ""}`}
                        >
                          <span className={tithis.length > 0 ? "font-medium text-stone-700 text-xs sm:text-sm mb-1" : "text-xs"}>
                            {date}
                          </span>

                          {/* Tithi names with dots - always visible */}
                          {shouldShow && tithis.length > 0 && (
                            <div className="flex flex-col gap-0.5 w-full items-center">
                              {(selectedTithiFilter ? filteredTithis : tithis).slice(0, 2).map((tithi, idx) => {
                                const colorName = TITHI_COLORS[tithi];
                                const dotColor =
                                  colorName === "emerald"
                                    ? "bg-emerald-500"
                                    : colorName === "purple"
                                      ? "bg-purple-500"
                                      : colorName === "orange"
                                        ? "bg-orange-500"
                                        : colorName === "blue"
                                          ? "bg-blue-500"
                                          : colorName === "yellow"
                                            ? "bg-yellow-500"
                                            : "bg-pink-500";

                                return (
                                  <div key={idx} className="flex items-center gap-1">
                                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor} sm:h-2 sm:w-2 flex-shrink-0`} />
                                    <span className="text-[8px] sm:text-[9px] text-stone-600 font-medium truncate">
                                      {tithi}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Tooltip on hover (desktop only) */}
                          {tithis.length > 0 && (
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[10px] shadow-lg group-hover:sm:block">
                              {tithis.map((tithi, idx) => (
                                <div key={idx} className="text-stone-700">
                                  <span className="font-semibold">{tithi}</span>
                                  <span className="text-stone-500"> – {TITHI_DESCRIPTIONS[tithi]}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>

                {/* Legend */}
                <div className="mt-4 border-t border-stone-200 pt-3">
                  <div className="mb-1.5 text-[10px] font-semibold text-stone-600">
                    TITHI LEGEND
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] sm:grid-cols-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-stone-600">Pancham</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      <span className="text-stone-600">Aatham</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                      <span className="text-stone-600">Choudas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <span className="text-stone-600">Poonam</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <span className="text-stone-600">Paryusan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                      <span className="text-stone-600">Oliji</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Sheet Modal */}
              {selectedDateInfo && (
                <div
                  className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:hidden"
                  onClick={() => setSelectedDateInfo(null)}
                >
                  <div
                    className="w-full rounded-t-2xl border-t border-stone-200 bg-white p-5 shadow-2xl animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-semibold text-stone-800">
                        {JAIN_TITHI_2026[selectedMonthIndex].name} {selectedDateInfo.date}, 2026
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDateInfo(null)}
                        className="rounded-full p-1 hover:bg-stone-100"
                      >
                        <X className="h-4 w-4 text-stone-500" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedDateInfo.tithis.map((tithi, idx) => {
                        const colorName = TITHI_COLORS[tithi];
                        const bgColor =
                          colorName === "emerald"
                            ? "bg-emerald-50 border-emerald-200"
                            : colorName === "purple"
                              ? "bg-purple-50 border-purple-200"
                              : colorName === "orange"
                                ? "bg-orange-50 border-orange-200"
                                : colorName === "blue"
                                  ? "bg-blue-50 border-blue-200"
                                  : colorName === "yellow"
                                    ? "bg-yellow-50 border-yellow-200"
                                    : "bg-pink-50 border-pink-200";

                        const dotColor =
                          colorName === "emerald"
                            ? "bg-emerald-500"
                            : colorName === "purple"
                              ? "bg-purple-500"
                              : colorName === "orange"
                                ? "bg-orange-500"
                                : colorName === "blue"
                                  ? "bg-blue-500"
                                  : colorName === "yellow"
                                    ? "bg-yellow-500"
                                    : "bg-pink-500";

                        return (
                          <div
                            key={idx}
                            className={`rounded-xl border p-3 ${bgColor}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`h-3 w-3 rounded-full ${dotColor}`} />
                              <span className="font-semibold text-stone-800">{tithi}</span>
                            </div>
                            <p className="text-xs text-stone-600">{TITHI_DESCRIPTIONS[tithi]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

          </>
        )}

      </main>
    </div>
  );
};

export default App;


