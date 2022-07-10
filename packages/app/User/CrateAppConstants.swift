//
//  CrateAppConstants.swift
//  Crate
//
//  Created by Chris Vanderloo on 4/9/22.
//

import Foundation

struct CrateAppConstants {
    
    static let databaseName = "CrateData"
    static let dataModelName = "CrateModel"
    #if os(macOS)
    static let appGroup = "N43YW78JC6.com.chrisvanderloo.Crate.group"
    #else
    static let appGroup = "group.com.chrisvanderloo.Crate"
    #endif
}
