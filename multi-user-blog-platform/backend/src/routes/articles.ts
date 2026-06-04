import type { FastifyInstance } from 'fastify';
import Article from '../models/Article';
import { authenticate, type AuthRequest } from '../middleware/auth';

export default async function articleRoutes(fastify: FastifyInstance) {
	fastify.get('/', async (request) => {
		const { page = 1, limit = 10, tag } = request.query as {
			page?: number;
			limit?: number;
			tag?: string;
		};

		const query = tag ? { tags: tag } : {};

		const [articles, total] = await Promise.all([
			Article.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate('author', 'username'),
			Article.countDocuments(query)
		]);

		return {
			articles: articles.map(a => ({
				id: a._id,
				title: a.title,
				excerpt: a.excerpt,
				tags: a.tags,
				author: a.author,
				createdAt: a.createdAt,
				updatedAt: a.updatedAt
			})),
			total,
			page,
			totalPages: Math.ceil(total / limit)
		};
	});

	fastify.get('/my', { preHandler: [authenticate] }, async (request: AuthRequest) => {
		const articles = await Article.find({ author: request.user.id })
			.sort({ createdAt: -1 })
			.populate('author', 'username');

		return articles.map(a => ({
			id: a._id,
			title: a.title,
			excerpt: a.excerpt,
			tags: a.tags,
			author: a.author,
			createdAt: a.createdAt,
			updatedAt: a.updatedAt,
			content: a.content
		}));
	});

	fastify.get('/:id', async (request, reply) => {
		const { id } = request.params as { id: string };

		const article = await Article.findById(id).populate('author', 'username');
		if (!article) {
			return reply.status(404).send({ message: '文章不存在' });
		}

		return {
			id: article._id,
			title: article.title,
			content: article.content,
			excerpt: article.excerpt,
			tags: article.tags,
			author: article.author,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt
		};
	});

	fastify.post('/', { preHandler: [authenticate] }, async (request: AuthRequest, reply) => {
		const { title, content, tags } = request.body as {
			title: string;
			content: string;
			tags?: string[];
		};

		const article = new Article({
			title,
			content,
			tags: tags || [],
			author: request.user.id
		});

		await article.save();
		await article.populate('author', 'username');

		return reply.status(201).send({
			id: article._id,
			title: article.title,
			content: article.content,
			excerpt: article.excerpt,
			tags: article.tags,
			author: article.author,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt
		});
	});

	fastify.put('/:id', { preHandler: [authenticate] }, async (request: AuthRequest, reply) => {
		const { id } = request.params as { id: string };
		const { title, content, tags } = request.body as {
			title: string;
			content: string;
			tags?: string[];
		};

		const article = await Article.findById(id);
		if (!article) {
			return reply.status(404).send({ message: '文章不存在' });
		}

		if (article.author.toString() !== request.user.id) {
			return reply.status(403).send({ message: '无权限编辑此文章' });
		}

		article.title = title;
		article.content = content;
		if (tags) article.tags = tags;

		await article.save();
		await article.populate('author', 'username');

		return {
			id: article._id,
			title: article.title,
			content: article.content,
			excerpt: article.excerpt,
			tags: article.tags,
			author: article.author,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt
		};
	});

	fastify.delete('/:id', { preHandler: [authenticate] }, async (request: AuthRequest, reply) => {
		const { id } = request.params as { id: string };

		const article = await Article.findById(id);
		if (!article) {
			return reply.status(404).send({ message: '文章不存在' });
		}

		if (article.author.toString() !== request.user.id) {
			return reply.status(403).send({ message: '无权限删除此文章' });
		}

		await Article.findByIdAndDelete(id);

		return reply.send({ message: '文章已删除' });
	});
}
