import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import articleRoutes from './routes/articles';
import commentRoutes from './routes/comments';
import tagRoutes from './routes/tags';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

const server = fastify({ logger: true });

server.register(cors, {
	origin: true,
	credentials: true
});

server.register(jwt, {
	secret: JWT_SECRET
});

server.register(authRoutes, { prefix: '/api/auth' });
server.register(articleRoutes, { prefix: '/api/articles' });
server.register(commentRoutes, { prefix: '/api' });
server.register(tagRoutes, { prefix: '/api' });

const start = async () => {
	try {
		await connectDB(MONGODB_URI);
		await server.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`服务器运行在 http://localhost:${PORT}`);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
