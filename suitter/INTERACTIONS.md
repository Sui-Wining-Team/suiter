# Suitter - Available Interactions

## ✅ Implemented Features

### 1. **Create Post**

- **UI**: Compose tweet box at the top of feed
- **Function**: `handleCreatePost(content: string)`
- **Contract**: `create_post(metadata_cid, clock)`
- **Status**: ✅ Fully functional with toast notifications
- **Test**: Type text in compose box and click "Post" button

### 2. **View Posts**

- **UI**: Twitter-style feed showing all posts
- **Hook**: `useReadSuits()` - Fetches posts via events
- **Contract**: Queries `PostCreatedEvent` events
- **Status**: ✅ Fully functional with real-time blockchain data
- **Test**: Posts automatically load when page opens

### 3. **Delete Post**

- **UI**: Three-dot menu on your own posts → Delete
- **Function**: `handleDeletePost(postId: string)`
- **Contract**: `delete_post(post)` - Soft delete (marks as deleted)
- **Status**: ✅ Fully functional with toast notifications
- **Test**: Click ⋯ menu on your post → Delete

### 4. **Like Post**

- **UI**: Heart icon on tweet cards
- **Function**: `handleToggleLike(postId: string)`
- **Contract**: `like_post(post, clock)` / `unlike_post(like)`
- **Status**: ✅ Fully functional with like count and status tracking
- **Test**: Click heart icon to like/unlike

### 5. **View Like Status**

- **Hook**: `checkLikeStatus(postId)`
- **Returns**: `{ isLiked, likeObjectId, totalLikes }`
- **Status**: ✅ Shows accurate like counts and user's like status
- **Test**: Like counts appear on each post

## 🚧 Partially Implemented

### 6. **User Profiles**

- **Hooks**: `createProfile()`, `updateProfile()`, `getProfile()`
- **Contract**: `create_profile()`, `update_profile()`
- **Status**: ⚠️ Backend ready, UI not implemented yet
- **Next Steps**: Create profile creation/edit UI

### 7. **Comments**

- **Hook**: `addComment(postId, metadataCid, parentCommentId?)`
- **Contract**: `add_comment(post, metadata_cid, parent_comment_id, clock)`
- **Status**: ⚠️ Backend ready, UI not implemented yet
- **Next Steps**: Add comment modal/drawer

## 📋 Contract Functions Available

### Profile Functions

```typescript
SuitterTransactions.createProfile(username, bioCid, avatarCid);
SuitterTransactions.updateProfile(profileId, username, bioCid, avatarCid);
```

### Post Functions

```typescript
SuitterTransactions.createPost(metadataCid) ✅ IN USE
SuitterTransactions.editPost(postId, newMetadataCid)
SuitterTransactions.deletePost(postId) ✅ IN USE
```

### Comment Functions

```typescript
SuitterTransactions.addComment(postId, metadataCid, parentCommentId?)
```

### Like Functions

```typescript
SuitterTransactions.likePost(postId) ✅ IN USE
SuitterTransactions.unlikePost(likeId) ✅ IN USE
```

## 🎯 Testing Guide

### Test Creating a Post

1. Connect your wallet (Sui wallet or zkLogin)
2. Type a message in the "What is happening?!" box
3. Click the blue "Post" button
4. Wait for success toast notification
5. Post should appear in feed after ~2 seconds

### Test Liking a Post

1. Find any post in the feed
2. Click the heart icon
3. Heart should turn red and like count increases
4. Click again to unlike

### Test Deleting Your Post

1. Find one of your own posts
2. Click the three-dot menu (⋯) on the right
3. Click "Delete"
4. Post should be marked as deleted after ~2 seconds

## 🔧 Configuration

**Smart Contract Details:**

- Package ID:
  `0xbb614228ec46b583aa1db115559fbe1051e0a9f7d900c549bcf3648d25e52ca4`
- Module: `suitter`
- Network: Sui Testnet
- Registry ID:
  `0xf16ff0e2a55969713511062df8c4372c2ad56ba21c0a6f65fcea65c49a537e19`

**Data Storage Pattern:**

- Posts are **owned objects** (not in registry)
- Tracked via `PostCreatedEvent` events
- Post content stored as JSON metadata
- TODO: Integrate Walrus/IPFS for decentralized storage

## 🚀 Next Features to Implement

1. **Edit Posts** - UI for editing existing posts
2. **Comments System** - Modal/drawer for viewing and adding comments
3. **User Profiles** - Profile creation and viewing
4. **Retweets** - Share posts (needs contract update)
5. **Media Uploads** - Images/videos via Walrus
6. **Search & Filter** - Find posts by user, content, hashtags
7. **Notifications** - Real-time updates for likes, comments, follows
8. **Follow System** - Follow/unfollow users (needs contract update)

## 📊 Current State

**Working:**

- ✅ Post creation with blockchain confirmation
- ✅ Real-time post feed from blockchain events
- ✅ Like/unlike with accurate counts
- ✅ Delete posts (soft delete)
- ✅ User-friendly toast notifications
- ✅ Responsive Twitter-style UI
- ✅ Wallet connection (Sui + zkLogin)

**Ready but No UI:**

- ⚠️ User profiles (create/update)
- ⚠️ Comments (add/view)
- ⚠️ Edit posts

**Needs Implementation:**

- ❌ Retweet functionality
- ❌ Follow/unfollow system
- ❌ Media uploads
- ❌ Search and filtering
