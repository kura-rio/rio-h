export type WeatherInfo = {
  code: number | null;
  label: string;
  labelEn: string;
};

/** WMO Weather interpretation codes (Open-Meteo) → 短い日本語 */
export function describeWeatherCode(code: number | null | undefined): WeatherInfo {
  if (code === null || code === undefined || Number.isNaN(code)) {
    return { code: null, label: "—", labelEn: "Unknown" };
  }

  if (code === 0) {
    return { code, label: "晴れ", labelEn: "Clear" };
  }
  if (code === 1) {
    return { code, label: "ほぼ晴れ", labelEn: "Mainly clear" };
  }
  if (code === 2) {
    return { code, label: "曇りがち", labelEn: "Partly cloudy" };
  }
  if (code === 3) {
    return { code, label: "曇り", labelEn: "Overcast" };
  }
  if (code === 45 || code === 48) {
    return { code, label: "霧", labelEn: "Fog" };
  }
  if (code >= 51 && code <= 57) {
    return { code, label: "霧雨", labelEn: "Drizzle" };
  }
  if (code >= 61 && code <= 67) {
    return { code, label: "雨", labelEn: "Rain" };
  }
  if (code >= 71 && code <= 77) {
    return { code, label: "雪", labelEn: "Snow" };
  }
  if (code >= 80 && code <= 82) {
    return { code, label: "にわか雨", labelEn: "Showers" };
  }
  if (code >= 85 && code <= 86) {
    return { code, label: "にわか雪", labelEn: "Snow showers" };
  }
  if (code >= 95 && code <= 99) {
    return { code, label: "雷雨", labelEn: "Thunderstorm" };
  }

  return { code, label: "変化あり", labelEn: "Mixed" };
}
