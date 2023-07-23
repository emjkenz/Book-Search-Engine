const { gql } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./typedefs');

module.exports = {typeDefs, resolvers};
