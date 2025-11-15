# 🚀 Suitter Quick Reference

## Available Interactions

### ✅ Fully Working (With UI)

| Feature         | How to Use                         | Status     |
| --------------- | ---------------------------------- | ---------- |
| **Create Post** | Type in compose box → Click "Post" | ✅ Working |
| **View Posts**  | Automatic on page load             | ✅ Working |
| **Like Post**   | Click ❤️ icon on post              | ✅ Working |
| **Unlike Post** | Click ❤️ icon again                | ✅ Working |
| **Delete Post** | Click ⋯ menu → Delete              | ✅ Working |

### ⚠️ Backend Ready (No UI)

| Feature            | Test Via    | Status             |
| ------------------ | ----------- | ------------------ |
| **Create Profile** | Debug Panel | ⚠️ Use debug panel |
| **Update Profile** | Hook only   | ⚠️ No UI           |
| **Add Comment**    | Debug Panel | ⚠️ Use debug panel |
| **View Comments**  | Hook only   | ⚠️ No UI           |

### ❌ Not Implemented

- Edit posts (backend ready, no UI)
- Retweet/share (needs contract)
- Follow/unfollow (needs contract)
- Media uploads
- Search/filter
- Notifications

## 🎯 Quick Test Checklist

```
1. ✅ Open http://localhost:5175/
2. ✅ Connect wallet
3. ✅ Create a post
4. ✅ See post in feed
5. ✅ Like the post
6. ✅ Unlike the post
7. ✅ Delete your post
8. ✅ Use debug panel
```

## 🔧 Debug Panel Features

**Location**: Bottom-right corner when connected

**Functions**:

- Create test posts
- Create user profile
- Like any post by ID
- Add comments by post ID
- View contract info

## 📦 Contract Functions

```typescript
// Posts
SuitterTransactions.createPost(metadataCid) // ✅ UI
SuitterTransactions.editPost(postId, newCid) // ⚠️ No UI
SuitterTransactions.deletePost(postId)      // ✅ UI

// Likes
SuitterTransactions.likePost(postId)        // ✅ UI
SuitterTransactions.unlikePost(likeId)      // ✅ UI

// Comments
SuitterTransactions.addComment(postId, cid) // ⚠️ Debug only

// Profiles
SuitterTransactions.createProfile(...)      // ⚠️ Debug only
SuitterTransactions.updateProfile(...)      // ⚠️ No UI
```

## 🎨 UI Components

```
App
├── TwitterLayout (3-column layout)
│   ├── Sidebar (navigation)
│   ├── TwitterFeed (main content)
│   │   ├── ComposeTweet
│   │   └── TweetCard (repeated)
│   └── Trending (right sidebar)
└── DebugPanel (testing)
```

## 🔗 Key Files

| File                              | Purpose              |
| --------------------------------- | -------------------- |
| `src/lib/suitterContract.ts`      | Transaction builders |
| `src/lib/suitterQueries.ts`       | Query functions      |
| `src/hooks/useSuitterContract.ts` | React hooks          |
| `src/hooks/useReadSuits.ts`       | Fetch posts          |
| `src/components/TwitterFeed.tsx`  | Main feed            |
| `src/components/ComposeTweet.tsx` | Post creation        |
| `src/components/TweetCard.tsx`    | Post display         |

## 📊 Data Flow

```
User clicks Post
    ↓
handleCreatePost()
    ↓
createPost(metadata)
    ↓
SuitterTransactions.createPost()
    ↓
Sui Blockchain
    ↓
PostCreatedEvent emitted
    ↓
useReadSuits() detects event
    ↓
Fetches post object
    ↓
Updates feed
```

## 🐛 Common Issues

| Issue              | Solution                |
| ------------------ | ----------------------- |
| Post not appearing | Wait 2-3 seconds        |
| Can't like/unlike  | Check wallet connection |
| Delete not working | Must be post author     |
| No posts showing   | Create one first        |

## 💡 Pro Tips

1. **Character limit**: 280 chars (live counter)
2. **Gas required**: Each action needs SUI
3. **Real blockchain**: All data on Testnet
4. **Owned objects**: You own your posts/likes
5. **Events**: How we find all posts
6. **Debug panel**: Test advanced features

## 🎉 What's Working

✅ Post creation with validation ✅ Real-time feed updates ✅ Like/unlike with
counts ✅ Delete with authorization ✅ Toast notifications ✅ Responsive UI ✅
Wallet integration ✅ Event-based queries

## 📝 Next Steps

1. Add comment UI
2. Add profile pages
3. Implement edit posts
4. Add media support
5. Build search/filter

---

**App URL**: http://localhost:5175/ **Network**: Sui Testnet **Package**:
0xbb614228...25e52ca4
