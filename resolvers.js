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
