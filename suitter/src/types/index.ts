export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
}

export interface Tweet {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  image?: string | null;
}
