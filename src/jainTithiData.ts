export interface TithiEvent {
    date: number;
    tithi: string | string[];
}

export interface MonthData {
    name: string;
    events: TithiEvent[];
}

export const TITHI_COLORS: Record<string, string> = {
    "Pancham": "emerald",
    "Aatham": "purple",
    "Choudas": "orange",
    "Poonam": "blue",
    "Paryusan": "yellow",
    "Oliji": "pink"
};

export const TITHI_DESCRIPTIONS: Record<string, string> = {
    "Pancham": "5th Tithi - Auspicious day",
    "Aatham": "8th Tithi - Auspicious day",
    "Choudas": "14th Tithi - Auspicious day",
    "Poonam": "Full Moon - Highly auspicious",
    "Paryusan": "Major Jain festival - Sacred days",
    "Oliji": "Ritual day - Special observance"
};

export const JAIN_TITHI_2026: MonthData[] = [
    {
        name: "January",
        events: [
            { date: 2, tithi: "Choudas" },
            { date: 3, tithi: "Poonam" },
            { date: 7, tithi: "Pancham" },
            { date: 11, tithi: "Aatham" },
            { date: 17, tithi: "Choudas" },
            { date: 23, tithi: "Pancham" },
            { date: 26, tithi: "Aatham" },
            { date: 31, tithi: "Choudas" }
        ]
    },
    {
        name: "February",
        events: [
            { date: 1, tithi: "Poonam" },
            { date: 6, tithi: "Pancham" },
            { date: 10, tithi: "Aatham" },
            { date: 16, tithi: "Choudas" },
            { date: 22, tithi: "Pancham" },
            { date: 24, tithi: "Aatham" }
        ]
    },
    {
        name: "March",
        events: [
            { date: 2, tithi: "Choudas" },
            { date: 3, tithi: "Poonam" },
            { date: 8, tithi: "Pancham" },
            { date: 12, tithi: "Aatham" },
            { date: 18, tithi: "Choudas" },
            { date: 23, tithi: "Pancham" },
            { date: 25, tithi: "Oliji" },
            { date: 26, tithi: ["Aatham", "Oliji"] },
            { date: 27, tithi: "Oliji" },
            { date: 28, tithi: "Oliji" },
            { date: 29, tithi: "Oliji" },
            { date: 30, tithi: "Oliji" },
            { date: 31, tithi: "Oliji" }
        ]
    },
    {
        name: "April",
        events: [
            { date: 1, tithi: ["Choudas", "Oliji"] },
            { date: 2, tithi: ["Poonam", "Oliji"] },
            { date: 7, tithi: "Pancham" },
            { date: 11, tithi: "Aatham" },
            { date: 16, tithi: "Choudas" },
            { date: 21, tithi: "Pancham" },
            { date: 24, tithi: "Aatham" },
            { date: 30, tithi: "Choudas" }
        ]
    },
    {
        name: "May",
        events: [
            { date: 1, tithi: "Poonam" },
            { date: 7, tithi: "Pancham" },
            { date: 10, tithi: "Aatham" },
            { date: 15, tithi: "Choudas" },
            { date: 21, tithi: "Pancham" },
            { date: 25, tithi: "Aatham" },
            { date: 30, tithi: "Choudas" },
            { date: 31, tithi: "Poonam" }
        ]
    },
    {
        name: "June",
        events: [
            { date: 5, tithi: "Pancham" },
            { date: 8, tithi: "Aatham" },
            { date: 14, tithi: "Choudas" },
            { date: 19, tithi: "Pancham" },
            { date: 22, tithi: "Aatham" },
            { date: 28, tithi: "Choudas" },
            { date: 29, tithi: "Poonam" }
        ]
    },
    {
        name: "July",
        events: [
            { date: 5, tithi: "Pancham" },
            { date: 8, tithi: "Aatham" },
            { date: 13, tithi: "Choudas" },
            { date: 18, tithi: "Pancham" },
            { date: 21, tithi: "Aatham" },
            { date: 27, tithi: "Choudas" },
            { date: 28, tithi: "Poonam" }
        ]
    },
    {
        name: "August",
        events: [
            { date: 3, tithi: "Pancham" },
            { date: 6, tithi: "Aatham" },
            { date: 11, tithi: "Choudas" },
            { date: 17, tithi: "Pancham" },
            { date: 20, tithi: "Aatham" },
            { date: 27, tithi: "Choudas" },
            { date: 28, tithi: "Poonam" }
        ]
    },
    {
        name: "September",
        events: [
            { date: 1, tithi: "Pancham" },
            { date: 5, tithi: "Aatham" },
            { date: 8, tithi: "Paryusan" },
            { date: 9, tithi: "Paryusan" },
            { date: 10, tithi: ["Choudas", "Paryusan"] },
            { date: 11, tithi: "Paryusan" },
            { date: 12, tithi: "Paryusan" },
            { date: 13, tithi: "Paryusan" },
            { date: 14, tithi: "Paryusan" },
            { date: 15, tithi: "Paryusan" },
            { date: 16, tithi: "Pancham" },
            { date: 19, tithi: "Aatham" },
            { date: 25, tithi: "Choudas" },
            { date: 26, tithi: "Poonam" }
        ]
    },
    {
        name: "October",
        events: [
            { date: 1, tithi: "Pancham" },
            { date: 4, tithi: "Aatham" },
            { date: 9, tithi: "Choudas" },
            { date: 15, tithi: "Pancham" },
            { date: 18, tithi: "Oliji" },
            { date: 19, tithi: ["Aatham", "Oliji"] },
            { date: 20, tithi: "Oliji" },
            { date: 21, tithi: "Oliji" },
            { date: 22, tithi: "Oliji" },
            { date: 23, tithi: "Oliji" },
            { date: 24, tithi: ["Choudas", "Oliji"] },
            { date: 25, tithi: ["Poonam", "Oliji"] },
            { date: 26, tithi: "Oliji" },
            { date: 30, tithi: "Pancham" },
            { date: 31, tithi: "Aatham" }
        ]
    },
    {
        name: "November",
        events: [
            { date: 2, tithi: "Aatham" },
            { date: 8, tithi: "Choudas" },
            { date: 14, tithi: "Pancham" },
            { date: 17, tithi: "Aatham" },
            { date: 23, tithi: "Choudas" },
            { date: 24, tithi: "Poonam" },
            { date: 28, tithi: "Pancham" }
        ]
    },
    {
        name: "December",
        events: [
            { date: 1, tithi: "Aatham" },
            { date: 7, tithi: "Choudas" },
            { date: 13, tithi: "Pancham" },
            { date: 17, tithi: "Aatham" },
            { date: 22, tithi: "Choudas" },
            { date: 23, tithi: "Poonam" },
            { date: 28, tithi: "Pancham" },
            { date: 31, tithi: "Aatham" }
        ]
    }
];

export function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 1).getDay();
}

export function getTithiForDate(monthData: MonthData, date: number): string[] {
    const event = monthData.events.find(e => e.date === date);
    if (!event) return [];
    return Array.isArray(event.tithi) ? event.tithi : [event.tithi];
}
