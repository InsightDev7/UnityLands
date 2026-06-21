import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Auth-gated — needs browser cookies, so render on the client only.
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'applications', renderMode: RenderMode.Client },
  // Everything else can be prerendered.
  { path: '**', renderMode: RenderMode.Prerender },
];
