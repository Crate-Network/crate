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
    private var asAccount: ASAccount?
    
    init() {
        asAccount = ASAccount()
    }
    
    func signInWithApple() {
        asAccount?.startSignInWithAppleFlow()
    }
    
    func sendEmailLink(email: String) async throws {
        try await FirebaseConstants.getAuth().sendSignInLink(toEmail: email, actionCodeSettings: FirebaseConstants.getActionCodeSettings())
        UserDefaults.standard.set(email, forKey: "Email")
    }
}
