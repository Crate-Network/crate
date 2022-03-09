//
//  IPFSCore.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/22/22.
//

import Foundation

#if os(iOS)
public let defaultEndpoint: URL = URL(string: "http://192.168.0.210:8080/ipfs/")!
#else
public let defaultEndpoint: URL = URL(string: "http://127.0.0.1:8080/ipfs/")!
#endif

class IPFSCore: ObservableObject {
    @Published var status: IPFSStatus = .disconnected
    @Published var gateway: IPFSGateway = .ipfs
    @Published var useInternal = false
    
    private var provider: IPFSProvider {
        useInternal ? IPFSJSCore(self) : IPFSExternalCore(self)
    }
    
    func getData(_ cid: String) async throws -> Data {
        return try await provider.getData(cid)
    }
    
    func addData(_ data: Data) async throws -> String {
        return try await provider.addData(data)
    }
    
    func getCID(_ data: Data) async throws -> String {
        return try await provider.getCID(data)
    }
}

protocol IPFSProvider {
    init(_ core: IPFSCore)
    func getData(_ cid: String) async throws -> Data
    func addData(_ data: Data) async throws -> String
    func getCID(_ data: Data) async throws -> String
}
