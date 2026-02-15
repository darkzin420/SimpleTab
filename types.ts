
export interface TabLine {
  string: string;
  notes: string;
}

export interface RiffData {
  songTitle: string;
  artist: string;
  tuning: string;
  difficultyLabel: string;
  tab: TabLine[];
  explanation: string;
}

export type SimplificationLevel = 'Melody' | 'PowerChord' | 'OneFinger';

export interface GenerationConfig {
  song: string;
  artist?: string;
  level: SimplificationLevel;
}
