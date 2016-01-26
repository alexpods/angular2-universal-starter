import { APP_INITIALIZER, Injectable, Inject, Injector, EventEmitter, NgZone, provide } from 'angular2/core';
import { ROUTER_PROVIDERS, PlatformLocation } from 'angular2/router';
import { PRIMITIVE, Serializer } from 'angular2/src/web_workers/shared/serializer';
import { ROUTER_CHANNEL, LocationType, LocationSerializer } from './shared';
import {
  ServiceMessageBrokerFactory,
  ServiceMessageBroker,
  MessageBus
} from 'angular2/platform/worker_render';

@Injectable()
export class MessageBasedPlatformLocation {
  _channelSink: EventEmitter<Object>;
  _broker: ServiceMessageBroker;
  _serializer: Serializer;
  _platformLocation: PlatformLocation;

  constructor(
    serializer: Serializer,
    platformLocation: PlatformLocation,
    brokerFactory: ServiceMessageBrokerFactory,
    bus: MessageBus
  ) {
    this._serializer = serializer;
    this._platformLocation = platformLocation;

    this._broker = brokerFactory.createMessageBroker(ROUTER_CHANNEL);
    this._channelSink = bus.to(ROUTER_CHANNEL);

    platformLocation.onPopState(this._sendUrlChangeEvent.bind(this));
    platformLocation.onHashChange(this._sendUrlChangeEvent.bind(this));
  }

  start(): void {
    this._broker.registerMethod(
      'getLocation',
      [],
      this._getLocation.bind(this),
      LocationType
    );
    this._broker.registerMethod(
      'setPathname',
      [PRIMITIVE],
      this._setPathname.bind(this)
    );
    this._broker.registerMethod(
      'pushState',
      [PRIMITIVE, PRIMITIVE, PRIMITIVE],
      this._platformLocation.pushState.bind(this._platformLocation)
    );
    this._broker.registerMethod(
      'replaceState',
      [PRIMITIVE, PRIMITIVE, PRIMITIVE],
      this._platformLocation.replaceState.bind(this._platformLocation)
    );
    this._broker.registerMethod(
      'forward',
      [],
      this._platformLocation.forward.bind(this._platformLocation)
    );
    this._broker.registerMethod(
      'back',
      [],
      this._platformLocation.back.bind(this._platformLocation)
    );
  }

  _getLocation(): Promise<Location> {
    return Promise.resolve((<any> this._platformLocation)._location);
  }

  _sendUrlChangeEvent(event: Event): void {
    const loc = this._serializer.serialize((<any> this._platformLocation)._location, LocationType);
    const serializedEvent = {'type': event.type};

    this._channelSink.emit({ 'event': serializedEvent, 'location': loc });
  }

  _setPathname(pathname: string): void {
    this._platformLocation.pathname = pathname;
  }
}

function initRouterListeners(injector: Injector): () => void {
  return () => {
    let zone = injector.get(NgZone);
    zone.run(() => injector.get(MessageBasedPlatformLocation).start());
  };
}

export const WORKER_RENDER_APP_ROUTER = [
  MessageBasedPlatformLocation,
  PlatformLocation,
  provide(APP_INITIALIZER, { useFactory: initRouterListeners, multi: true, deps: [Injector] }),
  provide(Serializer, { useClass: LocationSerializer })
];
