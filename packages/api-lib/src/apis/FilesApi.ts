/* tslint:disable */
/* eslint-disable */
/**
 * Crate Network API
 * ## About this spec  The Crate API exposes several endpoints which allows the Crate macOS, iOS,  iPadOS and web clients to interact with Crate\'s IPFS cluster without the  clients needing to run IPFS clients of their own. Crate Network implements  the IPFS Pinning API specification at the `/pins` endpoint, as described by  the spec found [on GitHub](https://github.com/ipfs/pinning-services-api-spec/blob/3196b0b466752a3626b716969703cbd48cb9bcf7/ipfs-pinning-service.yaml).  The pinning API accepts a Bearer authorization token retrieved from your Crate account. This identifies your user and adds the pinned content to  your files on Crate. This version of the API is modified to include  metadata, all of which is optional so that Crate continues to conform to  the IPFS spec.  The Filecoin replication service is handled via the pinning API. Instead of  using untrusted centralized cloud storage as the backend, Crate safely  replicates content onto other decentralized networks. When a request comes  to the pinning service to retrieve the content, Crate will prioritize  cached content, otherwise falling back to the Filecoin network to retrieve your files. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    FileDescriptor,
    FileDescriptorFromJSON,
    FileDescriptorToJSON,
} from '../models';

export interface FileCidGetRequest {
    cid: string;
}

/**
 * 
 */
export class FilesApi extends runtime.BaseAPI {

    /**
     * Get FileDescriptor object for a particular CID.
     */
    async fileCidGetRaw(requestParameters: FileCidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FileDescriptor>> {
        if (requestParameters.cid === null || requestParameters.cid === undefined) {
            throw new runtime.RequiredError('cid','Required parameter requestParameters.cid was null or undefined when calling fileCidGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("accessToken", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/file/{cid}`.replace(`{${"cid"}}`, encodeURIComponent(String(requestParameters.cid))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FileDescriptorFromJSON(jsonValue));
    }

    /**
     * Get FileDescriptor object for a particular CID.
     */
    async fileCidGet(requestParameters: FileCidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FileDescriptor> {
        const response = await this.fileCidGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
