import { useState, useEffect } from 'react';
import { LogIn, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3001';

interface ZkLoginButtonProps {
  darkMode?: boolean;
}

export function ZkLoginButton({ darkMode = false }: ZkLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have stored credentials
    const token = localStorage.getItem('zklogin_token');
    const storedAddress = localStorage.getItem('zklogin_address');
    if (token && storedAddress) {
      setAddress(storedAddress);
    }

    // Handle OAuth callback (check URL params)
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get('zklogin_token');
    const callbackAddress = params.get('zklogin_address');
    
    if (callbackToken && callbackAddress) {
      localStorage.setItem('zklogin_token', callbackToken);
      localStorage.setItem('zklogin_address', callbackAddress);
      setAddress(callbackAddress);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to backend Google OAuth
      window.location.href = `${API_URL}/auth/google/start`;
    } catch (error) {
      console.error('zkLogin error:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zklogin_token');
    localStorage.removeItem('zklogin_address');
    setAddress(null);
  };

  if (address) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 text-gray-200' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-500 hover:text-red-600 font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
        darkMode
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span>zkLogin</span>
        </>
      )}
    </button>
  );
}
