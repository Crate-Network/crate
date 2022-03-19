//
//  SHA256.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/10/22.
//

import Foundation
import CryptoKit

func sha256(_ input: String) -> String {
  let inputData = Data(input.utf8)
  let hashedData = SHA256.hash(data: inputData)
  let hashString = hashedData.compactMap {
    String(format: "%02x", $0)
  }.joined()

  return hashString
}
