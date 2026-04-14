export const typeDefs = `#graphql
  enum Role {
    STUDENT
    TEACHER
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    streak: Int!
    students: [User!]!
    teachers: [User!]!
  }

  type WordSet {
    id: ID!
    title: String!
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

  type MyStats {
    totalWords: Int!
    studiedWords: Int!
    wordSetCount: Int!
    streak: Int!
  }

  type Query {
    myStats: MyStats!
    latestWordSet: WordSet
    wordSets: [WordSet!]!
    wordSet(id: ID!): WordSet
    myProgress(wordSetId: ID!): [Progress!]!
    myStudents: [User!]!
    myTeachers: [User!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!, role: Role): User!
    createWordSet(title: String!): WordSet!
    addWord(wordSetId: ID!, term: String!, definition: String!): Word!
    updateProgress(wordId: ID!, wordSetId: ID!, score: Int!): Progress!
    addStudent(studentId: ID!): User!
    removeStudent(studentId: ID!): User!
  }
`;
