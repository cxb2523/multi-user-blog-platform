import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './User';

export interface IArticle extends Document {
	title: string;
	content: string;
	excerpt: string;
	tags: string[];
	author: IUser['_id'];
	createdAt: Date;
	updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
	title: {
		type: String,
		required: [true, '标题不能为空'],
		trim: true,
		maxlength: [200, '标题不能超过200个字符']
	},
	content: {
		type: String,
		required: [true, '内容不能为空']
	},
	excerpt: {
		type: String,
		trim: true
	},
	tags: [{
		type: String,
		trim: true
	}],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

ArticleSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	
	if (!this.excerpt && this.content) {
		this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
	}
	
	next();
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
