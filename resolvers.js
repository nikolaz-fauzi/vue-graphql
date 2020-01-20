const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// create json web token
const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
}

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ username: currentUser.username }).populate({
        path: 'favorites',
        model: 'Post'
      });
      return user;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser', // path in Post model
        model: 'User' // ref
      });
      return post;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: 'desc'}).populate({
        path: 'createdBy',
        model: 'User'
      });
      return posts;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score to provide best match
          { score: { $meta: 'textScore' } }
          // Sort results according to that text score (as well as by likes in descending order)
        ).sort({
          score: { $meta: 'textScore' },
          likes: 'desc'
        }).limit(5);

        return searchResults;
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).limit(pageSize);
      } else {
        // if page num is greater than 1, figure out how manu doc to skip
        // ex skip page 1 = pageSize * (2 - 1);
        const skips = pageSize * (pageNum - 1); 
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).skip(skips).limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return {
        posts,
        hasMore
      }
    }
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // find post by id
        { _id: postId },
        // prepend (push) new message to beginning of message array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, add 1 to its 'likes' value to DB
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true } // return updated value imediately
      );
      // Find user, add id of post to its favorites array (which will be populates as posts)
      // add to favorites in user
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      });
      // Return only likes from 'post' and favorites from 'user'
      return {
        likes: post.likes,
        favorites: user.favorites
      }
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, add -1 to its 'like' value to DB
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true } // return updated value imediately
      );
      // Find user, remove id of post from its favorites array (which will be populates as posts)
      // remove favorites array in db
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      });
      // Return only likes from 'post' and favorites from 'user'
      return {
        likes: post.likes,
        favorites: user.favorites
      }
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username }); // unique
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return {
        token: createToken(user, process.env.SECRET, '1hr')
      };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username }); // find user
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return {
        token: createToken(newUser, process.env.SECRET, '1hr')
      };
    }
  }
};
