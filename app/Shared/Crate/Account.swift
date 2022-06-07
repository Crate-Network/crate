//
//  Account.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/8/22.
//

import Foundation
import FirebaseCore
import FirebaseAuth
import AuthenticationServices
import SwiftUI

class ASAccount: NSObject, ASAuthorizationControllerDelegate {
    fileprivate var currentNonce: String?
    let userCallback: (_ auth: Auth, _ user: User) -> Void
    
    init(callback: @escaping (_ auth: Auth, _ user: User) -> Void) {
        self.userCallback = callback
    }
    
    func startSignInWithAppleFlow() {
        let nonce = randomNonceString()
        currentNonce = nonce
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = sha256(nonce)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.performRequests()
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            guard let nonce = currentNonce else {
                fatalError("Invalid state: A login callback was received, but no login request was sent.")
            }
            guard let appleIDToken = appleIDCredential.identityToken else {
                print("Unable to fetch identity token")
                return
            }
            guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
                print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                return
            }
            // Initialize a Firebase credential.
            let credential = OAuthProvider.credential(withProviderID: "apple.com",
                                                    idToken: idTokenString,
                                                    rawNonce: nonce)
            // Sign in with Firebase.
            Auth.auth().signIn(with: credential) { (authResult, error) in
                if let error = error {
                    // Error. If error.code == .MissingOrInvalidNonce, make sure
                    // you're sending the SHA256-hashed nonce as a hex string with
                    // your request to Apple.
                    print(error.localizedDescription)
                    return
                }
                // User is signed in to Firebase with Apple.
                self.userCallback(Auth.auth(), authResult!.user)
            }
        }
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        // Handle error.
        print("Sign in with Apple errored: \(error)")
    }
}

class Authentication: ObservableObject {
    @Published var auth: Auth
    @Published var user: User?
    @Published var loggedIn: Bool
    
    let actionCodeSettings: ActionCodeSettings
    var asAccount: ASAccount?
    
    init() {
        FirebaseApp.configure()
        auth = Auth.auth()
        loggedIn = true
        
        actionCodeSettings = ActionCodeSettings()
        actionCodeSettings.url = URL(string: "https://crate.network")
        actionCodeSettings.handleCodeInApp = true
        actionCodeSettings.setIOSBundleID(Bundle.main.bundleIdentifier!)
        
        asAccount = ASAccount(callback: self.authStateChanged(auth:user:))
        auth.addStateDidChangeListener(self.authStateChanged(auth:user:))
    }
    
    func authStateChanged(auth: Auth, user: User?) {
        self.auth = auth
        self.user = user
        if user == nil {
            loggedIn = false
        } else {
            loggedIn = true
        }
    }
    
    func sendEmailLink(email: String) async throws {
        try await auth.sendSignInLink(toEmail: email, actionCodeSettings: actionCodeSettings)
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        UserDefaults.standard.set(email, forKey: "Email")
    }
    
    func signOut() throws {
        try self.auth.signOut()
        self.loggedIn = false
    }
    
    
    
}
