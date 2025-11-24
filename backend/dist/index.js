"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeDefs_1 = require("./schema/typeDefs");
const resolvers_1 = require("./schema/resolvers");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ultraship-ems';
const startServer = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB => ', MONGODB_URI);
        const server = new server_1.ApolloServer({
            typeDefs: typeDefs_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        const { url } = await (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: Number(process.env.PORT) || 4000 },
        });
        console.log(`🚀  Server ready at: ${url}`);
    }
    catch (err) {
        console.error('Error starting server:', err);
    }
};
startServer();
