//
//  AccountView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/23/22.
//

import SwiftUI

struct AccountSettingsView: View {
    @EnvironmentObject var user: CrateUser
    var body: some View {
        Form {
            Section {
                #if os(iOS)
                HStack {
                    Text("Email")
                    Spacer()
                    Text(user.email).font(.caption).foregroundColor(.gray)
                }
                #else
                Text("Email: ").bold() + Text(user.email).font(.callout)
                #endif
            }
            Section {
                TextField("First Name", text: $user.firstName)
                    .onSubmit { user.update() }
                TextField("Last Name", text: $user.lastName)
                    .onSubmit { user.update() }
                TextField("Organization", text: $user.organization)
                    .onSubmit { user.update() }
            } header: {
                SectionHeader("Public Profile")
            }
            Section {
                Toggle("Enable Hardware 2FA", isOn: $user.uses2FA)
                    .onChange(of: user.uses2FA) { _ in
                        user.update()
                    }
                if user.uses2FA {
                    #if os(iOS)
                    NavigationLink {
                        ChangePassword()
                    } label: {
                        Text("Change Recovery Password")
                    }
                    #endif

                }
            } header: {
                SectionHeader("Security")
            } footer: {
                Text("Using 2-Factor Authentication (2FA) ensures that no one, not even Crate Network, can access your data. However, if no other devices can authenticate and you lose the recovery password, your data will not be recoverable.")
            }
            Section {
                Button {
                    do {
                        try user.signOut()
                    } catch {
                        print(error)
                    }
                } label: {
                    HStack {
                        Spacer()
                        Text("Logout").bold()
                        Spacer()
                    }
                }
                #if os(iOS)
                .foregroundColor(.red)
                #endif
            }
        }
    }
}

struct ChangePassword: View {
    @State var recoveryPassword: String = ""
    @State var newRecoveryPassword: String = ""
    @State var confirmRecoveryPassword: String = ""
    var body: some View {
        Form {
            Section {
                SecureField("Current Password", text: $recoveryPassword)
                SecureField("New Password", text: $newRecoveryPassword)
                SecureField("Confirm New Password", text: $confirmRecoveryPassword)
            }
            Section {
                Button("Change Password") {
                    recoveryPassword = ""
                    newRecoveryPassword = ""
                    confirmRecoveryPassword = ""
                    print("Changed!")
                }
            }
        }
    }
}

struct AccountSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        AccountSettingsView()
            .environmentObject(CrateUser())
    }
}
