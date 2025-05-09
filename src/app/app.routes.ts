import { Routes } from '@angular/router';
import { LayoutPage } from './layout/layout.page';

export const routes: Routes = [
  {
    path: 'layout',
    component: LayoutPage,
    children: [
      {
        path: 'my-music',
        loadComponent: () => import('./pages/my-music/my-music.page').then( m => m.MyMusicPage)
      },
      {
        path: 'streaming',
        loadComponent: () => import('./pages/streaming/streaming.page').then( m => m.StreamingPage)
      },
      {
        path: '',
        redirectTo: '/layout/my-music',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    redirectTo: '/layout/my-music',
    pathMatch: 'full',
  },
];
