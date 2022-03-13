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
                    NavigationLink {
                        AccountSettingsView()
                                .navigationTitle("Account")
                    } label: {
                        HStack {
                            Label {
                                VStack {
                                    HStack {
                                        Text("Account")
                                            .font(.headline)
                                            .dynamicTypeSize(.xxLarge)
                                        Spacer()
                                    }
                                    HStack {
                                        Text("Signed In: chris.vanderloo@yahoo.com")
                                            .font(.footnote)
                                            .foregroundColor(.gray)
                                        Spacer()
                                    }
                                }
                            } icon: {
                                Image(systemName: "person.circle")
                            }
                        }
                    }.frame(height: 50)
                    NavigationLink {
                        Form {
                            if UIDevice.current.userInterfaceIdiom != .pad {
                                IPFSIndicator()
                            }
                            NetworkSettingsView()
                        }
                        .navigationTitle("Network")
                    } label: {
                        Label("Network", systemImage: "point.3.connected.trianglepath.dotted")
                    }
                    NavigationLink {
                        Form {
                            StorageSettingsView()
                        }
                            .navigationTitle("Storage")
                    } label: {
                        Label("Storage", systemImage: "shippingbox")
                    }
                }
                Section {
                    NotificationSettingsView()
                    SyncSettingsView()
                }
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
