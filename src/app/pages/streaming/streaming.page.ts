import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, MenuController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.page.html',
  styleUrls: ['./streaming.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, IonHeader, IonTitle, IonToolbar, IonMenu]
})
export class StreamingPage implements OnInit {
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
