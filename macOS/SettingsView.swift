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
    var body: some View {
        TabView {
            Form {
                AccountSettingsView()
            }
                .tabItem {
                    Label("Account", systemImage: "person.crop.circle")
                }
            
            Form {
                SyncSettingsView()
            }
                .tabItem {
                    Label("Sync", systemImage: "arrow.triangle.2.circlepath")
                }
            Form {
                StorageSettingsView()
                    .frame(maxWidth: 250)
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
            Form {
                NotificationSettingsView()
            }
                .tabItem {
                    Label("Notifications", systemImage: "bell.badge")
                }
        }
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}
