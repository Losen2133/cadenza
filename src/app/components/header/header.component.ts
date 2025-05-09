import { Component, EventEmitter, Input, Output} from '@angular/core';
import { IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settings } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() menu = new EventEmitter<string>();

  constructor() {
    addIcons({ settings });
  }

  openMenu() {
    if(this.title === 'My Music') {
      this.menu.emit('first-menu');
    } else if(this.title === 'Streaming') {
      this.menu.emit('second-menu');
    }

  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const query =  target.value?.toLowerCase() || '';
    this.search.emit(query);
  }
}
