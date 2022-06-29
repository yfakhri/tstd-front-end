import { request, gql } from 'graphql-request'

export const resolvers = {
  Query: {
    getMahasiswa: async () => {
      try {
        const query = gql`
        {
          questionAllAnswers
          questionMany{
            _id
            qname
          }
        }
        `
        const users = await request(process.env.NEXT_PUBLIC_GQL_URI,query);
        return users.questionAllAnswers.map((quest) =>{
          const nim=users.questionMany.find(el=>el.qname==="NIM")
          const domisili=users.questionMany.find(el=>el.qname==="Domisili")
          return {
            name:quest.name,
            email:quest.email,
            nim:quest[nim._id],
            domisili:quest[domisili._id],
          } 
        }
        )
      } catch (error) {
        throw error;
      }
    }
  }
}
