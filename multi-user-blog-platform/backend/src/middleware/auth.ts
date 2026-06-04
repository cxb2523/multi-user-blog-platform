import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthRequest extends FastifyRequest {
	user: {
		id: string;
		username: string;
		email: string;
	};
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.headers.authorization?.replace('Bearer ', '');
		
		if (!token) {
			return reply.status(401).send({ message: '未提供认证令牌' });
		}

		const decoded = request.jwtVerify<{ id: string; username: string; email: string }>();
		(request as AuthRequest).user = await decoded;
	} catch (error) {
		return reply.status(401).send({ message: '无效的认证令牌' });
	}
};
