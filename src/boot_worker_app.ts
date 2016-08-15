import './polyfills';

import { bootstrapWorkerApp } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { App } from './app/app';

bootstrapWorkerApp(App, []);
