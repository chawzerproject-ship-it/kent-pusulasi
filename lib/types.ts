export type SourceRef = {
  label: string;
  url: string | null;
};

export type Goal = {
  label: string;
  target: number;
  actual: number;
  unit: string;
};

export type Weakness = {
  title: string;
  description: string;
};

export type GoodPractice = {
  title: string;
  description: string;
  sourceNote: string;
};

/** One annual faaliyet raporu (activity report), as actually published on the
 * belediye's own website — `url` links straight to that year's report. */
export type ActivityReportRef = {
  year: number;
  url: string;
};

export type PilotData = {
  districtId: number;
  budget2025: number;
  perCapitaSpend: number;
  goals: Goal[];
  weaknesses: Weakness[];
  goodPractices: GoodPractice[];
  sources: SourceRef[];
  /**
   * Real count of faaliyet raporu (annual activity reports) currently
   * published on the belediye's own website, one entry per year with a
   * direct link — verified by fetching the belediye's faaliyet raporları
   * page (2026-08-19). Some municipalities only keep recent years online
   * even if older reports exist on paper, so this reflects what's publicly
   * verifiable today, not necessarily the institution's full history.
   */
  faaliyetRaporlari: ActivityReportRef[];
};

/**
 * A municipality profile merges live TurkiyeAPI geographic/demographic data
 * (population, area, province, region — always present, real, refreshed via
 * ISR) with optional pilot faaliyet raporu data (budget/goals/weaknesses/
 * good practices) that only exists for the handful of districts KentPusula
 * has manually onboarded so far. `hasPilotData` tells the UI which parts of
 * a profile are backed by real reported figures vs. not yet available.
 */
export type MunicipalityProfile = {
  /** Globally unique — always use this for keys, lookups and URL params. */
  id: number;
  /**
   * District slug from TurkiyeAPI. NOT globally unique — Turkey has three
   * "Yenişehir" districts (Bursa, Diyarbakır, Mersin) and 51 districts
   * literally named "Merkez". Display-only; never key or look up by this.
   */
  slug: string;
  name: string;
  province: string;
  provinceId: number;
  provinceSlug: string;
  region: string;
  isMetropolitan: boolean;
  population: number;
  area: number;
  isCoastal: boolean;
  hasPilotData: boolean;
  pilot: PilotData | null;
};
