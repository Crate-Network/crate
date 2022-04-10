//
//  Authenticate.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/9/22.
//

import SwiftUI
import AuthenticationServices

struct Authenticate: View {
    #if os(macOS)
    @State var showRest: Bool = true
    #else
    @State var showRest: Bool = false
    #endif
    @State var showAlert: Bool = false
    @State var error: String = ""
    
    var authentication: CrateAuthentication = CrateAuthentication()
    @EnvironmentObject var user: CrateUser
    @Environment(\.colorScheme) private var colorScheme
    
    var body: some View {
        VStack {
            VStack {
                Image("CrateGlyph")
                    .resizable()
                    .scaledToFit()
                    .frame(minWidth: 150, maxWidth: showRest ? 150 : 250)
                Text("CRATE")
                    .font(Font.custom("iA Writer Quattro S", size: 50))
                    .opacity(showRest ? 0.0 : 1.0)
                if showRest {
                    Text("Login/Register")
                        .font(Font.custom("iA Writer Quattro S", size: 30))
                    
                    SignInWithAppleButton(.continue, onRequest: { req in
                        authentication.signInWithApple()
                    }, onCompletion: { result in
                        print(result)
                    }).signInWithAppleButtonStyle(colorScheme == .light ? .black : .white)
                        .frame(height: 44)
                    Divider().padding()
                    SignInWithEmail(showRest: $showRest, showAlert: $showAlert, error: $error, authentication: authentication)
//                    GoogleButton()
//                    GitHubButton()
                    Spacer()
                }
            }
            .frame(minWidth: 260, maxWidth: 360)
        }
        .padding(30)
        .animation(.easeInOut(duration: 0.5).delay(1), value: showRest)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.background)
        .onAppear {
            showRest = true
        }
        .onDisappear { }
        .navigationTitle("Login")
        .alert("Authentication Error", isPresented: $showAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(self.error)
        }
        .frame(idealWidth: 500, idealHeight: 500)
    }
}

struct Authenticate_Previews: PreviewProvider {
    static var previews: some View {
        Authenticate()
    }
}

struct GoogleButton: View {
    var body: some View {
        Button {
            
        } label: {
            HStack {
                Image("Google Logo")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: 24, minHeight: 24)
                Spacer()
                Text("Continue with Google")
                Spacer()
            }
        }
        .buttonStyle(.plain)
        .frame(maxWidth: .infinity)
        .padding(10.0)
        .foregroundColor(.black)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .fill(Color.white)
                .shadow(color: Color.init(white: 0.0, opacity: 0.14), radius: 4, x: 0, y: 5)
        )
    }
}

struct GitHubButton: View {
    var body: some View {
        Button {
            
        } label: {
            HStack {
                Image("GitHub Logo")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: 24, minHeight: 24)
                Spacer()
                Text("Continue with GitHub")
                Spacer()
            }
        }
        .buttonStyle(.plain)
        .frame(maxWidth: .infinity)
        .padding(10.0)
        .foregroundColor(.black)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .fill(Color.white)
                .shadow(color: Color.init(white: 0.0, opacity: 0.14), radius: 4, x: 0, y: 5)
        )
    }
}

struct SignInWithEmail: View {
    @Binding var showRest: Bool
    @Binding var showAlert: Bool
    @Binding var error: String
    
    @State var email: String = ""
    @State var showEmailMsg: Bool = false
    
    var authentication: CrateAuthentication
    var body: some View {
        VStack {
            TextField("Email", text: $email)
                .padding(10.0)
                .background(
                    RoundedRectangle(cornerRadius: 6)
                        .fillCT(.secondaryBackground)
                )
                .overlay(RoundedRectangle(cornerRadius: 6).stroke(.gray, lineWidth: 1))
                .textFieldStyle(.plain)
                .disableAutocorrection(true)
                #if os(iOS)
                .textInputAutocapitalization(.none)
                #endif
            Button {
                withAnimation {
                    self.signInWithEmail()
                }
            } label: {
                HStack {
                    Spacer()
                    Text("Continue with Email")
                        .foregroundColor(.white)
                    Spacer()
                }
            }
            .alert("An email was sent. Please tap on the link in the email to finish login.", isPresented: $showEmailMsg) {
                Button("OK") { showEmailMsg = false }
            }
            .disabled(email == "")
            .buttonStyle(.plain)
            .padding(10.0)
            .foregroundColor(Color(ColorType.headline.name))
            .background(
                RoundedRectangle(cornerRadius: 6)
                    .fill(email == "" ? .gray : Color(ColorType.branding.name))
                    .shadow(color: Color.init(white: 0.0, opacity: email == "" ? 0.0 : 0.14), radius: 4, x: 0, y: 5)
            )
            .animation(Animation.easeInOut.speed(2), value: email)
        }
    }
    
    private func signInWithEmail() {
        Task { @MainActor in
            do {
                print(self.email)
                try await authentication.sendEmailLink(email: self.email)
                self.showEmailMsg = true
            } catch {
                print(error)
                self.error = error.localizedDescription
                self.showAlert = true
            }
        }
    }
}
