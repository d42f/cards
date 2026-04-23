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
    dailyGoal: Int!
    students: [User!]!
    teachers: [User!]!
  }

  type WordSet {
    id: ID!
    title: String!
    words: [Word!]!
    studiedCount: Int!
    dueCount: Int!
  }

  type Word {
    id: ID!
    word: String!
    translation: String!
  }

  type Progress {
    id: ID!
    wordId: ID!
    wordSetId: ID!
    easeFactor: Float!
    interval: Int!
    repetitions: Int!
    nextReviewAt: String
  }

  type TrainingSession {
    id: ID!
    wordSetId: ID!
    totalWords: Int!
    knownWords: Int!
    completedAt: String!
  }

  type MyStats {
    totalWords: Int!
    studiedWords: Int!
    wordSetCount: Int!
    streak: Int!
    todayCount: Int!
    weekActivity: [Boolean!]!
  }

  type Query {
    me: User
    myStats: MyStats!
    wordSets: [WordSet!]!
    wordSet(id: ID!): WordSet
    dueWords(wordSetId: ID!): [Word!]!
    myStudents: [User!]!
    myTeachers: [User!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!, role: Role): User!
    createWordSet(title: String!): WordSet!
    addWord(wordSetId: ID!, word: String!, translation: String!): Word!
    reviewWord(wordId: ID!, wordSetId: ID!, quality: Int!): Progress!
    addStudent(studentId: ID!): User!
    removeStudent(studentId: ID!): User!
    finishSession(wordSetId: ID!, totalWords: Int!, knownWords: Int!): TrainingSession!
  }
`;
