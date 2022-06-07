//
//  IPFSTypes.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import Foundation

enum IPFSError: Error {
    case notImplemented, wrongPlatform, invalidEndpoint, noProvider
}

enum IPFSStatus {
    case connected, establishing, disconnected, error
}

extension IPFSStatus {
    func getStatus() -> Status {
        switch self {
        case .connected:
            return .success
        case .establishing:
            return .warning
        case .disconnected:
            return .idle
        case .error:
            return .failure
        }
    }
}
