import { environment } from '../../environments/environment';

// Resolved per build: localhost in dev, the Caddy-served host in production.
export const API_URL = environment.apiUrl;
