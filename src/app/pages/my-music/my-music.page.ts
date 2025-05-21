import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonChip, IonInput, IonButtons, IonModal, IonButton, IonSearchbar, IonItemDivider, IonList, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MusicService } from 'src/app/services/music.service';
import { PlayerComponent } from 'src/app/components/player/player.component';
import { AudioFile, Playlist } from 'src/app/models/spotify.model';
import { Preferences } from '@capacitor/preferences';
import { PreferencesService } from 'src/app/services/preferences.service';


@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.page.html',
  styleUrls: ['./my-music.page.scss'],
  standalone: true,
  imports: [IonIcon, IonChip, IonInput, IonButtons, IonModal, IonButton, IonSearchbar, IonItemDivider, PlayerComponent, IonList, IonLabel, IonItem, IonMenu, IonHeader, IonTitle, IonToolbar, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class MyMusicPage implements OnInit {
  search: string = '';
  audioFiles: AudioFile[] = [];
  filteredFiles: AudioFile[] = [];
  playlists: Playlist[] = [];
  isPlaylistsModalOpen: boolean = false;
  isCreationModalOpen: boolean = false;
  isSelectionModalOpen: boolean = false;
  isAddToPlaylistModalOpen: boolean = false;
  playlistName: string = '';
  selectedFile: AudioFile | null = null;
  playlistSelected: boolean = false;
  selectedPlaylist: Playlist | null = null;

  constructor(
    public menuController: MenuController,
    public musicService: MusicService,
    private preferences: PreferencesService
  ) {}

  async ngOnInit() {
    // Try to load playlists from preferences
    await this.fetchSavedPlaylists();
    await this.fetchAudioFiles();
  }

  async fetchSavedPlaylists() {
    const savedPlaylists = await this.preferences.getPreference('playlists');
    if (Array.isArray(savedPlaylists) && savedPlaylists.length > 0) {
      this.playlists = savedPlaylists;
    } else {
      console.log('No saved playlists found, using default playlists.');
    }
  }

  async fetchAudioFiles() {
    try {
      this.audioFiles = await this.musicService.scanAudioFiles();
      this.filteredFiles = this.audioFiles;
    } catch (err) {
      alert('Failed to load audio files:\n' + JSON.stringify(err, null, 2));
    }
  }

  openMenu(menu: string) {
    this.menuController.open(menu);
  }

  filterFiles() {
    const query = this.search.toLowerCase();
    const filtered = this.audioFiles.filter(file =>
      (file.name && file.name.toLowerCase().includes(query)) ||
      (file.path && file.path.toLowerCase().includes(query))
    );
    console.log(
      `Search: ${this.search}`);
    this.filteredFiles = filtered;
  }

  play(file: AudioFile) {
    this.musicService.playAudio(file);
  }

  setPlaylistsModal(isOpen: boolean) {
    this.isPlaylistsModalOpen = isOpen;
  }
  
  setCreationModal(isOpen: boolean) {
    this.isCreationModalOpen = isOpen;
  }

  async createPlaylist() {
    const newPlaylist: Playlist = {
      name: this.playlistName,
      files: []
    };

    this.isCreationModalOpen = false;
    this.playlists.push(newPlaylist);
    this.playlistName = '';

    await this.preferences.createPreference('playlists', this.playlists);
  }

  onPlaylistNameChange(event: any) {
    this.playlistName = event.target.value;
  }
 
  selectPlaylist(playlist: Playlist) {
    this.filteredFiles = playlist.files ? [...playlist.files] : [];
    this.setPlaylistsModal(false);
    this.playlistSelected = true;
    this.selectedPlaylist = playlist;
    console.log('Selected playlist:', playlist);
  }

  async selectNoPlaylist() {
    await this.fetchAudioFiles();
    this.setPlaylistsModal(false);
    this.playlistSelected = false;
    this.selectedPlaylist = null;
    console.log('Selected playlist:', this.filteredFiles);
  }

  openAddToPlaylistModal(file: AudioFile) {
    this.selectedFile = file;
    this.isAddToPlaylistModalOpen = true;
  }

  closeAddToPlaylistModal() {
    this.selectedFile = null;
    this.isAddToPlaylistModalOpen = false;
  }

  async addFileToPlaylist(file: AudioFile | null, playlist: Playlist) {
    if (file && playlist && !playlist.files.some(f => f.path === file.path)) {
      playlist.files.push(file);
    }
    this.closeAddToPlaylistModal();
    await this.preferences.createPreference('playlists', this.playlists);
  }

  async deletePlaylist(playlist: Playlist) {
    this.playlists = this.playlists.filter(p => p !== playlist);
    await this.preferences.createPreference('playlists', this.playlists);
  }

  async removeFromPlaylist(file: AudioFile) {
    if (this.selectedPlaylist) {
      this.selectedPlaylist.files = this.selectedPlaylist.files.filter(f => f.path !== file.path);
      this.filteredFiles = [...this.selectedPlaylist.files];
      await this.preferences.createPreference('playlists', this.playlists);
    }
  }

  async clearPlaylists() {
    await this.preferences.removePreference('playlists');
    await this.fetchSavedPlaylists();
    // alert('Reached');
  }
}


