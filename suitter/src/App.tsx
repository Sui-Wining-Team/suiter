import React, { useState, useEffect } from 'react';
import { Home, User, Plus, Heart, X, Calendar, Zap, Users, Shield, ArrowRight, MessageCircle, Moon, Sun, Camera, Wallet } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectModal } from './ConnectModal';

interface UserType {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified?: boolean;
}

interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  image?: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: {
      name: "Alice Smith",
      username: "alice_dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      verified: true
    },
    content: "Just deployed my first dApp on Sui! The developer experience is incredible. #Sui #Web3",
    timestamp: "2h ago",
    likes: 45,
    isLiked: false
  },
  {
    id: 2,
    author: {
      name: "Bob Johnson",
      username: "bob_crypto",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    },
    content: "The future of blockchain is here. Sui's parallel execution is a game changer for scalability.",
    timestamp: "5h ago",
    likes: 128,
    isLiked: true
  },
  {
    id: 3,
    author: {
      name: "Carol White",
      username: "carol_tech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      verified: true
    },
    content: "Building on Sui has been an amazing journey. The Move programming language makes smart contract development so much safer.",
    timestamp: "8h ago",
    likes: 89,
    isLiked: false,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      verified: true
    },
    content: "GM! Ready to build the future of Web3 today. Who else is working on their Sui project this weekend?",
    timestamp: "12h ago",
    likes: 234,
    isLiked: false
  },
  {
    id: 5,
    author: {
      name: "Emma Davis",
      username: "emma_blockchain",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      verified: true
    },
    content: "Attending the Sui Developer Conference next month! Can't wait to meet everyone building amazing things on this ecosystem.",
    timestamp: "1d ago",
    likes: 567,
    isLiked: true
  }
];

