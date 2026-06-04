import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	username: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
	comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
	username: {
		type: String,
		required: [true, '用户名不能为空'],
		unique: true,
		trim: true,
		minlength: [3, '用户名至少3个字符']
	},
	email: {
		type: String,
		required: [true, '邮箱不能为空'],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
	},
	passwordHash: {
		type: String,
		required: [true, '密码不能为空']
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('passwordHash')) return next();
	
	const salt = await bcrypt.genSalt(10);
	this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
	next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
