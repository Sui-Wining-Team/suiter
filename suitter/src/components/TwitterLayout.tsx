import { ReactNode } from "react";
import { Home, Search, Bell, Mail, User, MoreHorizontal, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { TrendingSidebar } from "./TrendingSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TwitterLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function TwitterLayout({
  children,
  activeTab = "home",
  onTabChange,
}: TwitterLayoutProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const handleLogout = () => {
    // Clear zkLogin data
    localStorage.removeItem('zklogin_token');
    localStorage.removeItem('zklogin_address');
    
    // Disconnect wallet if connected
    if (currentAccount) {
      disconnect();
    }
    
    toast.success('Logged out successfully');
    window.location.reload();
  };

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Search, label: "Explore" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "messages", icon: Mail, label: "Messages" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <aside className="w-[275px] flex flex-col border-r border-gray-800 fixed h-screen overflow-y-auto">
        <div className="flex-1 px-3 py-2">
          {/* Logo */}
          <div className="px-3 py-3 mb-2">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start text-xl py-6 px-6 rounded-full hover:bg-gray-900 ${
                  activeTab === item.id ? "font-bold" : "font-normal"
                }`}
                onClick={() => onTabChange?.(item.id)}
              >
                <item.icon className="h-7 w-7 mr-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Post Button */}
          <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 rounded-full py-6 text-lg font-bold">
            Post
          </Button>
        </div>

        {/* User Profile at Bottom */}
        {currentAccount && (
          <div className="p-3 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 rounded-full hover:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAccount.address}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-sm">
                        {currentAccount.address.slice(0, 6)}...
                        {currentAccount.address.slice(-4)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        @{currentAccount.address.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black border-gray-800" align="end">
                <DropdownMenuItem
                  onClick={() => onTabChange?.('profile')}
                  className="cursor-pointer hover:bg-gray-900 focus:bg-gray-900"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-900 focus:bg-gray-900"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:bg-gray-900 focus:bg-gray-900 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[275px] mr-[350px] min-h-screen border-r border-gray-800">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="w-[350px] fixed right-0 h-screen overflow-y-auto">
        <TrendingSidebar />
      </aside>
    </div>
  );
}
