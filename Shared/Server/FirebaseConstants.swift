//
//  CrateServer.swift
//  Crate (iOS)
//
//  Created by Chris Vanderloo on 3/13/22.
//

import Foundation
import Firebase
import FirebaseCore
import FirebaseAuth
import FirebaseFirestore

struct FirebaseConstants {
    let auth: Auth
    let db: Firestore
    let actionCodeSettings: ActionCodeSettings
    
    static func initialize() {
        FirebaseApp.configure()
    }
    
    static func getAuth() -> Auth {
        return Auth.auth()
    }
    
    static func getDB() -> Firestore {
        return Firestore.firestore()
    }
    
    static func getActionCodeSettings() -> ActionCodeSettings {
        let actionCodeSettings = ActionCodeSettings()
        actionCodeSettings.url = URL(string: "https://crate.network")
        actionCodeSettings.handleCodeInApp = true
        actionCodeSettings.setIOSBundleID(Bundle.main.bundleIdentifier!)
        actionCodeSettings.dynamicLinkDomain = "link.crate.network"
        
        return actionCodeSettings
    }
}
