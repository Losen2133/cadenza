import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router, private spotifyService: SpotifyService) {
    App.addListener('appUrlOpen', async (data: any) => {
      if (data.url && data.url.startsWith('cadenza://callback')) {
        Browser.close();
        const code = new URL(data.url).searchParams.get('code');
        if (code) {
          this.spotifyService.exchangeToken(code).subscribe({
            next: async (response: any) => {
              await Preferences.set({ key: 'access_token', value: response.access_token });
              if (response.refresh_token) {
                await Preferences.set({ key: 'refresh_token', value: response.refresh_token });
              }
              this.spotifyService.setAccessToken(response.access_token);
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigateByUrl('/layout/streaming', { replaceUrl: true });
              });
            },
            error: (err) => {
              console.error('Token exchange error:', err);
            }
          });
        }
      }
    });
  }
}
