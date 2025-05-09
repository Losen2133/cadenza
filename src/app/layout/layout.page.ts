import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { musicalNotes, playCircle} from 'ionicons/icons';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs, CommonModule, FormsModule]
})
export class LayoutPage implements OnInit {

  constructor() {
    addIcons({ musicalNotes, playCircle });
  }

  ngOnInit() {
  }

}
