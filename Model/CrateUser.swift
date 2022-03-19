//
//  CrateUser.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/13/22.
//

import Foundation
import FirebaseAuth
import FirebaseFirestore
import FirebaseFirestoreSwift

public struct FBUserData: Codable {
    let firstName: String?
    let lastName: String?
    let organization: String?
    let uses2FA: Bool?
    // single-factor authentication stores the encryption key on Firebase
    let dataKey: String?
    // two-factor authentication, uses hardware asymmetric keys to split
    // access to the encryption key between Firebase and the device.
    let signedDataKey: [String: String]?
    let devices: [String]?
    let recoveryKey: String?
}

class CrateUser: ObservableObject {
    @Published var loggedIn: Bool = true
    @Published var firebaseUser: User?
    
    @Published var email: String = ""
    @Published var firstName: String = ""
    @Published var lastName: String = ""
    @Published var organization: String = ""
    @Published var uses2FA: Bool = false
    
    var userDoc: FBUserData?
    
    private let crypto: Crypto
    
    init() {
        self.crypto = Crypto()
        FirebaseConstants.getAuth().addStateDidChangeListener(self.authStateChanged(auth:firebaseUser:))
    }
    
    func update() {
        do { try self.updateUserDocument() } catch { print(error) }
    }
    
    func updateFirebaseUser(_ firebaseUser: User?) {
        self.firebaseUser = firebaseUser
    }
    
    func authStateChanged(auth: Auth, firebaseUser: User?) {
        updateFirebaseUser(firebaseUser)
        
        guard let firebaseUser = firebaseUser else {
            loggedIn = false
            return
        }
        
        // firebaseUser exists
        loggedIn = true
        self.email = firebaseUser.email ?? ""
        getUserDocumentRef(firebaseUser.uid).addSnapshotListener { docSnapshot, error in
            guard let document = docSnapshot else {
                print("Error fetching document: \(error!)")
                return
            }
            do {
                let userDoc = try document.data(as: FBUserData.self)
                self.unpack(doc: userDoc)
                self.userDoc = userDoc
            } catch { }
        }
    }
    
    func unpack(doc: FBUserData) {
        self.firstName = doc.firstName ?? ""
        self.lastName = doc.lastName ?? ""
        self.organization = doc.organization ?? ""
        self.uses2FA = doc.uses2FA ?? false
    }
    
    func pack() -> FBUserData {
        let doc = FBUserData(
            firstName: self.firstName,
            lastName: self.lastName,
            organization: self.organization,
            uses2FA: self.uses2FA,
            dataKey: uses2FA ? nil : "dataKey",
            signedDataKey: uses2FA ? ["key1": "dataKeyEK1"] : nil,
            devices: uses2FA ? ["key1"] : nil,
            recoveryKey: uses2FA ? "recoveryKey" : nil
        )
        return doc
    }
    
    func getUserDocumentRef(_ uid: String) -> DocumentReference {
        return FirebaseConstants.getDB().collection("users").document(uid)
    }
    
    func getUserDocumentRef() throws -> DocumentReference {
        guard let uid = firebaseUser?.uid else {
            throw CrateError.NOT_SIGNED_IN
        }
        return self.getUserDocumentRef(uid)
    }
    
    func getUserDocument() async throws -> FBUserData {
        return try await getUserDocumentRef().getDocument(as: FBUserData.self)
    }
    
    func updateUserDocument() throws {
        guard let uid = firebaseUser?.uid else {
            throw CrateError.NOT_SIGNED_IN
        }
        let docRef = FirebaseConstants.getDB().collection("users").document(uid)
        try docRef.setData(from: self.pack())
    }
    
    func signOut() throws {
        loggedIn = false
        firebaseUser = nil
        try FirebaseConstants.getAuth().signOut()
    }
}

enum CrateError: Error {
    case NOT_SIGNED_IN, NO_DOCUMENT
}
