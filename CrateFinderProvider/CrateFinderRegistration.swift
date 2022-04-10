//
//  RegisterFileSystem.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 2/20/22.
//

import Foundation
import FileProvider

class CrateFinderRegistration {
    static let domain = NSFileProviderDomain(
        identifier: NSFileProviderDomainIdentifier(rawValue: CrateAppConstants.appGroup),
        displayName: "Crate"
    )
    
    static func isRegistered() async -> Bool {
        let domains = try? await NSFileProviderManager.domains()
        return domains?.contains(where: { domain in
            domain.displayName == "Crate"
        }) ?? false
    }
    
    static func registerFileProvider() {
        NSFileProviderManager.add(domain) {
            error in if error != nil { print("Error on registering Crate Finder Provider \(String(describing: error))") }
        }
    }
    
    static func unregisterFileProvider() {
        NSFileProviderManager.remove(domain) {
            error in if error != nil { print("Error on unregistering Crate Finder Provider \(String(describing: error))") }
        }
    }
}
