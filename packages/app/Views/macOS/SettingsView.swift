//
//  SettingsView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/23/22.
//

import SwiftUI

enum Size {
    case small, medium, large
}

struct SettingsView: View {
    @State var playSounds: Bool = true
    @State var selectedSize: Size = .large
    @EnvironmentObject var ipfs: IPFSCore
    @EnvironmentObject var user: CrateUser
    @State var registration: Bool = false
    
    var body: some View {
        TabView {
            Form {
                
                Toggle("Show in Finder", isOn: $registration)
            }
                .tabItem {
                    Label("General", systemImage: "gear")
                }
            
            Form {
                AccountSettingsView()
                    .frame(maxWidth: 350)
            }
                .tabItem {
                    Label("Account", systemImage: "person.crop.circle")
                }
            
            if user.uses2FA {
                Form {
                    ChangePassword()
                }
                    .tabItem {
                        Label("Password", systemImage: "lock.fill")
                    }
            }
            
            Form {
                SyncSettingsView()
            }
                .tabItem {
                    Label("Sync", systemImage: "arrow.triangle.2.circlepath")
                }
            Form {
                StorageSettingsView()
                    .frame(maxWidth: 350)
            }
                .tabItem {
                    Label("Storage", systemImage: "shippingbox")
                }
            
            Form {
                NetworkSettingsView()
                    .frame(maxWidth: 250)
                
            }
                .tabItem {
                    Label("Network", systemImage: "point.3.connected.trianglepath.dotted")
                }
        }
        .onAppear {
            Task { @MainActor in
                self.registration = await CrateFinderRegistration.isRegistered()
            }
        }
        .onChange(of: registration) { newValue in
            if newValue {
                CrateFinderRegistration.registerFileProvider()
            } else {
                CrateFinderRegistration.unregisterFileProvider()
            }
        }
    }
        
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}
