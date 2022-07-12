/**
 * Pin object
 * @export
 * @interface Pin
 */
export interface Pin {
  /**
   * Content Identifier (CID)
   * @type {string}
   * @memberof Pin
   */
  cid: string
  /**
   * Optional name for pinned data; can be used for lookups later
   * @type {string}
   * @memberof Pin
   */
  name?: string
  /**
   * Optional list of multiaddrs known to provide the data; see Provider Hints in the docs
   * @type {string[]}
   * @memberof Pin
   */
  origins?: string[]
  /**
   * Optional metadata for pin object
   * @type {Record<string, string>}
   * @memberof Pin
   */
  meta?: Record<string, string>
}

/**
 * Response used for listing pin objects matching request
 * @export
 * @interface PinResults
 */
export interface PinResults {
  /**
   * The total number of pin objects that exist for passed query filters
   * @type {number}
   * @memberof PinResults
   */
  count: number
  /**
   * An array of PinStatus results
   * @type {PinStatus[]}
   * @memberof PinResults
   */
  results: PinStatus[]
}

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
  requestid: string
  /**
   *
   * @type {Status}
   * @memberof PinStatus
   */
  status: Status
  /**
   * Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
   * @type {string}
   * @memberof PinStatus
   */
  created: string
  /**
   *
   * @type {Pin}
   * @memberof PinStatus
   */
  pin: Pin
  /**
   * List of multiaddrs designated by pinning service that will receive the  pin data; see Provider Hints in the docs
   * @type {string[]}
   * @memberof PinStatus
   */
  delegates: string[]
  /**
   * Optional info for PinStatus response
   * @type {Record<string, string>}
   * @memberof PinStatus
   */
  info?: Record<string, string>
}

/**
 * Status a pin object can have at a pinning service
 * @export
 * @enum {string}
 */
export const enum Status {
  Queued = "queued",
  Pinning = "pinning",
  Pinned = "pinned",
  Failed = "failed",
}
