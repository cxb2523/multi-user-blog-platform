export interface User {
	id: string;
	username: string;
	email: string;
	createdAt: string;
}

export interface Article {
	id: string;
	title: string;
	content: string;
	excerpt: string;
	tags: string[];
	author: {
		id: string;
		username: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface Comment {
	id: string;
	content: string;
	author: {
		id: string;
		username: string;
	};
	article: string;
	parentId?: string;
	createdAt: string;
}

export interface Tag {
	name: string;
	count: number;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface ArticleListResponse {
	articles: Article[];
	total: number;
	page: number;
	totalPages: number;
}
