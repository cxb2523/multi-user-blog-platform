<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { authApi } from '$lib/api/client';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSubmit() {
		try {
			loading = true;
			error = '';
			const response = await authApi.login({ email, password });
			auth.login(response.user, response.token);
			await goto('/');
		} catch (err: any) {
			error = err.message || '登录失败';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-gray-900">欢迎回来</h2>
			<p class="mt-2 text-sm text-gray-600">登录你的账户继续</p>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
					{error}
				</div>
			{/if}
			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						class="input"
						bind:value={email}
					/>
				</div>
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">密码</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						class="input"
						bind:value={password}
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="w-full btn btn-primary flex justify-center items-center gap-2"
				>
					{#if loading}
						<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
						</svg>
					{/if}
					登录
				</button>
			</div>

			<div class="text-center">
				<p class="text-sm text-gray-600">
					还没有账户?
					<a href="/register" class="font-medium text-primary hover:text-primary/80">立即注册</a>
				</p>
			</div>
		</form>
	</div>
</div>
