export interface Member {
  role: string;
  name: string;
  gear: string;
}

export interface TourDate {
  venue: string;
  city: string;
  date: string;
  supportingBands: string[];
}

export interface Track {
  title: string;
  duration: string;
  lyrics: string;
  breakdownCallout: string;
  riffTabs: string;
  tempo: number;
  timeSig: string;
  riffSequence: number[];
  drumPattern: 'polyrhythm_djent' | 'blast_beat' | 'two_step' | 'breakdown' | 'half_time_slam' | string;
}

export interface BandData {
  name: string;
  genre: string;
  logoStyle: 'grindcore_branches' | 'djent_cyber_geom' | 'hardcore_stencil' | 'deathcore_dripping';
  hometown: string;
  label: string;
  tuning: string;
  bpm: number;
  timeSignature: string;
  albumTitle: string;
  releaseYear: number;
  albumConcept: string;
  artDescription: string;
  recommendedArtStyle: 'djent' | 'grindcore' | 'hardcore';
  merchSlogan: string;
  bio: string;
  members: Member[];
  tourDates: TourDate[];
  tracks: Track[];
  customArtUrl?: string;
}

export type SubgenreOption = 'djent' | 'grindcore' | 'hardcore' | 'deathcore' | 'all';
