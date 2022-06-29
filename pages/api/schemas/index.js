import { gql } from "apollo-server"

export const typeDefs = gql`
  type Mahasiswa {
    name: String
    email: String
    nim: String
    domisili: String
  }
  type Query {
    getMahasiswa: [Mahasiswa]
  }
`