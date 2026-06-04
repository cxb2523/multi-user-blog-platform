<script lang="ts">
	import { onMount } from 'svelte';
	import { articlesApi, tagsApi } from '$lib/api/client';
	import type { Article, Tag } from '$lib/types';

	let articles: Article[] = [];
	let tags: Tag[] = [];
	let selectedTag: string | null = null;
	let page = 1;
	let totalPages = 1;
	let loading = false;

	async function loadArticles() {
		loading = true;
		try {
			const response = await articlesApi.getAll(page, 10, selectedTag || undefined);
			articles = response.articles;
			totalPages = response.totalPages;
		} catch (error) {
			console.error('加载文章失败:', error);
		} finally {
			loading = false;
		}
	}

	async function loadTags() {
		try {
			const response = await tagsApi.getAll();
			tags = response.tags;
		} catch (error) {
			console.error('加载标签失败:', error);
		}
	}

	function selectTag(tag: string) {
		selectedTag = selectedTag === tag ? null : tag;
		page = 1;
		loadArticles();
	}

	function changePage(newPage: number) {
		page = newPage;
		loadArticles();
	}

	onMount(() => {
		loadArticles();
		loadTags();
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="flex flex-col lg:flex-row gap-8">
		<aside class="lg:w-64 flex-shrink-0">
			<div class="sticky top-24 space-y-6">
				<div class="bg-white rounded-xl shadow-md p-6">
					<h3 class="text-lg font-bold text-gray-900 mb-4">热门标签</h3>
					<div class="flex flex-wrap gap-2">
						{#each tags as tag}
							<button
								on:click={() => selectTag(tag.name)}
								class="px-3 py-1 rounded-full text-sm transition-colors {
									selectedTag === tag.name
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}"
							>
								{tag.name} ({tag.count})
							</button>
						{/each}
					</div>
				</div>
			</div>
		</aside>

		<main class="flex-1">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						{selectedTag ? `标签: ${selectedTag}` : '最新文章'}
					</h1>
					<p class="mt-2 text-gray-600">发现精彩内容，分享你的想法</p>
				</div>
				<a href="/editor" class="btn btn-primary">写文章</a>
			</div>

			{#if loading}
				<div class="flex justify-center items-center py-12">
					<div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
				</div>
			{:else if articles.length === 0}
				<div class="text-center py-12">
					<p class="text-gray-500">暂无文章</p>
				</div>
			{:else}
				<div class="space-y-6">
					{#each articles as article}
						<article class="card hover:shadow-xl transition-all duration-300">
							<div class="p-6">
								<div class="flex flex-wrap gap-2 mb-3">
									{#each article.tags as tag}
										<span class="tag">{tag}</span>
									{/each}
								</div>
								<a href={`/article/${article.id}`}>
									<h2 class="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
										{article.title}
									</h2>
								</a>
								<p class="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
								<div class="flex items-center justify-between text-sm text-gray-500">
									<span>作者: {article.author.username}</span>
									<span>{new Date(article.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
						</article>
					{/each}
				</div>

				{#if totalPages > 1}
					<div class="flex justify-center items-center gap-2 mt-8">
						<button
							on:click={() => changePage(page - 1)}
							disabled={page === 1}
							class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
						>
							上一页
						</button>
						<span class="px-4 py-2 text-gray-600">{page} / {totalPages}</span>
						<button
							on:click={() => changePage(page + 1)}
							disabled={page === totalPages}
							class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
						>
							下一页
						</button>
					</div>
				{/if}
			{/if}
		</main>
	</div>
</div>
