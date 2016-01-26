// TODO: Temporty implementation, Remove this when angular/angular#5932 is merged

import { Injectable, ApplicationRef, NgZone, EventEmitter, provide } from 'angular2/core';
import { Serializer, PRIMITIVE } from 'angular2/src/web_workers/shared/serializer';
import { ROUTER_CHANNEL, LocationType, LocationSerializer } from './shared';
import { ROUTER_PROVIDERS, PlatformLocation } from 'angular2/router';
import {
  FnArg,
  UiArguments,
  ClientMessageBrokerFactory,
  ClientMessageBroker,
  MessageBus
} from 'angular2/platform/worker_app';

export function initRouter(appRef: ApplicationRef): Promise<any> {
  const injector = appRef.injector;
  const zone = injector.get(NgZone);

  return zone.run(() => {
    const platformLocation: WebWorkerPlatformLocation = injector.get(PlatformLocation);
    return platformLocation.init();
  });
}

@Injectable()
export class WebWorkerPlatformLocation extends PlatformLocation {
  _wwLocation: LocationType = null;
  _serializer: Serializer;
  _channelSource: EventEmitter<Object>;
  _broker: ClientMessageBroker;
  _popStateListeners: Array<Function> = [];
  _hashChangeListeners: Array<Function> = [];

  constructor(
    serializer: Serializer,
    brokerFactory: ClientMessageBrokerFactory,
    bus: MessageBus
  ) {
    super();

    this._serializer = serializer;
    this._broker = brokerFactory.createMessageBroker(ROUTER_CHANNEL);
    this._channelSource = bus.from(ROUTER_CHANNEL);

    this._channelSource.subscribe((msg: { [key: string]: any, event?: any }) => {
      if (msg.event) {
        let listeners: Array<Function> = null;

        const event = msg.event;
        const type  = msg.event.type;

        if (type === 'popstate') {
          listeners = this._popStateListeners;
        } else if (type === 'hashchange') {
          listeners = this._hashChangeListeners;
        }

        if (listeners !== null) {
          // There was a popState or hashChange event, so the location object thas been updated
          this._wwLocation = this._serializer.deserialize(msg['location'], LocationType);
          listeners.forEach((fn: Function) => fn(event));
        }
      }
    });
  }

  init(): Promise<any> {
    const args: UiArguments = new UiArguments('getLocation');

    return this._broker.runOnService(args, LocationType).then((val: LocationType) => {
      this._wwLocation = val;
      return true;
    });
  }

  getBaseHrefFromDOM(): string {
    throw new Error(`
      Attempt to get base href from DOM from WebWorker. You must either provide a value 
      for the APP_BASE_HREF token through DI or use the hash location strategy.
    `);
  }

  onPopState(fn): void {
    this._popStateListeners.push(fn);
  }

  onHashChange(fn): void {
    this._hashChangeListeners.push(fn);
  }

  get pathname(): string {
    return this._wwLocation && this._wwLocation.pathname;
  }

  get search(): string {
    return this._wwLocation && this._wwLocation.search;
  }

  get hash(): string {
    return this._wwLocation && this._wwLocation.hash;
  }

  set pathname(newPath: string) {
    if (this._wwLocation === null) {
      throw new Error('Attempt to set pathname before value is obtained from UI');
    }
    const fnArgs = [new FnArg(newPath, PRIMITIVE)];
    const args = new UiArguments('setPathname', fnArgs);

    this._wwLocation.pathname = newPath;
    this._broker.runOnService(args, null);
  }

  pushState(state: any, title: string, url: string): void {
    const fnArgs = [
      new FnArg(state, PRIMITIVE),
      new FnArg(title, PRIMITIVE), new FnArg(url, PRIMITIVE)
    ];
    const args = new UiArguments('pushState', fnArgs);

    this._broker.runOnService(args, null);
  }

  replaceState(state: any, title: string, url: string): void {
    const fnArgs = [
      new FnArg(state, PRIMITIVE),
      new FnArg(title, PRIMITIVE),
      new FnArg(url,   PRIMITIVE)
    ];
    const args = new UiArguments('replaceState', fnArgs);

    this._broker.runOnService(args, null);
  }

  forward(): void {
    const args = new UiArguments('forward');
    this._broker.runOnService(args, null);
  }

  back(): void {
    const args = new UiArguments('back');
    this._broker.runOnService(args, null);
  }

  _init() {}
}

export const WORKER_APP_ROUTER = [
  ROUTER_PROVIDERS,
  provide(PlatformLocation, { useClass: WebWorkerPlatformLocation }),
  provide(Serializer, { useClass: LocationSerializer })
];
