import * as http from 'http';
import { app } from './app.ts';

http.createServer(app).listen(process.env.PORT || 8000);