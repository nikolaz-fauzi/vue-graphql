const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');

// Import typedefs and resolver
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// import environment variables and mongoose models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

// Connect to mongoose cloud atlas
mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology:true, useNewUrlParser: true })
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.log(err));

// Verify JWT Token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError('Your session has ended. please sign in again.');
    }
  }
}

// create apollo/graphQL server using typedefs, resolver, context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return {
      User,
      Post,
      currentUser: await getUser(token)
    }
  }
});

// listening, default port 4000
server.listen(4001).then(({ url }) => {
  console.log(`Server listening ${url}`);
});
