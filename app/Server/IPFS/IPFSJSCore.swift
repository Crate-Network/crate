//
//  JSCore.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/3/22.
//

import Foundation
import WebKit

class IPFSJSCore: NSObject, WKScriptMessageHandler, ObservableObject, IPFSProvider {
    @Published var webView: WKWebView? = nil
    var core: IPFSCore
    required init(_ core: IPFSCore) {
        self.core = core
        super.init()
        setup()
    }
    
    private func setup() {
        let webViewConfiguration = WKWebViewConfiguration()
        do {
            let ipfsCoreUrl = Bundle.main.url(forResource: "ipfs-core", withExtension: "js")
            guard let ipfsCoreUrl = ipfsCoreUrl else {
                throw JSError.failedToLoadURL
            }
            
            let ipfsCore = try String(contentsOf: ipfsCoreUrl)
            let script = WKUserScript(source: ipfsCore, injectionTime: .atDocumentStart, forMainFrameOnly: true)

            let contentController = WKUserContentController()
            contentController.addUserScript(script)
            contentController.add(self, name: "app")
            
            webViewConfiguration.userContentController = contentController
            
            self.webView = WKWebView(frame: .zero, configuration: webViewConfiguration)
            self.webView?.reload()
            
            self.webView?.evaluateJavaScript(ipfsCore + "JSON.stringify(ipfs.IPFS.create())") { res, err in
                if let err = err {
                    print(err)
                } else if let res = res {
                    print(res)
                    
                }
            }

        } catch {
            print(error)
        }
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        print("message: \(message.body)")
    }
    
    func getData(_ cid: String) async throws -> Data {
        throw IPFSError.notImplemented
    }
    
    func addData(_ data: Data) async throws -> String {
        throw IPFSError.notImplemented
    }
    
    func getCID(_ data: Data) async throws -> String {
        throw IPFSError.notImplemented
    }
}

enum JSError: Error {
    case failedToLoadURL
}
