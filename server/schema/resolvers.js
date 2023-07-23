const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                try {
                    const user = await User.findById(context.user._id);
                    return user;
                } catch (error) {
                    console.error(error);
                    throw new Error('Failed to fetch user data.');
                }
            } else {
                return null;
            }
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    throw new AuthenticationError('Incorrect email or password.');
                }

                const correctPassword = await user.isCorrectPassword(password);

                if (!correctPassword) {
                    throw new AuthenticationError('Incorrect email or password.');
                }

                const token = signToken(user);

                return { token, user };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to log in.');
            }
        },
        addUser: async (parent, args) => {
            try {
                const newUser = await User.create(args);
                const token = signToken(newUser);
                return { token, user: newUser };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create a new user.');
            }
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                try {
                    const user = await User.findById(context.user._id);

                    user.savedBooks.push({
                        bookId: args.bookId,
                        authors: args.authors,
                        description: args.description,
                        title: args.title,
                        image: args.image || '',
                        link: args.link || '',
                    });

                    const updatedUser = await user.save();
                    return updatedUser;
                } catch (error) {
                    console.error(error);
                    throw new Error('Failed to save the book.');
                }
            } else {
                throw new AuthenticationError('You need to be logged in to save a book.');
            }
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                try {
                    const user = await User.findById(context.user._id);

                    user.savedBooks = user.savedBooks.filter((book) => book.bookId !== args.bookId);

                    const updatedUser = await user.save();
                    return updatedUser;
                } catch (error) {
                    console.error(error);
                    throw new Error('Failed to remove the book.');
                }
            } else {
                throw new AuthenticationError('You need to be logged in to remove a book.');
            }
        },
    },
};

module.exports = resolvers;
