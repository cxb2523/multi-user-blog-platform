<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { articlesApi } from '$lib/api/client';
	import type { Article } from '$lib/types';

	let articles: Article[] = [];
	let loading = false;
	let deletingId: string | null = null;

	$: if (!$auth.isAuthenticated) {
		goto('/login');
	}

	async function loadArticles() {
		loading = true;
		try {
			articles = await articlesApi.getMyArticles();
		} catch (error) {
			console.error('加载文章失败:', error);
		} finally {
			loading = false;
		}
	}

	async function deleteArticle(id: string) {
		if (!confirm('确定要删除这篇文章吗？')) return;

		try {
			deletingId = id;
			await articlesApi.delete(id);
			articles = articles.filter(a => a.id !== id);
		} catch (error) {
			console.error('删除文章失败:', error);
		} finally {
			deletingId = null;
		}
	}

	onMount(() => {
		loadArticles();
	});
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">我的文章</h1>
		<p class="mt-2 text-gray-600">管理你发布的所有文章</p>
	</div>

	<div class="flex justify-end mb-6">
		<a href="/editor" class="btn btn-primary">写新文章</a>
	</div>

	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
		</div>
	{:else if articles.length === 0}
		<div class="text-center py-16 bg-gray-50 rounded-xl">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
			</svg>
			<h3 class="mt-4 text-lg font-medium text-gray-900">还没有文章</h3>
			<p class="mt-2 text-gray-500">开始写作，分享你的想法与世界</p>
			<div class="mt-6">
				<a href="/editor" class="btn btn-primary">开始写作</a>
			</div>
		</div>
	{:else}
		<div class="bg-white rounded-xl shadow-md overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each articles as article}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<a href={`/article/${article.id}`} class="text-primary hover:underline font-medium">
									{article.title}
								</a>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex flex-wrap gap-1">
									{#each article.tags.slice(0, 2) as tag}
										<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{tag}</span>
									{/each}
									{#if article.tags.length > 2}
										<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">+{article.tags.length - 2}</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(article.createdAt).toLocaleDateString()}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<a href={`/editor?id=${article.id}`} class="text-primary hover:text-primary/80 mr-4">编辑</a>
								<button
									on:click={() => deleteArticle(article.id)}
									disabled={deletingId === article.id}
									class="text-red-600 hover:text-red-800 disabled:opacity-50"
								>
									{#if deletingId === article.id}
										删除中...
									{:else}
										删除
									{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
