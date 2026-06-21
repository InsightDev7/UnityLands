import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AuthModal } from './components/auth-modal/auth-modal';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, AuthModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);

  constructor() {
    // Restore the session from the httpOnly cookie — browser only (no cookies on SSR).
    afterNextRender(() => {
      void this.auth.fetchMe();
    });
  }
}
