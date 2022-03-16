//
//  CrateCrypto.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/13/22.
//

import Foundation


struct Crypto {
    private func getBioAccessControl() -> SecAccessControl {
        return SecAccessControlCreateWithFlags(nil, // Use the default allocator.
                                               kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                                               .userPresence,
                                               nil)!
    }
    
//    private func getSymmetricKeyQuery() -> [String: Any] {
//        return [kSecClass as String: kSecClass,
//                kSecAttrAccessControl as String: getBioAccessControl() as Any,
//                kSecUseAuthenticationContext as String: context,
//                kSecValueData as String: password]
//    }
    
    func encryptData() {
        
    }
    
    func createDataSymmetricKey() throws {
//        let status = SecItemAdd(getRootKeyQuery() as CFDictionary, nil)
//        guard status == errSecSuccess else { throw KeychainError(status: status) }
    }
    
    func createAsymmetricKey() throws {
        
    }
    
    init() {
        
    }
    

}
