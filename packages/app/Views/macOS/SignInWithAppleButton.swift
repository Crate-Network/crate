//
//  SignInWithApple.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/9/22.
//

import SwiftUI
import AuthenticationServices

// Implementation courtesy of https://stackoverflow.com/a/56852456/281221
struct SignInWithAppleButton: View {
  @Environment(\.colorScheme) var colorScheme: ColorScheme
  
  var body: some View {
    Group {
      if colorScheme == .light { // (2)
        SignInWithAppleButtonInternal(colorScheme: .light)
              .frame(height: 56)
      }
      else {
        SignInWithAppleButtonInternal(colorScheme: .dark)
              .frame(height: 56)
      }
    }
  }
}

fileprivate struct SignInWithAppleButtonInternal: NSViewRepresentable { // (3)
  var colorScheme: ColorScheme
  
  func makeNSView(context: Context) -> ASAuthorizationAppleIDButton {
    switch colorScheme {
    case .light:
      return ASAuthorizationAppleIDButton(type: .continue, style: .black) // (4)
    case .dark:
      return ASAuthorizationAppleIDButton(type: .continue, style: .white) // (5)
    @unknown default:
      return ASAuthorizationAppleIDButton(type: .continue, style: .black) // (6)
    }
  }
  
  func updateNSView(_ uiView: ASAuthorizationAppleIDButton, context: Context) {
  }
}

struct SignInWithAppleButton_Previews: PreviewProvider {
  static var previews: some View {
    SignInWithAppleButton()
  }
}
