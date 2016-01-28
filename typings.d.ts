/// <reference path="typings/main.d.ts" />

declare const ROOT_DIR: string;
declare const SRC_DIR: string;
declare const DIST_DIR: string;
declare const PUBLIC_DIR: string;
declare const PRIVATE_DIR: string;
declare const SERVER_DIR: string;

declare const HOST: string;
declare const PORT: number;

declare const HAS_SS: boolean;
declare const HAS_WW: boolean;

declare const VENDOR_NAME: string;
declare const SERVER_NAME: string;
declare const BROWSER_NAME: string;
declare const WORKER_NAME: string;
declare const WORKER_APP_NAME: string;

declare const NODE_MODULES: string[];

declare const PREBOOT: { 
  appRoot: string, 
  freeze:  any,
  replay:  string,
  buffer:  boolean, 
  debug:   boolean, 
  uglify:  boolean,
};