const LandingPage: React.FC<{ onGetStarted: () => void, darkMode: boolean }> = ({ onGetStarted, darkMode }) => {
  const currentAccount = useCurrentAccount();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check for zkLogin address
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get('zklogin_token');
    const callbackAddress = params.get('zklogin_address');
    
    if (callbackToken && callbackAddress) {
      localStorage.setItem('zklogin_token', callbackToken);
      localStorage.setItem('zklogin_address', callbackAddress);
      setZkLoginAddress(callbackAddress);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedAddress = localStorage.getItem('zklogin_address');
      if (storedAddress) setZkLoginAddress(storedAddress);
    }
  }, []);

  const isConnected = currentAccount || zkLoginAddress;

  const handleDisconnect = () => {
    localStorage.removeItem('zklogin_token');
    localStorage.removeItem('zklogin_address');
    setZkLoginAddress(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <nav className={`fixed top-0 w-full ${darkMode ? 'bg-gray-900 bg-opacity-90' : 'bg-white bg-opacity-90'} backdrop-blur-md z-50 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white-500 to-purple-600 rounded-xl flex items-center justify-center">
              <img src="./src/assets/logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>Suitter</span>
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentAccount ? currentAccount.address.slice(0, 6) : zkLoginAddress?.slice(0, 6)}...{currentAccount ? currentAccount.address.slice(-4) : zkLoginAddress?.slice(-4)}
                  </span>
                  <button
                    onClick={handleDisconnect}
                    className={`text-xs px-2 py-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    Disconnect
                  </button>
                </div>
                <button onClick={onGetStarted} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                🚀 Built on Sui Blockchain
              </span>
              <h1 className={`text-6xl font-bold leading-tight ${darkMode ? 'text-white' : ''}`}>
                Connect with the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Web3 Community</span>
              </h1>
              <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Share your thoughts, connect with developers, and be part of the decentralized social revolution.
              </p>
              <div className="flex gap-4">
                {isConnected ? (
                  <button onClick={onGetStarted} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all flex items-center gap-2">
                    Start Suitting <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </button>
                )}
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>100K+</div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Active Users</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1M+</div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Posts Daily</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
              <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="space-y-4">
                  {INITIAL_POSTS.slice(0, 3).map((post, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={post.author.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${darkMode ? 'text-white' : ''}`}>{post.author.name}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{post.author.username}</div>
                        </div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{post.content}</p>
                      <div className={`flex gap-4 mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Why Choose Suitter?</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Built for the future of social networking</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-8 rounded-2xl border ${darkMode ? 'border-gray-600' : 'border-blue-100'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Lightning Fast</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Built on Sui blockchain for instant transactions and zero-lag interactions.</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} p-8 rounded-2xl border ${darkMode ? 'border-gray-600' : 'border-purple-100'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Truly Decentralized</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Your data, your control. Freedom of expression guaranteed.</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-pink-50'} p-8 rounded-2xl border ${darkMode ? 'border-gray-600' : 'border-pink-100'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Global Community</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Connect with developers and innovators worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl mb-8">Be part of the future of social networking.</p>
          {isConnected ? (
            <button onClick={onGetStarted} className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all">
              Get Started for Free
            </button>
          ) : (
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          )}
        </div>
      </section>

      <ConnectModal 
        isOpen={isConnectModalOpen} 
        onClose={() => setIsConnectModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

const Sidebar: React.FC<{activeTab: string, onTabChange: (tab: string) => void, onNewPost: () => void, darkMode: boolean, toggleDarkMode: () => void, walletAddress?: string}> = ({ activeTab, onTabChange, onNewPost, darkMode, toggleDarkMode, walletAddress }) => {
  return (
    <div className={`w-64 h-screen sticky top-0 flex flex-col border-r ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} p-4`}>
      <div className="mb-8">
        <div className="w-15 h-15 bg-gradient-to-br from-white-500 to-purple-600 rounded-xl flex items-center justify-center">
          <img src="./src/assets/logo.png" alt="Logo" className="w-10 h-10" />
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        <button onClick={() => onTabChange('home')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${activeTab === 'home' ? 'bg-blue-50 text-blue-500 font-semibold' : `${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}`}>
          <Home className="w-6 h-6" />
          <span className="text-xl">Home</span>
        </button>
        <button onClick={() => onTabChange('profile')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-500 font-semibold' : `${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}`}>
          <User className="w-6 h-6" />
          <span className="text-xl">Profile</span>
        </button>
        <button onClick={toggleDarkMode} className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className="text-xl">{darkMode ? 'Light' : 'Dark'} Mode</span>
        </button>
      </nav>
      
      {walletAddress && (
        <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-green-50'} border ${darkMode ? 'border-gray-700' : 'border-green-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-green-600" />
            <span className={`text-xs font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Connected</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
      )}
      
      <button onClick={onNewPost} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full py-3 font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Post
      </button>
    </div>
  );
};

const PostCard: React.FC<{post: Post, onLike: (id: number) => void, onUserClick: (username: string) => void, darkMode: boolean}> = ({ post, onLike, onUserClick, darkMode }) => {
  return (
    <div className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} p-4 transition-colors`}>
      <div className="flex gap-3">
        <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full cursor-pointer" onClick={() => onUserClick(post.author.username)} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-semibold hover:underline cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'}`} onClick={() => onUserClick(post.author.username)}>{post.author.name}</span>
            {post.author.verified && (
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>@{post.author.username}</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>·</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{post.timestamp}</span>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{post.content}</p>
          {post.image && <img src={post.image} alt="Post" className="mt-3 rounded-2xl w-full max-h-96 object-cover" />}
          <div className={`flex items-center gap-16 mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <button onClick={() => onLike(post.id)} className="flex items-center gap-2 hover:text-pink-600 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-pink-100">
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-pink-600 text-pink-600' : ''}`} />
              </div>
              <span className={post.isLiked ? 'text-pink-600' : ''}>{post.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const currentAccount = useCurrentAccount();
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('johndoe');
  const [darkMode, setDarkMode] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=John");
  const [userName, setUserName] = useState("John Doe");
  const [userBio, setUserBio] = useState("Web3 Developer | Sui Enthusiast 🚀");

  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
  ];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: posts.length + 1,
        author: { name: userName, username: 'johndoe', avatar: userAvatar, verified: true },
        content: newPostContent,
        timestamp: "Just now",
        likes: 0,
        isLiked: false
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsModalOpen(false);
    }
  };

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setActiveTab('profile');
  };

  const handleSaveProfile = () => {
    setPosts(posts.map(post => 
      post.author.username === 'johndoe' 
        ? { ...post, author: { ...post.author, name: userName, avatar: userAvatar } }
        : post
    ));
    setIsEditProfileOpen(false);
  };

  const handleGetStarted = () => {
    if (currentAccount) {
      setShowApp(true);
    }
  };

  if (!showApp) {
    return <LandingPage onGetStarted={handleGetStarted} darkMode={darkMode} />;
  }

  const userPosts = posts.filter(post => post.author.username === selectedUser);
  const profileUser = posts.find(post => post.author.username === selectedUser)?.author || { name: userName, username: 'johndoe', avatar: userAvatar, verified: true };
  const isOwnProfile = selectedUser === 'johndoe';

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onNewPost={() => setIsModalOpen(true)} 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        walletAddress={currentAccount?.address}
      />
      
      {activeTab === 'home' ? (
        <div className="flex-1 max-w-2xl mx-auto">
          <div className={`sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} bg-opacity-80 backdrop-blur-sm z-10 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex-1 text-center py-4 font-semibold border-b-4 border-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>For you</div>
          </div>
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} onUserClick={handleUserClick} darkMode={darkMode} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-2xl mx-auto">
          <div className={`sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} bg-opacity-80 backdrop-blur-sm z-10 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profileUser.name}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userPosts.length} posts</p>
          </div>
          <div className={`px-4 py-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={profileUser.avatar} alt={profileUser.name} className={`w-24 h-24 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`} />
              </div>
              {isOwnProfile && (
                <button onClick={() => setIsEditProfileOpen(true)} className={`px-6 py-2 rounded-full font-semibold border ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900 bg-white'}`}>
                  Edit profile
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profileUser.name}</h2>
              {profileUser.verified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>@{profileUser.username}</p>
            {isOwnProfile && <p className={`mt-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{userBio}</p>}
            <div className={`flex items-center gap-2 mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar className="w-4 h-4" />
              <span>Joined March 2024</span>
            </div>
          </div>
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex-1 text-center py-4 font-semibold border-b-4 border-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Posts</div>
          </div>
          <div>
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} onUserClick={handleUserClick} darkMode={darkMode} />
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-2xl shadow-2xl`}>
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 ${darkMode ? 'text-white' : ''}`} />
              </button>
              <button onClick={handleNewPost} disabled={!newPostContent.trim()} className={`px-6 py-2 rounded-full font-semibold ${newPostContent.trim() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-blue-300 text-white cursor-not-allowed'}`}>
                Post
              </button>
            </div>
            <div className="p-4 flex gap-3">
              <img src={userAvatar} alt="Avatar" className="w-12 h-12 rounded-full" />
              <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="What's happening?!" className={`w-full text-xl resize-none outline-none min-h-32 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`} autoFocus />
            </div>
          </div>
        </div>
      )}

      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsEditProfileOpen(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className={`w-5 h-5 ${darkMode ? 'text-white' : ''}`} />
                </button>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h2>
              </div>
              <button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg">
                Save
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} outline-none focus:border-blue-500`}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                <textarea 
                  value={userBio} 
                  onChange={(e) => setUserBio(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} outline-none focus:border-blue-500 resize-none`}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Choose Avatar
                  </div>
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserAvatar(avatar)}
                      className={`relative rounded-full overflow-hidden transition-all ${
                        userAvatar === avatar 
                          ? 'ring-4 ring-blue-500 scale-110' 
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full" />
                      {userAvatar === avatar && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50 border border-blue-100'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Preview</h3>
                <div className="flex items-center gap-3">
                  <img src={userAvatar} alt="Preview" className="w-16 h-16 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</span>
                      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>@johndoe</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userBio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}