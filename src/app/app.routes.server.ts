import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'users/edit/:id',
    renderMode: RenderMode.Dynamic
  },
  {
    path: 'users/create',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'users',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
