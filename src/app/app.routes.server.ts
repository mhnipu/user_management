import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'users/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'users/create',
    renderMode: RenderMode.Server
  },
  {
    path: 'users',
    renderMode: RenderMode.Server
  },
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
