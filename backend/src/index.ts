import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ultraship-ems';

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB => ', MONGODB_URI);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(process.env.PORT) || 4000 },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
