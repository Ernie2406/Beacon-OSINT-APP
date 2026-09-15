export type Identifiers = {
  name: string;
  aliases: string;
  city: string;
  state: string;
  employer: string;
  jobTitle: string;
  hobbies: string;
  maritalStatus: string;
  socialUsernames: string;
  knownWebsites: string;
  afterDate: string;
  beforeDate: string;
  keywords: string;
  appearance: string;
};

export const emptyIdentifiers = (): Identifiers => ({
  name: "",
  aliases: "",
  city: "",
  state: "",
  employer: "",
  jobTitle: "",
  hobbies: "",
  maritalStatus: "",
  socialUsernames: "",
  knownWebsites: "",
  afterDate: "",
  beforeDate: "",
  keywords: "",
  appearance: "",
});

export type QueryItem = {
  id: string;
  group: string;
  label: string;
  query: string;
  googleWeb: string;
  googleImages: string;
};

export type ConfidenceGrade = "high" | "medium" | "low" | "insufficient";

export type MatchSignal = {
  label: string;
  detail: string;
  weight: number;
};

export type FoundImage = {
  id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  thumbUrl: string;
  provider: string;
  queryUsed: string;
  caption: string;
  pageTitle: string;
  foundAt: string;
  grade: ConfidenceGrade;
  score: number;
  explanation: string[];
  matched: string[];
  signals: MatchSignal[];
  visualScore: number | null;
  contextScore: number;
};

export type EnhanceSettings = {
  brightness: number;
  contrast: number;
  sharpen: number;
  denoise: number;
  upscale: number;
  crop: { x: number; y: number; w: number; h: number } | null;
};

export const defaultEnhance = (): EnhanceSettings => ({
  brightness: 0,
  contrast: 0,
  sharpen: 20,
  denoise: 10,
  upscale: 1,
  crop: null,
});

export type ImageQuality = {
  width: number;
  height: number;
  meanLuma: number;
  blurScore: number;
  issues: string[];
};

export type VisualPrint = { hash: string; dHash: string; hist: number[] };
