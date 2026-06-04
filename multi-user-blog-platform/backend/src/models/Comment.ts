import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './User';
import type { IArticle } from './Article';

export interface IComment extends Document {
	content: string;
	author: IUser['_id'];
	article: IArticle['_id'];
	parentId?: IComment['_id'];
	createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
	content: {
		type: String,
		required: [true, '评论内容不能为空'],
		trim: true,
		maxlength: [1000, '评论不能超过1000个字符']
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	article: {
		type: Schema.Types.ObjectId,
		ref: 'Article',
		required: true
	},
	parentId: {
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model<IComment>('Comment', CommentSchema);
