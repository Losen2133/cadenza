import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInfiniteScrollContent, IonInfiniteScroll, IonList, IonSearchbar, IonItem, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PreferencesService } from 'src/app/services/preferences.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonList, IonSearchbar, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TracksPage implements OnInit {
  playlistId!: string;
  tracks: any[] = [];
  offset: number = 0;
  limit: number = 20;
  loading = false;
  allLoaded = false;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private preferences: PreferencesService,
    private spotifyService: SpotifyService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.playlistId = params.get('id') || '';
      const access_token = await this.preferences.getPreference('access_token');
      if (access_token) {
        this.spotifyService.setAccessToken(access_token);
        this.loadTracks();
      }
    });
  }

  loadTracks(event?: any) {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.spotifyService.getPlaylistTracks(this.playlistId, this.offset, this.limit).subscribe({
      next: (res: any) => {
        const newTracks = res.items || [];
        this.tracks.push(...newTracks);
        this.offset += this.limit;
        this.loading = false;
        if (event) event.target.complete();
        if (newTracks.length < this.limit) this.allLoaded = true; // No more tracks
      },
      error: () => {
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  getArtistNames(track: any): string {
    return track && track.track && track.track.artists
      ? track.track.artists.map((a: any) => a.name).join(', ')
      : '';
  }

  getAlbumName(track: any): string {
    return track && track.track && track.track.album ? track.track.album.name : '';
  }

  getDuration(track: any): string {
    if (track && track.track && typeof track.track.duration_ms === 'number') {
      const totalSeconds = Math.floor(track.track.duration_ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return '';
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value?.toLowerCase() || '';
  }

  get filteredTracks() {
    if (!this.searchTerm) return this.tracks;
    return this.tracks.filter(track =>
      track.track &&
      (
        track.track.name.toLowerCase().includes(this.searchTerm) ||
        this.getArtistNames(track).toLowerCase().includes(this.searchTerm) ||
        this.getAlbumName(track).toLowerCase().includes(this.searchTerm)
      )
    );
  }

  openInSpotify(track: any) {
    window.open(track.track.external_urls.spotify, '_blank');
  }
}
