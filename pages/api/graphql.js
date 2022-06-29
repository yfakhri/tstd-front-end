import  {  ApolloServer  }  from  "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import  {  typeDefs  }  from  "./schemas";
import  {  resolvers  }  from  "./resolvers";

const  apolloServer  =  new  ApolloServer({  typeDefs,  resolvers, playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],});

  const startServer = apolloServer.start();
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export  const  config  =  {
    api:  {
        bodyParser:  false
    }
};

