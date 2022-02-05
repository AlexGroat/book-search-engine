const { AuthenticationError } = require("apollo-server-express");
const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolver = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).select("User");
      }
      throw new AuthenticationError("You need to be logged in!")
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email address");
      }

      const rightPassword = await user.isCorrectPassword(password);

      if (!rightPassword) {
          throw new AuthenticationError('Invalid Password');
      }

      const token = signToken(user);

      return { token, user };
    },

    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { input }, context) => {
        if (context.user) {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                {  $addToSet: { savedBooks: input }},
                { new: true, runValidators: true }
            );

            return updateUser;
        }
        throw new AuthenticationError('You must be logged in!')
    },

    deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: {bookId: bookId }}},
                { new: true },
            );

            return updateUser
        }
        throw new AuthenticationError('You must be logged in!')
    }
  },
};

module.exports = resolvers;
