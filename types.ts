
export enum AppState {
  UNAUTHORIZED = 'UNAUTHORIZED',
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface VideoResult {
  url: string;
  prompt: string;
  timestamp: number;
  resolution: VideoResolution;
  aspectRatio: AspectRatio;
}

export type AspectRatio = '16:9' | '9:16';
export type VideoResolution = '720p' | '1080p';
