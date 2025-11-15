import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { TwitterLayout } from "./components/TwitterLayout";
import { TwitterFeed } from "./components/TwitterFeed";
import { PostDetails } from "./components/PostDetails";
import { UserProfile } from "./components/UserProfile";
import { ConnectModal } from "./ConnectModal";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

function App() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
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

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleBackToFeed = () => {
    setSelectedPostId(null);
  };

  // Allow viewing without wallet connection
  return (
    <div className="min-h-screen bg-black text-white">
      {!isConnected && (
        <div className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm text-gray-400">
                Viewing only - Connect wallet to post
              </span>
            </div>
            <Button
              onClick={() => setIsConnectModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-6"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      )}

      <TwitterLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <Toaster position="bottom-center" theme="dark" />
        {activeTab === "home" &&
          (selectedPostId ? (
            <PostDetails postId={selectedPostId} onBack={handleBackToFeed} />
          ) : (
            <TwitterFeed onPostClick={handlePostClick} />
          ))}
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

      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}

export default App;
