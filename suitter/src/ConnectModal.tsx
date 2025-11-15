import { useState } from "react";
import { X, Wallet, Chrome, Shield, Zap } from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

const API_URL = "https://suitter-auth-backend.onrender.com";

export function ConnectModal({
  isOpen,
  onClose,
  darkMode = false,
}: ConnectModalProps) {
  const [zkLoginLoading, setZkLoginLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "zklogin" | "wallet" | null
  >(null);

  if (!isOpen) return null;

  const handleZkLogin = () => {
    setZkLoginLoading(true);
    window.location.href = `${API_URL}/auth/google/start`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="grid grid-cols-5 min-h-[400px]">
          {/* Left Column - Buttons (2/5 width) */}
          <div
            className={`col-span-2 p-6 space-y-3 border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            {/* zkLogin with Google */}
            <button
              onClick={handleZkLogin}
              onMouseEnter={() => setSelectedMethod("zklogin")}
              disabled={zkLoginLoading}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                selectedMethod === "zklogin"
                  ? darkMode
                    ? "border-purple-500 bg-gray-700"
                    : "border-purple-500 bg-purple-50"
                  : darkMode
                    ? "border-gray-700 hover:border-purple-400"
                    : "border-gray-200 hover:border-purple-400"
              } ${zkLoginLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Chrome className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">zkLogin</div>
                <div
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Google OAuth
                </div>
              </div>
              {zkLoginLoading && (
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              )}
            </button>

            {/* Native Wallet Connection */}
            <button
              onMouseEnter={() => setSelectedMethod("wallet")}
              onClick={(e) => e.preventDefault()}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedMethod === "wallet"
                  ? darkMode
                    ? "border-blue-500 bg-gray-700"
                    : "border-blue-500 bg-blue-50"
                  : darkMode
                    ? "border-gray-700 hover:border-blue-400"
                    : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Native Wallet</div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Browser Extension
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </button>
          </div>

          {/* Right Column - Description (3/5 width) */}
          <div
            className={`col-span-3 p-8 ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
          >
            {selectedMethod === "zklogin" ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Chrome className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">zkLogin with Google</h3>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Privacy-preserving authentication
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Zero-Knowledge Privacy
                      </h4>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Your Google account is never exposed on-chain. Only
                        cryptographic proofs are used.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Easy Onboarding</h4>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        No need to install extensions or manage seed phrases.
                        Sign in with your existing Google account.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <p
                      className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <strong>How it works:</strong> Click the button to sign in
                      with Google. A unique Sui wallet address will be derived
                      from your Google account using zero-knowledge proofs.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedMethod === "wallet" ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Native Wallet</h3>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Connect with Sui Wallet or other supported wallets
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Full Control</h4>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        You maintain complete control over your private keys and
                        assets with your browser extension wallet.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Web3 Standard</h4>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Traditional Web3 authentication using browser extension
                        wallets like Sui Wallet, Suiet, or Ethos.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <p
                      className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <strong>How it works:</strong> Click "Connect Wallet" to
                      connect your Sui-compatible browser extension wallet.
                      You'll be prompted to approve the connection.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div
                    className={`text-6xl mb-4 ${darkMode ? "opacity-20" : "opacity-10"}`}
                  >
                    <Wallet className="w-20 h-20 mx-auto" />
                  </div>
                  <p
                    className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Hover over a connection method to learn more
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p
            className={`text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
