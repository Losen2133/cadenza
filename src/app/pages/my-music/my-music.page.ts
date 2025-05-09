import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.page.html',
  styleUrls: ['./my-music.page.scss'],
  standalone: true,
  imports: [IonMenu, IonHeader, IonTitle, IonToolbar, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class MyMusicPage implements OnInit {
  search: string = '';
  

  constructor(private menuController: MenuController) { }

  ngOnInit() {
  }

  openMenu(menu: string) {
    this.menuController.open(menu);
  }

  getSearchQuery(query: string) {
    this.search = query;
  }

}
