import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import * as http from 'http';
import { app } from './app.ts';

http.createServer(app).listen(process.env.PORT || 8000);
