export type AirQualityData = {
  aqi: number;
  category: {
    label: string;
    level: "good" | "fair" | "moderate" | "poor" | "very_poor";
    description: string;
  };
  pm25: number;
  pm10: number;
  carbonMonoxide?: number;
  nitrogenDioxide?: number;
  ozone?: number;
};

export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
};

export type DistrictEnvironmentData = {
  airQuality: AirQualityData | null;
  weather: WeatherData | null;
};

function getAqiCategory(aqi: number): AirQualityData["category"] {
  if (aqi <= 20) {
    return {
      label: "Çok İyi",
      level: "good",
      description: "Hava temiz, açık hava etkinlikleri için ideal.",
    };
  }
  if (aqi <= 40) {
    return {
      label: "İyi / Kabul Edilebilir",
      level: "fair",
      description: "Hava kalitesi tatmin edici düzeyde, kirlilik riski az.",
    };
  }
  if (aqi <= 60) {
    return {
      label: "Orta",
      level: "moderate",
      description: "Hassas bireyler için hafif sağlık etkisi oluşturabilir.",
    };
  }
  if (aqi <= 80) {
    return {
      label: "Hassas / Kötü",
      level: "poor",
      description: "Solunum rahatsızlığı olanlar açık havada kalış süresini kısıtlamalı.",
    };
  }
  return {
    label: "Çok Kötü",
    level: "very_poor",
    description: "Tüm ilçe sakinleri için sağlık açısından riskli seviye.",
  };
}

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Açık / Güneşli";
    case 1:
      return "Çoğunlukla Açık";
    case 2:
      return "Parçalı Bulutlu";
    case 3:
      return "Kapalı";
    case 45:
    case 48:
      return "Sisli";
    case 51:
    case 53:
    case 55:
      return "Hafif Çisenti";
    case 61:
    case 63:
    case 65:
      return "Yağmurlu";
    case 71:
    case 73:
    case 75:
      return "Kar Yağışlı";
    case 80:
    case 81:
    case 82:
      return "Sağanak Yağış";
    case 95:
    case 96:
    case 99:
      return "Gök Gürültülü Fırtına";
    default:
      return "Bulutlu";
  }
}

/**
 * Fetches real-time Air Quality and Weather for coordinates from Open-Meteo API (free, open-access, no API keys).
 */
export async function getDistrictEnvironment(
  latitude: number,
  longitude: number
): Promise<DistrictEnvironmentData> {
  const [aqRes, weatherRes] = await Promise.allSettled([
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`,
      { next: { revalidate: 60 * 30 } } // Cache for 30 minutes
    ),
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
      { next: { revalidate: 60 * 30 } } // Cache for 30 minutes
    ),
  ]);

  let airQuality: AirQualityData | null = null;
  let weather: WeatherData | null = null;

  if (aqRes.status === "fulfilled" && aqRes.value.ok) {
    try {
      const data = await aqRes.value.json();
      const current = data.current;
      if (current && typeof current.european_aqi === "number") {
        airQuality = {
          aqi: Math.round(current.european_aqi),
          category: getAqiCategory(current.european_aqi),
          pm25: Number((current.pm2_5 ?? 0).toFixed(1)),
          pm10: Number((current.pm10 ?? 0).toFixed(1)),
          carbonMonoxide: current.carbon_monoxide ? Math.round(current.carbon_monoxide) : undefined,
          nitrogenDioxide: current.nitrogen_dioxide ? Number(current.nitrogen_dioxide.toFixed(1)) : undefined,
          ozone: current.ozone ? Math.round(current.ozone) : undefined,
        };
      }
    } catch {
      // Ignore parsing errors
    }
  }

  if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
    try {
      const data = await weatherRes.value.json();
      const current = data.current;
      if (current && typeof current.temperature_2m === "number") {
        weather = {
          temperature: Math.round(current.temperature_2m),
          humidity: Math.round(current.relative_humidity_2m ?? 0),
          windSpeed: Math.round(current.wind_speed_10m ?? 0),
          weatherCode: current.weather_code ?? 0,
          weatherDescription: getWeatherDescription(current.weather_code ?? 0),
        };
      }
    } catch {
      // Ignore parsing errors
    }
  }

  return { airQuality, weather };
}

