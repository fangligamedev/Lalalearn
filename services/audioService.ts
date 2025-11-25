
import { SFX } from '../constants';

class AudioService {
  private static instance: AudioService;
  private sounds: Record<string, HTMLAudioElement> = {};
  private muted: boolean = false;

  private constructor() {
    // Preload sounds safely
    if (typeof window !== 'undefined') {
      Object.entries(SFX).forEach(([key, url]) => {
        try {
          this.sounds[key] = new Audio(url);
          this.sounds[key].volume = 0.5;
        } catch (e) {
          console.warn("Audio setup failed", e);
        }
      });
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public play(key: keyof typeof SFX) {
    if (this.muted) return;
    const sound = this.sounds[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn("Audio play blocked", e));
    }
  }

  public setMute(muted: boolean) {
    this.muted = muted;
  }
}

export const audio = AudioService.getInstance();
