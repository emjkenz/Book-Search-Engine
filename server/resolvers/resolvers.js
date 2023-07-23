// Replace this with your actual logic to fetch user data from the database
const mockUserData = {
    _id: '123',
    username: 'john_doe',
    email: 'john@example.com',
};

const resolvers = {
    Query: {
        me: () => mockUserData,
    },
};

module.exports = resolvers;
