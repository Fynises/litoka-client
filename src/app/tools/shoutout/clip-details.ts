export interface JsonClipDetails {
  embedUrl: string,
  clipDuration: number, // float
  maxClipDuration: number | null, // integer
  muted: boolean,
  clipGame: string,
}

export class ClipDetails implements JsonClipDetails {
  embedUrl: string;
  clipDuration: number;
  maxClipDuration: number | null;
  muted: boolean;
  clipGame: string;

  constructor(clipDetails: JsonClipDetails) {
    this.embedUrl = clipDetails.embedUrl;
    this.clipDuration = clipDetails.clipDuration;
    this.maxClipDuration = clipDetails.maxClipDuration;
    this.muted = clipDetails.muted;
    this.clipGame = clipDetails.clipGame;
  }

  private durationToMillis(): number {
    return Math.floor(this.clipDuration * 1000);
  }

  getTotalDuration(): number {
    const clipDurationMs = this.durationToMillis();
    if (this.maxClipDuration === null) {
      return clipDurationMs;
    }
    if (clipDurationMs > this.maxClipDuration) {
      return this.maxClipDuration;
    } else {
      return clipDurationMs;
    }
  }

}
