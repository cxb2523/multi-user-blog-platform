import type { FastifyInstance } from 'fastify';
import User from '../models/User';

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post<{
		Body: { username: string; email: string; password: string };
	}>('/register', async (request, reply) => {
		try {
			const { username, email, password } = request.body;

			const existingUser = await User.findOne({ $or: [{ email }, { username }] });
			if (existingUser) {
				return reply.status(400).send({ message: '用户已存在' });
			}

			const user = new User({
				username,
				email,
				passwordHash: password
			});

			await user.save();

			const token = fastify.jwt.sign({
				id: user._id,
				username: user.username,
				email: user.email
			});

			return reply.status(201).send({
				token,
				user: {
					id: user._id,
					username: user.username,
					email: user.email
				}
			});
		} catch (error) {
			return reply.status(500).send({ message: '注册失败', error });
		}
	});

	fastify.post<{
		Body: { email: string; password: string };
	}>('/login', async (request, reply) => {
		try {
			const { email, password } = request.body;

			const user = await User.findOne({ email });
			if (!user) {
				return reply.status(401).send({ message: '邮箱或密码错误' });
			}

			const isMatch = await user.comparePassword(password);
			if (!isMatch) {
				return reply.status(401).send({ message: '邮箱或密码错误' });
			}

			const token = fastify.jwt.sign({
				id: user._id,
				username: user.username,
				email: user.email
			});

			return reply.send({
				token,
				user: {
					id: user._id,
					username: user.username,
					email: user.email
				}
			});
		} catch (error) {
			return reply.status(500).send({ message: '登录失败', error });
		}
	});
}
