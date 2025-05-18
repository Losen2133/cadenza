import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private accessToken: string = '';
  private clientId = environment.secretEnvironment.CLIENT_ID; // Replace with your client ID
  private redirectUri = 'cadenza://callback';   // Replace with your redirect URI
  private codeVerifier: string = '';

  constructor(private http: HttpClient) { }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getUserProfile() {
    return this.http.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  getUserPlaylistsWithOffset(offset: number = 0, limit: number = 20) {
    return this.http.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { offset: offset.toString(), limit: limit.toString() }
    });
  }

  searchTracks(query: string) {
    return this.http.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { q: query, type: 'track' }
    });
  }

  getPlaylistTracks(playlistId: string, offset: number = 0, limit: number = 20) {
    return this.http.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { offset: offset.toString(), limit: limit.toString() }
    });
  }

  generateCodeVerifier(length: number = 128): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async startLogin() {
    this.codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('spotify_code_verifier', this.codeVerifier);
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
    const scope = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    await Browser.open({ url });
  }

  exchangeToken(code: string) {
    // Restore the code_verifier from storage
    this.codeVerifier = localStorage.getItem('spotify_code_verifier') || '';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: this.codeVerifier
    });

    return this.http.post('https://accounts.spotify.com/api/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } 
}

