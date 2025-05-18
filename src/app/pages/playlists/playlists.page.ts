import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInfiniteScrollContent, IonInfiniteScroll, IonSearchbar, IonList, IonItem, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.page.html',
  styleUrls: ['./playlists.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonSearchbar, IonList, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PlaylistsPage implements OnInit {
  playlists: any[] = [];
  searchTerm: string = '';
  offset: number = 0;
  limit: number = 20;
  allLoaded = false;
  loading = false;

  constructor(
    private spotifyService: SpotifyService,
    private router: Router,
    private route: ActivatedRoute,
    private preferences: PreferencesService
  ) { }

  async ngOnInit() {
    const access_token = await this.preferences.getPreference('access_token');
    if (access_token) {
      this.spotifyService.setAccessToken(access_token);
      this.loadPlaylists();
    }
  }

  loadPlaylists(event?: any) {
    if (this.loading || this.allLoaded) {
      if (event) event.target.complete();
      return;
    }
    this.loading = true;
    this.spotifyService.getUserPlaylistsWithOffset(this.offset, this.limit).subscribe({
      next: (res: any) => {
        const newPlaylists = res.items || [];
        this.playlists.push(...newPlaylists);
        this.offset += this.limit;
        if (event) event.target.complete();
        if (newPlaylists.length < this.limit || !res.next) {
          this.allLoaded = true;
        }
        this.loading = false;
      },
      error: (err) => {
        if (event) event.target.complete();
        this.loading = false;
        console.error("Failed to load playlists:", err);
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value?.toLowerCase() || '';
  }

  get filteredPlaylists() {
    if (!this.searchTerm) return this.playlists;
    return this.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(this.searchTerm)
    );
  }

  openPlaylist(playlistId: string) {
    this.router.navigate(['../tracks', playlistId], { relativeTo: this.route });
  }
}
