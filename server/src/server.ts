import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas';
import db from './config/connection';
import { authMiddleware } from './services/auth';

const PORT = process.env.PORT || 3001;

const app = express();

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  app.use('/graphql', expressMiddleware(server));
};

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
  });
});
