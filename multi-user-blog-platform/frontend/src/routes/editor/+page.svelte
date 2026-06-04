<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { articlesApi } from '$lib/api/client';

	let title = '';
	let content = '';
	let tagsInput = '';
	let loading = false;
	let error = '';
	let isEdit = false;
	let articleId: string | null = null;

	$: if (!$auth.isAuthenticated) {
		goto('/login');
	}

	onMount(async () => {
		const id = $page.url.searchParams.get('id');
		if (id) {
			isEdit = true;
			articleId = id;
			try {
				const article = await articlesApi.getById(id);
				title = article.title;
				content = article.content;
				tagsInput = article.tags.join(', ');
			} catch (err: any) {
				error = '加载文章失败';
			}
		}
	});

	async function handleSubmit() {
		if (!title.trim()) {
			error = '请输入标题';
			return;
		}
		if (!content.trim()) {
			error = '请输入内容';
			return;
		}

		const tags = tagsInput
			.split(',')
			.map(t => t.trim())
			.filter(t => t);

		try {
			loading = true;
			error = '';

			if (isEdit && articleId) {
				await articlesApi.update(articleId, { title, content, tags });
			} else {
				await articlesApi.create({ title, content, tags });
			}

			await goto('/dashboard');
		} catch (err: any) {
			error = err.message || '保存失败';
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">
			{isEdit ? '编辑文章' : '写文章'}
		</h1>
		<p class="mt-2 text-gray-600">分享你的想法与世界</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
				{error}
			</div>
		{/if}

		<div>
			<label for="title" class="block text-sm font-medium text-gray-700 mb-2">标题</label>
			<input
				id="title"
				type="text"
				placeholder="输入文章标题..."
				class="input text-lg"
				bind:value={title}
			/>
		</div>

		<div>
			<label for="tags" class="block text-sm font-medium text-gray-700 mb-2">标签 (逗号分隔)</label>
			<input
				id="tags"
				type="text"
				placeholder="例如: 技术, 生活, 教程"
				class="input"
				bind:value={tagsInput}
			/>
		</div>

		<div>
			<label for="content" class="block text-sm font-medium text-gray-700 mb-2">内容 (支持 Markdown)</label>
			<textarea
				id="content"
				placeholder="开始写作..."
				rows="20"
				class="input font-mono text-sm"
				bind:value={content}
			/>
		</div>

		<div class="flex items-center gap-4">
			<button
				type="submit"
				disabled={loading}
				class="btn btn-primary flex items-center gap-2"
			>
				{#if loading}
					<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
					</svg>
				{/if}
				{isEdit ? '更新文章' : '发布文章'}
			</button>
			<a href="/dashboard" class="btn btn-outline">取消</a>
		</div>
	</form>
</div>
