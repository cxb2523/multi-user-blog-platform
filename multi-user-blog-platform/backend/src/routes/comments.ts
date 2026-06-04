import type { FastifyInstance } from 'fastify';
import Comment from '../models/Comment';
import { authenticate, type AuthRequest } from '../middleware/auth';

export default async function commentRoutes(fastify: FastifyInstance) {
	fastify.get('/articles/:articleId/comments', async (request) => {
		const { articleId } = request.params as { articleId: string };

		const comments = await Comment.find({ article: articleId })
			.sort({ createdAt: -1 })
			.populate('author', 'username');

		return comments.map(c => ({
			id: c._id,
			content: c.content,
			author: c.author,
			article: c.article,
			parentId: c.parentId,
			createdAt: c.createdAt
		}));
	});

	fastify.post('/articles/:articleId/comments', { preHandler: [authenticate] }, async (request: AuthRequest, reply) => {
		const { articleId } = request.params as { articleId: string };
		const { content, parentId } = request.body as {
			content: string;
			parentId?: string;
		};

		const comment = new Comment({
			content,
			article: articleId,
			author: request.user.id,
			parentId
		});

		await comment.save();
		await comment.populate('author', 'username');

		return reply.status(201).send({
			id: comment._id,
			content: comment.content,
			author: comment.author,
			article: comment.article,
			parentId: comment.parentId,
			createdAt: comment.createdAt
		});
	});
}
