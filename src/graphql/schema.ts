export const typeDefs = `#graphql
  enum Role {
    STUDENT
    TEACHER
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: Role!
  }

  type WordSet {
    id: ID!
    title: String!
    teacher: User!
    words: [Word!]!
  }

  type Word {
    id: ID!
    term: String!
    definition: String!
  }

  type Progress {
    id: ID!
    wordId: ID!
    wordSetId: ID!
    score: Int!
  }

  type Query {
    wordSets: [WordSet!]!
    wordSet(id: ID!): WordSet
    myProgress(wordSetId: ID!): [Progress!]!
  }

  type Mutation {
    createWordSet(title: String!): WordSet!
    addWord(wordSetId: ID!, term: String!, definition: String!): Word!
    updateProgress(wordId: ID!, wordSetId: ID!, score: Int!): Progress!
    register(email: String!, password: String!, name: String, role: Role): User!
  }
`;
