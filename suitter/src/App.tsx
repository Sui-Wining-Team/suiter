import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { TwitterLayout } from "./components/TwitterLayout";
import { TwitterFeed } from "./components/TwitterFeed";
import { UserProfile } from "./components/UserProfile";
import { ConnectModal } from "./ConnectModal";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

function App() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const currentAccount = useCurrentAccount();
  const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check for zkLogin callback
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get("zklogin_token");
    const callbackAddress = params.get("zklogin_address");

    if (callbackToken && callbackAddress) {
      localStorage.setItem("zklogin_token", callbackToken);
      localStorage.setItem("zklogin_address", callbackAddress);
      setZkLoginAddress(callbackAddress);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedAddress = localStorage.getItem("zklogin_address");
      if (storedAddress) setZkLoginAddress(storedAddress);
    }
  }, []);

  const isConnected = currentAccount || zkLoginAddress;

  // Show connect modal if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-2xl w-full px-6 text-center">
          <div className="mb-8">
            <svg
              viewBox="0 0 24 24"
              className="h-16 w-16 fill-white mx-auto mb-6"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold mb-4">Happening now</h1>
          <p className="text-3xl font-bold mb-8">Join today.</p>

          <div className="max-w-sm mx-auto space-y-4">
            <Button
              onClick={() => setIsConnectModalOpen(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full py-6 text-lg"
            >
              Connect Wallet
            </Button>

            <p className="text-sm text-gray-500 px-4">
              By connecting, you agree to the Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>

        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <TwitterLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Toaster position="bottom-center" theme="dark" />
      {activeTab === "home" && <TwitterFeed />}
      {activeTab === "profile" && <UserProfile />}
      {activeTab === "explore" && (
        <div className="p-8 text-center text-gray-500">
          Explore page coming soon...
        </div>
      )}
      {activeTab === "notifications" && (
        <div className="p-8 text-center text-gray-500">
          Notifications coming soon...
        </div>
      )}
      {activeTab === "messages" && (
        <div className="p-8 text-center text-gray-500">
          Messages coming soon...
        </div>
      )}
    </TwitterLayout>
  );
}

export default App;
