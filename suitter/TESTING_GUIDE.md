# Suitter Testing & Usage Guide

## 🚀 Quick Start

1. **Open the app**: Navigate to http://localhost:5175/
2. **Connect wallet**: Click "Connect Wallet" and choose Sui Wallet or Google
   (zkLogin)
3. **Start posting**: Use the compose box at the top to create your first post!

## 📱 Main Features

### 1. Creating Posts

**Using the Main UI:**

1. Look for the "What is happening?!" compose box at the top
2. Type your message (max 280 characters)
3. Click the blue "Post" button
4. Wait for the success notification
5. Your post appears in the feed after ~2 seconds

**Using the Debug Panel:**

1. Find the debug panel in the bottom-right corner
2. Edit the test content
3. Click "Create Test Post"

### 2. Liking Posts

**From the Feed:**

1. Find any post in your feed
2. Click the heart ♥ icon at the bottom
3. Heart turns red when liked
4. Click again to unlike
5. Like count updates in real-time

**Using the Debug Panel:**

1. Copy a post ID from the feed (you'll need to inspect element to get it)
2. Paste into "Post ID" field in the "Test Like Post" section
3. Click "Like Post"

### 3. Deleting Your Posts

**From the Feed:**

1. Find one of YOUR posts (must be the author)
2. Click the three-dot menu (⋯) on the right side
3. Click "Delete"
4. Post is marked as deleted (soft delete)
5. Deleted posts show with strikethrough text

### 4. Viewing Posts

**Automatic:**

- Posts load automatically when you open the app
- Uses blockchain events to find all posts
- Shows author, content, timestamp, and interaction counts

**Manual Refresh:**

- Create a post or interact to trigger automatic refresh
- Wait ~2 seconds for blockchain confirmation

## 🧪 Testing Each Function

### Test 1: Create a Post

```
1. Connect wallet ✓
2. Type "Hello Suitter!" in compose box
3. Click Post
4. Expected: Success toast → Post appears in feed
```

### Test 2: Like a Post

```
1. Find any post in feed
2. Click heart icon
3. Expected: Heart turns red, count increases
4. Click again
5. Expected: Heart turns gray, count decreases
```

### Test 3: Delete a Post

```
1. Create a new post
2. Wait for it to appear
3. Click ⋯ menu on your post
4. Click Delete
5. Expected: Post shows as deleted with strikethrough
```

### Test 4: Create Profile (Advanced)

```
1. Open Debug Panel (bottom-right)
2. Enter a username
3. Click "Create Profile"
4. Expected: Success toast, profile created on blockchain
```

### Test 5: Add Comment (Advanced)

```
1. Get a post ID (use browser dev tools to inspect a post)
2. Open Debug Panel
3. Paste post ID in "Test Add Comment" section
4. Type comment text
5. Click "Add Comment"
6. Expected: Success toast, comment created
   Note: Comment UI not yet implemented, check blockchain
```

## 📊 What You Should See

### Post Structure

Each post displays:

- 👤 Author address (shortened: 0xabc...xyz)
- 💬 Content text
- ⏰ Time posted (e.g., "5m", "2h", "3d")
- ❤️ Like count and heart icon
- 💬 Comment count
- ⋯ Menu (if you're the author)

### Interaction Feedback

All actions show toast notifications:

- 🔵 Loading: "Creating post..."
- ✅ Success: "Post created successfully!"
- ❌ Error: "Failed to create post. Please try again."

## 🔍 Debug Panel Features

Located in bottom-right corner when wallet is connected:

1. **Contract Info**: Shows package ID and network
2. **Test Create Post**: Quick post creation with custom content
3. **Test Create Profile**: Create user profile on blockchain
4. **Test Like Post**: Like any post by ID
5. **Test Add Comment**: Add comment to any post by ID

## 🐛 Troubleshooting

### Post Not Appearing

- Wait 2-3 seconds for blockchain confirmation
- Check browser console for errors
- Verify wallet has enough SUI for gas

### Can't Like/Unlike

- Make sure you're connected with a wallet
- Check if you already liked (heart should be red)
- Verify the post ID is correct

### Delete Not Working

- Ensure you're the post author
- Only your own posts show the ⋯ menu
- Check wallet connection

### General Issues

1. **Refresh the page**: Sometimes helps with state
2. **Check console**: Open browser DevTools → Console tab
3. **Verify wallet**: Make sure wallet is connected and on Testnet
4. **Check gas**: Ensure wallet has SUI tokens

## 💡 Tips

1. **Character Limit**: Posts are limited to 280 characters (like Twitter)
2. **Gas Fees**: Each interaction costs a small amount of SUI
3. **Real Blockchain**: All data is stored on Sui Testnet
4. **Owned Objects**: Posts are owned by you, not stored in a central registry
5. **Events**: Posts are discovered via blockchain events
6. **Metadata**: Content is stored as JSON in metadata_cid field

## 🔗 Blockchain Details

- **Network**: Sui Testnet
- **Package**:
  0xbb614228ec46b583aa1db115559fbe1051e0a9f7d900c549bcf3648d25e52ca4
- **Module**: suitter
- **RPC**: https://fullnode.testnet.sui.io:443

## 📚 Contract Functions In Use

| Function         | UI          | Status             |
| ---------------- | ----------- | ------------------ |
| `create_post`    | Compose box | ✅ Working         |
| `delete_post`    | Delete menu | ✅ Working         |
| `like_post`      | Heart icon  | ✅ Working         |
| `unlike_post`    | Heart icon  | ✅ Working         |
| `create_profile` | Debug panel | ⚠️ No UI yet       |
| `update_profile` | -           | ⚠️ No UI yet       |
| `add_comment`    | Debug panel | ⚠️ No UI yet       |
| `edit_post`      | -           | ❌ Not implemented |

## 🎯 Next Steps

1. Test creating multiple posts
2. Test liking/unliking different posts
3. Test deleting your posts
4. Try the debug panel features
5. Check blockchain explorer to see your transactions

## 🆘 Need Help?

- Check `INTERACTIONS.md` for detailed function documentation
- Review browser console for error messages
- Verify contract configuration in `src/lib/suitterContract.ts`
- Make sure you're on Sui Testnet
