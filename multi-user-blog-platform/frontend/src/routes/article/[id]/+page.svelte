<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';
	import { auth } from '$lib/stores/auth';
	import { articlesApi, commentsApi } from '$lib/api/client';
	import type { Article, Comment } from '$lib/types';

	let article: Article | null = null;
	let comments: Comment[] = [];
	let newComment = '';
	let loading = false;
	let submittingComment = false;

	$: articleId = $page.params.id;

	async function loadArticle() {
		loading = true;
		try {
			article = await articlesApi.getById(articleId);
		} catch (error) {
			console.error('加载文章失败:', error);
		} finally {
			loading = false;
		}
	}

	async function loadComments() {
		try {
			comments = await commentsApi.getByArticle(articleId);
		} catch (error) {
			console.error('加载评论失败:', error);
		}
	}

	async function submitComment() {
		if (!$auth.isAuthenticated) {
			await goto('/login');
			return;
		}

		if (!newComment.trim()) return;

		try {
			submittingComment = true;
			const comment = await commentsApi.create(articleId, { content: newComment });
			comments = [comment, ...comments];
			newComment = '';
		} catch (error) {
			console.error('提交评论失败:', error);
		} finally {
			submittingComment = false;
		}
	}

	$: renderedContent = article ? marked.parse(article.content) : '';

	onMount(() => {
		loadArticle();
		loadComments();
	});
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
		</div>
	{:else if !article}
		<div class="text-center py-12">
			<p class="text-gray-500">文章不存在</p>
		</div>
	{:else}
		<article>
			<header class="mb-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
				<div class="flex flex-wrap items-center gap-4 mb-4">
					<div class="flex flex-wrap gap-2">
						{#each article.tags as tag}
							<a href="/?tag={tag}" class="tag">{tag}</a>
						{/each}
					</div>
				</div>
				<div class="flex items-center justify-between text-sm text-gray-500">
					<span>作者: {article.author.username}</span>
					<span>发布于: {new Date(article.createdAt).toLocaleDateString()}</span>
				</div>
			</header>

			<div class="prose prose-lg max-w-none mb-12">
				{@html renderedContent}
			</div>

			<section class="border-t pt-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">评论 ({comments.length})</h2>

				{#if $auth.isAuthenticated}
					<div class="mb-8">
						<textarea
							placeholder="写下你的评论..."
							rows="3"
							class="input mb-3"
							bind:value={newComment}
						/>
						<button
							on:click={submitComment}
							disabled={submittingComment || !newComment.trim()}
							class="btn btn-primary"
						>
							{#if submittingComment}
								<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
								</svg>
							{/if}
							发表评论
						</button>
					</div>
				{:else}
					<div class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
						<p class="text-gray-600">
							<a href="/login" class="text-primary font-medium hover:underline">登录</a>
							后发表评论
						</p>
					</div>
				{/if}

				{#if comments.length === 0}
					<p class="text-gray-500 text-center py-8">暂无评论，来抢沙发吧！</p>
				{:else}
					<div class="space-y-6">
						{#each comments as comment}
							<div class="bg-gray-50 rounded-lg p-4">
								<div class="flex items-center justify-between mb-2">
									<span class="font-medium text-gray-900">{comment.author.username}</span>
									<span class="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
								</div>
								<p class="text-gray-700">{comment.content}</p>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</article>
	{/if}
</div>
