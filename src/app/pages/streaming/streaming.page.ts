import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController, IonButton} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SpotifyService } from 'src/app/services/spotify.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { SpotifyUser } from 'src/app/models/spotify.model';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.page.html',
  styleUrls: ['./streaming.page.scss'],
  standalone: true,
  imports: [NgIf, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, IonHeader, IonTitle, IonToolbar, IonMenu]
})
export class StreamingPage implements OnInit {
  search: string = '';
  userprofile!: SpotifyUser;

  constructor(
    private menuController: MenuController,
    private spotifyService: SpotifyService,
    private preferences: PreferencesService
  ) { }

  async ngOnInit() {
    const access_token = await this.preferences.getPreference('access_token');
    if (access_token) {
      this.spotifyService.setAccessToken(access_token);
      this.spotifyService.getUserProfile().subscribe({
        next: (res: any) => {
          this.userprofile = res;
          console.log(this.userprofile);

          // Now fetch playlists after userprofile is set
          this.spotifyService.getUserPlaylists().subscribe({
            next: (playlists: any) => {
              console.log("Playlists: ", playlists);
            },
            error: (err) => {
              console.error("Failed to load playlists:", err);
            }
          });
        },
        error: (err) => {
          console.error("Failed to load user profile:", err);
        }
      });
    }
  }

  loginWithSpotify() {
    this.spotifyService.startLogin();
  }

  openMenu(menu: string) {
    this.menuController.open(menu);
  }

  getSearchQuery(query: string) {
    this.search = query;
  }

}
