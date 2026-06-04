import type { FastifyInstance } from 'fastify';
import Article from '../models/Article';

export default async function tagRoutes(fastify: FastifyInstance) {
	fastify.get('/tags', async () => {
		const tags = await Article.aggregate([
			{ $unwind: '$tags' },
			{ $group: { _id: '$tags', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $project: { name: '$_id', count: 1, _id: 0 } }
		]);

		return { tags };
	});
}
