import {
  findNextHoliday,
  formatHolidayCountdown,
  type JpHoliday,
} from "./jp-holidays";
import { getMoonPhase, type MoonPhase } from "./moon";
import { describeWeatherCode, type WeatherInfo } from "./weather";

export type LabAmbient = {
  todayLabel: string;
  todayKey: string;
  weekdayLabel: string;
  temperature: number | null;
  temperatureLabel: string;
  weather: WeatherInfo;
  moon: MoonPhase;
  nextHoliday: JpHoliday | null;
  holidayCountdown: string | null;
};

function todayInTokyo(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}

function formatTodayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function fetchFukuokaWeather(): Promise<{
  temperature: number | null;
  weatherCode: number | null;
}> {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=33.5904&longitude=130.4017&current=temperature_2m,weather_code&timezone=Asia%2FTokyo";
    const response = await fetch(url, { next: { revalidate: 1800 } });

    if (!response.ok) {
      return { temperature: null, weatherCode: null };
    }

    const data = (await response.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };

    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;

    return {
      temperature: typeof temp === "number" ? Math.round(temp) : null,
      weatherCode: typeof code === "number" ? code : null,
    };
  } catch {
    return { temperature: null, weatherCode: null };
  }
}

export async function getLabAmbient(): Promise<LabAmbient> {
  const now = todayInTokyo();
  const todayKey = formatTodayKey(now);

  const todayLabel = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
  }).format(now);

  const weekdayLabel = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(now);

  const { temperature, weatherCode } = await fetchFukuokaWeather();
  const nextHoliday = findNextHoliday(todayKey);
  const weather = describeWeatherCode(weatherCode);
  const moon = getMoonPhase(now);

  return {
    todayLabel,
    todayKey,
    weekdayLabel,
    temperature,
    temperatureLabel: temperature === null ? "—" : `${temperature}°C`,
    weather,
    moon,
    nextHoliday,
    holidayCountdown: nextHoliday
      ? formatHolidayCountdown(todayKey, nextHoliday)
      : null,
  };
}
