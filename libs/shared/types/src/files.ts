/**
 * A file object as represented on @crate/web
 * @export
 * @interface FileModel
 */
export interface FileModel {
  /**
   * Content Identifier (CID)
   * @type {string}
   * @memberof FileModel
   */
  cid: string
  /**
   * File/folder name
   * @type {string}
   * @memberof FileModel
   */
  name?: string
  /**
   * Whether this is a file or directory
   * @type {FileType}
   * @memberof FileModel
   */
  type: FileType
  /**
   * Encryption key for the file in string format, parsed from binary representation in UTF-8. This key has been encrypted by the user\'s data key. If this exists, it means the file is for private consumption.
   * @type {string}
   * @memberof FileModel
   */
  signedEncryptionKey?: string
  /**
   * The size of the file.
   * @type {number}
   * @memberof FileModel
   */
  size: number
  /**
   * The date that this file was last modified in ISO-8601.
   * @type {string}
   * @memberof FileModel
   */
  date: string
  /**
   * The CIDs linked to from this directory.
   * @type {Array<FolderLink>}
   * @memberof FileModel
   */
  links?: Array<FolderLink>
  /**
   * The size of the directory and all contained files.
   * @type {number}
   * @memberof FileModel
   */
  cumulativeSize?: number
}

/**
 * Simple type which encapsulates possible file types.
 * @export
 * @interface FileType
 */
export type FileType = "directory" | "file"

/**
 * Structure for linked items in a directory. Name can vary from  directory to directory.
 * @export
 * @interface FolderLink
 */
export interface FolderLink {
  /**
   * Content Identifier (CID)
   * @type {string}
   * @memberof FolderLink
   */
  cid: string
  /**
   * Name of linked file.
   * @type {string}
   * @memberof FolderLink
   */
  name: string
  /**
   * Size of linked file.
   * @type {number}
   * @memberof FolderLink
   */
  size: number
}
