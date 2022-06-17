/* tslint:disable */
/* eslint-disable */
/**
 * Crate Network API
 * ## About this spec  The Crate API exposes several endpoints which allows the Crate macOS, iOS,  iPadOS and web clients to interact with Crate\'s IPFS cluster without the  clients needing to run IPFS clients of their own. Crate Network implements  the IPFS Pinning API specification at the `/pins` endpoint, as described by  the spec found [on GitHub](https://github.com/ipfs/pinning-services-api-spec/blob/3196b0b466752a3626b716969703cbd48cb9bcf7/ipfs-pinning-service.yaml).  The pinning API accepts a Bearer authorization token retrieved from your Crate account. This identifies your user and adds the pinned content to  your files on Crate. This version of the API is modified to include  metadata, all of which is optional so that Crate continues to conform to  the IPFS spec.  The Filecoin replication service is handled via the pinning API. Instead of  using expensive, centralized cloud storage as the backend, Crate safely  replicates content onto other decentralized networks. When a request comes  to the pinning service to retrieve the content, Crate will prioritize  cached content, otherwise falling back to the Filecoin network to retrieve your files. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Pin,
    PinFromJSON,
    PinFromJSONTyped,
    PinToJSON,
} from './Pin';
import {
    Status,
    StatusFromJSON,
    StatusFromJSONTyped,
    StatusToJSON,
} from './Status';

/**
 * Pin object with status
 * @export
 * @interface PinStatus
 */
export interface PinStatus {
    /**
     * Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal
     * @type {string}
     * @memberof PinStatus
     */
    requestid: string;
    /**
     * 
     * @type {Status}
     * @memberof PinStatus
     */
    status: Status;
    /**
     * Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
     * @type {Date}
     * @memberof PinStatus
     */
    created: Date;
    /**
     * 
     * @type {Pin}
     * @memberof PinStatus
     */
    pin: Pin;
    /**
     * List of multiaddrs designated by pinning service that will receive the 
     * pin data; see Provider Hints in the docs
     * @type {Set<string>}
     * @memberof PinStatus
     */
    delegates: Set<string>;
    /**
     * Optional info for PinStatus response
     * @type {{ [key: string]: string; }}
     * @memberof PinStatus
     */
    info?: { [key: string]: string; };
}

/**
 * Check if a given object implements the PinStatus interface.
 */
export function instanceOfPinStatus(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "requestid" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "created" in value;
    isInstance = isInstance && "pin" in value;
    isInstance = isInstance && "delegates" in value;

    return isInstance;
}

export function PinStatusFromJSON(json: any): PinStatus {
    return PinStatusFromJSONTyped(json, false);
}

export function PinStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): PinStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'requestid': json['requestid'],
        'status': StatusFromJSON(json['status']),
        'created': (new Date(json['created'])),
        'pin': PinFromJSON(json['pin']),
        'delegates': json['delegates'],
        'info': !exists(json, 'info') ? undefined : json['info'],
    };
}

export function PinStatusToJSON(value?: PinStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'requestid': value.requestid,
        'status': StatusToJSON(value.status),
        'created': (value.created.toISOString()),
        'pin': PinToJSON(value.pin),
        'delegates': value.delegates,
        'info': value.info,
    };
}

