import './polyfills';

import { bootstrapWorkerApp } from '@angular/platform-browser-dynamic';
import { App } from './app/app';

bootstrapWorkerApp(App, []);
