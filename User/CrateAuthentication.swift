//
//  Account.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/8/22.
//

import Foundation
import FirebaseAuth
import SwiftUI

class CrateAuthentication {
    static private var asAccount: ASAccount = ASAccount()
    
    static func signInWithApple() {
        asAccount.startSignInWithAppleFlow()
    }
    
    static func signInWithEmail(email: String) async throws {
        try await FirebaseConstants.getAuth().sendSignInLink(toEmail: email, actionCodeSettings: FirebaseConstants.getActionCodeSettings())
        UserDefaults.standard.set(email, forKey: "Email")
    }
}
