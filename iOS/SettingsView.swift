//
//  SettingsView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/23/22.
//

import SwiftUI
import Foundation

enum Size {
    case small, medium, large
}

struct SettingsView: View {
    @EnvironmentObject var ipfs: IPFSCore
    
    var body: some View {
        VStack {
            Form {
                Section {
                    NavigationLink(
                        destination: AccountSettingsView()
                            .navigationTitle("Account"),
                        label: {
                            HStack {
                                Label {
                                    VStack {
                                        HStack {
                                            Text("Chris Vanderloo")
                                                .font(.headline)
                                                .dynamicTypeSize(.xxLarge)
                                            Spacer()
                                        }
                                        HStack {
                                            Text("Crate Account")
                                                .font(.footnote)
                                                .foregroundColor(.gray)
                                            Spacer()
                                        }
                                    }
                                } icon: {
                                    Image(systemName: "person.circle")
                                }
                            }
                        }).frame(height: 50)
                    NavigationLink {
                        Form {
                            if UIDevice.current.userInterfaceIdiom != .pad {
                                IPFSIndicator()
                            }
                            IPFSSettingsView()
                        }
                        .navigationTitle("IPFS")
                    } label: {
                        Label("IPFS Settings", systemImage: "point.3.connected.trianglepath.dotted")
                    }
                }
                NotificationSettingsView()
                SyncSettingsView()
                StorageSettingsView()
            }
        }.navigationTitle("Settings")
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(IPFSCore())
    }
}
