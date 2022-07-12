//
//  IPFSGateway.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import Foundation

enum IPFSGateway: CaseIterable {
    case crate, ipfs, cloudflare, pinata
}

extension IPFSGateway {
    func getHost() -> String {
        switch self {
        case .crate:
            return "gateway.crate.network"
        case .ipfs:
            return "ipfs.io"
        case .cloudflare:
            return "cf-ipfs.com"
        case .pinata:
            return "gateway.pinata.cloud"
        }
    }
    
    func getName() -> String {
        switch self {
        case .crate:
            return "Crate Network"
        case .ipfs:
            return "IPFS.io"
        case .cloudflare:
            return "Cloudflare"
        case .pinata:
            return "Pinata Cloud"
        }
    }
    
    func getCIDURL(cid: String) -> String {
        return "https://\(self.getHost())/ipfs/\(cid)"
    }
}
