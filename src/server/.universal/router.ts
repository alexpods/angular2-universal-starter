import { parse as parseUrl, Url } from 'url';
import { Injectable, Inject } from 'angular2/core';
import { PlatformLocation } from 'angular2/router';

export const REQUEST_URL = {};

@Injectable()
export class ServerPlatformLocation extends PlatformLocation {
  private _url: Url;
  
  constructor(@Inject(REQUEST_URL) requestUrl: string) {
    super();
    this._url = parseUrl(requestUrl);
  }
  
  get pathname(): string {
    return this._url.pathname;
  }
  
  set pathname(pathname: string) {
    this._url.pathname = pathname;
  }
  
  get search(): string {
    return this._url.search || '';
  }

  public getBaseHrefFromDOM(): string {
    throw new Error(`
      Attempt to get base href from DOM on the server. 
      Likely you should provide a value for the APP_BASE_HREF token through DI.
    `);
  }

  /**
   * All these methods can be easily implemented through 
   * some sort of history stack. But right now I have no idea
   * whether we need it or not. So I've remained them empty.
   */
  public onPopState(fn): void {}
  public onHashChange(fn): void {}
  public pushState(state: any, title: string, url: string): void {}
  public replaceState(state: any, title: string, url: string): void {}
  public forward(): void {}
  public ack(): void {}
  
  /**
   * Need to prevent original implementation
   */
  public _init() {}
}
