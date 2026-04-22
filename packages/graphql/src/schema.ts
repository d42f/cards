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
    term: String!
    definition: String!
  }

  type Progress {
    id: ID!
    wordId: ID!
    wordSetId: ID!
    score: Int!
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
    finishSession(wordSetId: ID!, totalWords: Int!, knownWords: Int!): TrainingSession!
  }
`;
