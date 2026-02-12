import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { AppDataSource } from './data-source';
import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';

async function main() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server),
  );

  const port = parseInt(process.env.BACKEND_PORT || '4000', 10);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
