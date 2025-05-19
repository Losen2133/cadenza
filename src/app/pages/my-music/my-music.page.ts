import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonItemDivider, IonList, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MusicService, AudioFile } from 'src/app/services/music.service';
import { PlayerComponent } from 'src/app/components/player/player.component';

@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.page.html',
  styleUrls: ['./my-music.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonItemDivider, PlayerComponent, IonList, IonLabel, IonItem, IonMenu, IonHeader, IonTitle, IonToolbar, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class MyMusicPage implements OnInit {
  search: string = '';
  audioFiles: AudioFile[] = [];
  filteredFiles: AudioFile[] = [];

  constructor(public menuController: MenuController, public musicService: MusicService) {}

  async ngOnInit() {
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
    // alert(
    //   `Search: "${this.search}"\n` +
    //   `Audio files: ${this.audioFiles.length}\n` +
    //   `Filtered files: ${filtered.length}\n` +
    //   `First filtered: ${filtered[0] ? filtered[0].name : 'none'}`
    // );
    console.log(
      `Search: ${this.search}`);
    this.filteredFiles = filtered;
  }

  play(file: AudioFile) {
    this.musicService.playAudio(file);
  }
}
