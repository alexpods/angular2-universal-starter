/// <reference path="typings/main.d.ts" />

declare const __non_webpack_require__: any;
declare const __webpack_require__: any;

declare const __ROOT_DIR__: string;
declare const __SRC_DIR__: string;
declare const __DIST_DIR__: string;
declare const __PUBLIC_DIR__: string;
declare const __PRIVATE_DIR__: string;
declare const __SERVER_DIR__: string;

declare const __HOST__: string;
declare const __PORT__: number;

declare const __SS__: boolean;
declare const __WW__: boolean;

declare const __APPS__: Array<{ name: string, path: string, urlPrefix?: string }>

declare const __APPS_INDEX_FILENAME__: string;

declare const __APPS_SERVER_BUNDLE_NAME__: string;
declare const __APPS_BROWSER_BUNDLE_NAME__: string;
declare const __APPS_WORKER_UI_BUNDLE_NAME__: string;
declare const __APPS_WORKER_APP_BUNDLE_NAME__: string;

declare const __VENDOR_BUNDLE_NAME__: string;
declare const __VENDOR_DLL_MANIFEST_FILENAME__: string;
declare const __VENDOR_DLL_MANIFEST_PATH__: string;

declare const __MASTER_APP_BUNDLE_NAME__: string;
declare const __MASTER_APP_SOURCE_PATH__: string;

declare const __PREBOOT__: { 
  appRoot: string, 
  freeze:  any,
  replay:  string,
  buffer:  boolean, 
  debug:   boolean, 
  uglify:  boolean,
};

declare var require: {
    (id: string): any;
    resolve(id: string): string;
    cache: any;
    extensions: any;
    main: any;
    ensure: Function;
};