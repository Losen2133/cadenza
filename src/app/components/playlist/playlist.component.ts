import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonLabel, IonThumbnail, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  imports: [CommonModule, IonLabel, IonThumbnail, IonItem],
})
export class PlaylistComponent  implements OnInit {
  @Input() playlistIcon: string = '';
  @Input() playlistName: string = '';
  @Input() playlistDesc: string = '';

  constructor() { }

  ngOnInit() {}

}
