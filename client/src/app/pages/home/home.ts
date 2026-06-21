import { Component } from '@angular/core';
import { WelcomeCard } from '../../components/welcome-card/welcome-card';
import { NewsFeed } from '../../components/news-feed/news-feed';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-home',
  imports: [WelcomeCard, NewsFeed, Sidebar],
  template: `
    <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <div class="grid gap-8 lg:grid-cols-3">
        <div class="space-y-8 lg:col-span-2">
          <app-welcome-card />
          <app-news-feed />
        </div>

        <app-sidebar />
      </div>
    </main>
  `,
})
export class Home {}
