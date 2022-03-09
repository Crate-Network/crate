//
//  IPFSProvider.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/4/22.
//

import SwiftUI

struct IPFSExternalCore: IPFSProvider {
    var core: IPFSCore
    
    init(_ core: IPFSCore) {
        self.core = core
    }
    
    func getData(_ cid: String) async throws -> Data {
        throw IPFSError.notImplemented
    }
    
    func addData(_ data: Data) async throws -> String {
        throw IPFSError.notImplemented
    }
    
    func getCID(_ data: Data) async throws -> String {
        throw IPFSError.notImplemented
    }
    
    
}
