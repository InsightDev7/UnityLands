import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Clans } from './pages/clans/clans';
import { ServerMap } from './pages/server-map/server-map';
import { Rules } from './pages/rules/rules';
import { AdminLayout } from './pages/admin/admin-layout';
import { AdminDashboard } from './pages/admin/dashboard/dashboard';
import { AdminApplications } from './pages/admin/applications/applications';
import { AdminPlayers } from './pages/admin/players/players';
import { AdminBans } from './pages/admin/bans/bans';
import { AccessDenied } from './pages/access-denied/access-denied';
import { NotFound } from './pages/not-found/not-found';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';
import { Profile } from './pages/profile/profile';
import { Applications } from './pages/applications/applications';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'rules', component: Rules },
  { path: 'clans', component: Clans },
  { path: 'map', component: ServerMap },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'applications', component: AdminApplications },
      { path: 'players', component: AdminPlayers },
      { path: 'bans', component: AdminBans },
    ],
  },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  {
    path: 'applications',
    component: Applications,
    canActivate: [authGuard],
  },
  { path: 'access-denied', component: AccessDenied },
  { path: '**', component: NotFound },
];
