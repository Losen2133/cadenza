import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from 'src/app/services/music.service';
import { IonFooter, IonToolbar, IonButtons, IonButton, IonRange } from '@ionic/angular/standalone';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonFooter,
    IonToolbar,
    IonButtons,
    IonButton,
    IonRange
  ]
})
export class PlayerComponent {
  constructor(public musicService: MusicService) {}

  formatTime(seconds: number): string {
    if (!seconds && seconds !== 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Helper to extract a number from the range event
  onSeek(event: any) {
    const value = event.detail.value;
    // If value is an object (dual range), use value.lower or value.upper as needed
    this.musicService.seekTo(typeof value === 'number' ? value : value?.lower || 0);
  }

  pause() { this.musicService.pauseAudio(); }
  resume() { this.musicService.resumeAudio(); }
  stop() { this.musicService.stopAudio(); }
  next() { this.musicService.playNext(); }
  prev() { this.musicService.playPrevious(); }
}
