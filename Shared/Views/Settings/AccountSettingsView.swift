//
//  AccountView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/23/22.
//

import SwiftUI

struct AccountSettingsView: View {
    @EnvironmentObject var account: Account
    var body: some View {
        Button("Logout") {
            do {
                try account.signOut()
            } catch {
                print(error)
            }
        }
    }
}

struct AccountSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        AccountSettingsView()
    }
}
