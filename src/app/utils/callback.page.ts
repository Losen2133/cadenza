import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
})
export class CallbackPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private spotify: SpotifyService,
    private router: Router,
    private preferences: PreferencesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.spotify.exchangeToken(code).subscribe((res: any) => {
          this.spotify.setAccessToken(res.access_token);
          this.preferences.createPreference('access_token', res.access_token);
          this.router.navigate(['/layout/streaming'])
        });
      }
    });
  }
}