import { get } from 'svelte/store';
import { auth } from '../stores/auth';
import type {
	LoginRequest,
	RegisterRequest,
	AuthResponse,
	Article,
	ArticleListResponse,
	Comment,
	Tag
} from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
	const token = get(auth).token;
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			...getHeaders(),
			...options.headers
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: '请求失败' }));
		throw new Error(error.message || '请求失败');
	}

	return response.json();
}

export const authApi = {
	login: (data: LoginRequest) => request<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(data)
	}),
	register: (data: RegisterRequest) => request<AuthResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(data)
	})
};

export const articlesApi = {
	getAll: (page = 1, limit = 10, tag?: string) => {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		if (tag) params.append('tag', tag);
		return request<ArticleListResponse>(`/articles?${params}`);
	},
	getById: (id: string) => request<Article>(`/articles/${id}`),
	create: (data: Partial<Article>) => request<Article>('/articles', {
		method: 'POST',
		body: JSON.stringify(data)
	}),
	update: (id: string, data: Partial<Article>) => request<Article>(`/articles/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	}),
	delete: (id: string) => request<void>(`/articles/${id}`, {
		method: 'DELETE'
	}),
	getMyArticles: () => request<Article[]>('/articles/my')
};

export const commentsApi = {
	getByArticle: (articleId: string) => request<Comment[]>(`/articles/${articleId}/comments`),
	create: (articleId: string, data: { content: string; parentId?: string }) =>
		request<Comment>(`/articles/${articleId}/comments`, {
			method: 'POST',
			body: JSON.stringify(data)
		})
};

export const tagsApi = {
	getAll: () => request<{ tags: Tag[] }>('/tags')
};
