import { Injectable } from 'angular2/core';
import { Serializer } from 'angular2/src/web_workers/shared/serializer';
import {RenderStore} from 'angular2/src/web_workers/shared/render_store';

export const ROUTER_CHANNEL = 'ng-Router';

export class LocationType {
   constructor(
    public href: string,
    public protocol: string,
    public host: string,
    public hostname: string,
    public port: string,
    public pathname: string,
    public search: string,
    public hash: string,
    public origin: string
  ) {}
 }

@Injectable()
export class LocationSerializer extends Serializer {

  constructor(renderStore: RenderStore) {
    super(renderStore);
  }

  serialize(obj: any, type: any) {
    try {
      return super.serialize(obj, type);
    } catch (e) {
      if (type === LocationType) {
        return this._serializeLocation(obj);
      }
      throw e;
    }
  }

  deserialize(map: any, type: any, data?: any) {
    try {
      return super.deserialize(map, type, data);
    } catch (e) {
      if (type === LocationType) {
        return this._deserializeLocation(map);
      }
      throw e;
    }
  }

  _serializeLocation(loc: LocationType): Object {
    return {
      'href': loc.href,
      'protocol': loc.protocol,
      'host': loc.host,
      'hostname': loc.hostname,
      'port': loc.port,
      'pathname': loc.pathname,
      'search': loc.search,
      'hash': loc.hash,
      'origin': loc.origin
    };
  }

  _deserializeLocation(loc: {[key: string]: any}): LocationType {
    return new LocationType(
      loc['href'],
      loc['protocol'],
      loc['host'],
      loc['hostname'],
      loc['port'],
      loc['pathname'],
      loc['search'],
      loc['hash'],
      loc['origin']
    );
  }
}
