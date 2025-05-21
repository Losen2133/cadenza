import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet, IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController, IonButton} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SpotifyService } from 'src/app/services/spotify.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { SpotifyUser } from 'src/app/models/spotify.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.page.html',
  styleUrls: ['./streaming.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, NgIf, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, IonHeader, IonTitle, IonToolbar, IonMenu]
})
export class StreamingPage implements OnInit {
  search: string = '';
  userprofile!: SpotifyUser;

  constructor(
    private menuController: MenuController,
    private spotifyService: SpotifyService,
    private preferences: PreferencesService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.includes('streaming')) {
        this.ngOnInit();
      }
    });
  }

  async ngOnInit() {
    // await this.preferences.clearPreferences();
    const access_token = await this.preferences.getPreference('access_token');
    if (access_token) {
      this.spotifyService.setAccessToken(access_token);
      this.spotifyService.getUserProfile().subscribe({
        next: (res: any) => {
          this.userprofile = res;
          console.log(this.userprofile);
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
