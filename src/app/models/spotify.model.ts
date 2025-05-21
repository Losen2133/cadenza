export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: Explicitcontent;
  external_urls: Externalurls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Followers {
  href: null;
  total: number;
}

interface Externalurls {
  spotify: string;
}

interface Explicitcontent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface AudioFile {
  path: string;
  name: string;
  type: string;
  size?: number;
  duration?: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTrack: AudioFile | null;
  currentTime: number;
  duration: number;
}

export interface Playlist {
  name: string;
  files: AudioFile[];
}