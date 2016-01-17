import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import * as http from 'http';
import { app } from './app';
import { PORT } from './const'

http.createServer(app).listen(PORT);
