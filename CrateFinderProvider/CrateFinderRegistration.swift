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
        identifier: NSFileProviderDomainIdentifier(rawValue: "group.com.chrisvanderloo.Crate"),
        displayName: "Crate"
    )
    
    static func registerFileProvider() {
        NSFileProviderManager.add(domain) {
            error in print("Error on registering Crate Finder Provider \(String(describing: error))")
        }
    }
    
    static func unregisterFileProvider() {
        NSFileProviderManager.remove(domain) {
            error in print("Error on unregistering Crate Finder Provider \(String(describing: error))")
        }
    }
}
