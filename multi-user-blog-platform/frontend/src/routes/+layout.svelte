<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import '../app.css';

	onMount(() => {
		auth.init();
	});

	let showMenu = false;
</script>

<header class="bg-white shadow-sm sticky top-0 z-50">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="text-2xl font-display font-bold text-primary">
					BlogHub
				</a>
			</div>
			
			<div class="hidden md:flex items-center space-x-4">
				<a href="/" class="text-gray-700 hover:text-primary transition-colors">首页</a>
				{#if $auth.isAuthenticated}
					<a href="/editor" class="text-gray-700 hover:text-primary transition-colors">写文章</a>
					<a href="/dashboard" class="text-gray-700 hover:text-primary transition-colors">我的</a>
					<button on:click={() => auth.logout()} class="btn btn-outline text-sm">退出</button>
				{:else}
					<a href="/login" class="text-gray-700 hover:text-primary transition-colors">登录</a>
					<a href="/register" class="btn btn-primary text-sm">注册</a>
				{/if}
			</div>

			<div class="md:hidden flex items-center">
				<button on:click={() => showMenu = !showMenu} class="text-gray-700">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				</button>
			</div>
		</div>

		{#if showMenu}
			<div class="md:hidden py-4 border-t space-y-2">
				<a href="/" class="block py-2 text-gray-700 hover:text-primary">首页</a>
				{#if $auth.isAuthenticated}
					<a href="/editor" class="block py-2 text-gray-700 hover:text-primary">写文章</a>
					<a href="/dashboard" class="block py-2 text-gray-700 hover:text-primary">我的</a>
					<button on:click={() => auth.logout()} class="block py-2 text-gray-700 hover:text-primary">退出</button>
				{:else}
					<a href="/login" class="block py-2 text-gray-700 hover:text-primary">登录</a>
					<a href="/register" class="block py-2 text-primary font-semibold">注册</a>
				{/if}
			</div>
		{/if}
	</nav>
</header>

<main class="min-h-screen">
	<slot />
</main>

<footer class="bg-dark text-white py-8 mt-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<p class="text-2xl font-display font-bold mb-4">BlogHub</p>
			<p class="text-gray-400">© 2024 BlogHub. 分享你的想法与世界。</p>
		</div>
	</div>
</footer>
