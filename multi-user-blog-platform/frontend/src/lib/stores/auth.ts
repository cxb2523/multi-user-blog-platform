import { writable } from 'svelte/store';
import type { User } from '../types';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const initialState: AuthState = {
		user: null,
		token: null,
		isAuthenticated: false
	};

	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		login: (user: User, token: string) => {
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			set({ user, token, isAuthenticated: true });
		},
		logout: () => {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			set({ user: null, token: null, isAuthenticated: false });
		},
		init: () => {
			const token = localStorage.getItem('token');
			const userStr = localStorage.getItem('user');
			if (token && userStr) {
				try {
					const user = JSON.parse(userStr);
					set({ user, token, isAuthenticated: true });
				} catch (e) {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
				}
			}
		}
	};
}

export const auth = createAuthStore();
