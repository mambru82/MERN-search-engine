const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookId: String!): User
        removeBook(bookId: String!): User
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User

    }

    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs