<script module lang="ts">
	export const dClassDocMetaEdit =
		'absolute w-[96%] left-[2%] h-[calc(100vh-4rem)] bg-white z-10 top-12 border-2 border-t-0 rounded-b-lg border-rock-300 overflow-y-scroll shadow-[0_30px_5px_20px_var(--background-50)]'; //t
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { watch } from 'runed';

	import { allDocumentTags, autocompleteSuggestions, type Doc } from '../store.svelte.js';
	import FitContentWrapTextarea from './FitContentWrapTextarea.svelte';
	import { TagsEditor } from '../components/ComponentMetaEdit.svelte';
	import { deepEqual, DynamicGroupStylesheet, DynamicStylesheet } from '../helper.js';
	import { createPublishDoc } from '../documents/docsaving.svelte.js';
	import { generateRuleString } from '../documents/DocStyles.svelte';
	import type { SvelteCompiler } from '../svelte/compiler.js';
	import type { DocumentEditorProps } from '../App.svelte';

	const doc: Doc = getContext('doc');
	const doPublish: () => DocumentEditorProps['doPublish'] = getContext('doPublish');
	const getDocEl: () => HTMLElement = getContext('getDocEl');
	const getDataStyles: () => DynamicStylesheet<string> = getContext('getDataStyles');
	const getComponentElStyles: () => DynamicStylesheet<string> = getContext('getComponentElStyles');
	const getSvelteCompiler: () => SvelteCompiler = getContext('getSvelteCompiler');
	// const getSvelteCompStyles: () => DynamicGroupStylesheet<string> = getContext(
	//   "getSvelteCompStyles",
	// );

	const flushServerChanges: () => Promise<[void | Response, void, void]> =
		getContext('flushServerChanges');

	async function publishChanges() {
		const docEl = getDocEl();
		const svelteCompiler = getSvelteCompiler();

		const mainStyles = doc.styles
			.map((rule) => generateRuleString(rule.selector, rule.declarations, rule.compInheritance))
			.join('\n');
		const dataStyles = getDataStyles();
		const componentElStyles = getComponentElStyles();

		disablePublishBtn = true;

		publishResp = flushServerChanges()
			.then(() =>
				// IMP: The order of stylesheets passed in MATTERS for determining the result of the CSS cascade.
				//      It should be the same order as the dynamic stylesheets are defined/initalised in App.svelte.
				createPublishDoc(docEl, [mainStyles, dataStyles, componentElStyles], {
					svelteCompiler
				})
			)
			.then(({ bodyStr, stylesheetStr }) => {
				console.log('PUBLISHING CHANGES.');
				console.log('HTML string of published document:\n--------\n' + bodyStr);
				console.log('Stylesheet string of published document:\n-------\n' + stylesheetStr);
				// return fetch_('/documents/api/publish_development_document', {
				// 	method: 'post',
				// 	body: JSON.stringify({
				// 		id: doc.info.id,
				// 		body: bodyStr,
				// 		stylesheet: stylesheetStr
				// 	})
				// });
				return Promise.resolve(
					doPublish()({
						id: doc.id,
						body: bodyStr,
						stylesheet: stylesheetStr,
						compLibVer: doc.compLibVer,
						...doc.info
					})
				);
			});
		publishResp.finally(() => (disablePublishBtn = false));
	}

	//////////////

	function validateTitle(title: string) {
		if (title.length === 0) return 'Title required';
		if (title.length > 128) return 'Title should be less then 129 characters';
		return null;
	}

	function validateDescription(description: string) {
		return null;
	}

	let tagsEditorEl: HTMLElement | null = $state(null);
	let didEditorSync: boolean = false;
	const tagsEditor = new TagsEditor(
		(index, tags) => {
			const tag = tags[index];
			let msg = '';

			if (tags.slice(0, index).includes(tag)) msg = 'Added already';

			if (!allDocumentTags.some((existingTag) => existingTag.name === tag)) msg = 'Nonexistent tag';

			if (tag.length === 0) msg = 'Missing tag';

			const exists = msg === '';
			return [exists, msg !== '', msg];
		},
		(tags) => {
			doc.info.tags = tags;
			didEditorSync = true;
			setTimeout(() => (didEditorSync = false));
		},
		['+']
	);

	watch(
		() => doc.info.tags,
		(curr, prev) => {
			if (didEditorSync) {
				console.log('SKIPPED');
				didEditorSync = false;
				return;
			}
			if (!deepEqual(curr, prev) && tagsEditorEl) tagsEditor.setTags(curr, tagsEditorEl);
		}
	);

	function handleTagsAutocomplete() {
		const caret = getSelection();
		if (!caret || !caret.focusNode) return;
		const node = caret.focusNode;
		if (
			(node instanceof HTMLElement && node.closest('#edit-tags-doc span:not(.space)')) ||
			node.parentElement?.closest('#edit-tags-doc span:not(.space)')
		) {
			$autocompleteSuggestions = allDocumentTags
				.map(({ name }) => name)
				.filter((name) => node.textContent && name.startsWith(node.textContent))
				.toSorted((a, b) => a.length - b.length);
		} else {
			$autocompleteSuggestions = [];
		}
	}

	let confirmPublish = $state(false);
	let publishResp: Promise<void> | null = $state(null);
	let disablePublishBtn = $state(false);
</script>

<svelte:document
	onselectionchange={() => {
		if (!tagsEditorEl) return;
		tagsEditor.onSelectionChange(tagsEditorEl);
	}}
/>

<div class="my-4 text-center text-xl text-rock-800 italic">View/Edit the document's metadata</div>

<div>
	<div class="mx-auto flex max-w-5xl items-stretch px-4 text-lg">
		<label for="edit-title" class="flex items-center text-2xl text-rock-700">Title:</label>
		<div class="relative mx-3 grow">
			<input
				class="w-full rounded border-b-2 border-rock-300 bg-background px-3 py-1.5 font-mono text-rock-600 inset-shadow-none ring-steel-200 inset-shadow-rock-200 outline-none focus:bg-white focus:ring-4 [.error]:border-red-300 [.error]:focus:ring-red-200"
				class:error={validateTitle(doc.info.title)}
				type="text"
				name="edit-title"
				id="edit-title"
				placeholder="Guidance Document Title"
				spellcheck="true"
				bind:value={doc.info.title}
			/>
			{#if validateTitle(doc.info.title)}
				<div class="absolute bottom-2 ml-3 translate-y-full text-sm font-bold text-red-400">
					<span class="bg-white px-1">{validateTitle(doc.info.title)}</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="mx-auto mt-12 flex max-w-3xl items-stretch px-4">
		<label for="edit-description" class="flex items-center text-2xl text-rock-700"
			>Description:</label
		>
		<div class="relative mx-3 flex grow">
			<FitContentWrapTextarea
				class="{validateDescription(doc.info.description)
					? 'error'
					: ''} box-content w-full grow resize-none rounded border-b-2 border-rock-300 bg-background px-3 py-1.5 font-mono text-rock-600 inset-shadow-none ring-steel-200 inset-shadow-rock-200 outline-none focus:bg-white focus:ring-4 [.error]:border-red-300 [.error]:focus:ring-red-200"
				dontModifyWidth
				name="edit-description"
				id="edit-description"
				placeholder="Brief description of guidance document."
				bind:value={doc.info.description}
			/>
			{#if validateDescription(doc.info.description)}
				<div class="absolute bottom-2 ml-3 translate-y-full text-sm font-bold text-red-400">
					<span class="bg-white px-1">{validateDescription(doc.info.description)}</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="mx-auto mt-5 flex max-w-3xl px-4">
		<label
			for="edit-tags-doc"
			class="flex items-center text-2xl text-rock-700"
			id="edit-tags-doc-label">Tags:</label
		>
		<div
			role="application"
			aria-labelledby="edit-tags-doc-label"
			spellcheck="false"
			contenteditable="true"
			id="edit-tags-doc"
			bind:this={tagsEditorEl}
			oninput={(e) => {
				if (tagsEditorEl) {
					tagsEditor.onInput(tagsEditorEl);
					handleTagsAutocomplete();
				}
			}}
			onkeydown={(e) => tagsEditor.onKeydown(e)}
			class="relative mx-3 flex min-w-60 flex-wrap font-mono text-rock-600 outline-none"
		></div>
	</div>
</div>
<div class="mx-auto mt-1 max-w-3xl pl-8 text-base text-rock-500 italic">
	Press "+" while editing to add new tags. <a
		class="ml-1 text-lg text-steel-600 underline hover:no-underline"
		href="/documents/tags"
		target="_blank">Manage tags</a
	>
</div>

<div class="mx-auto mt-5 flex max-w-3xl px-4">
	<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-accent">Accent:</label>
	<input
		bind:value={doc.info.accent}
		class="rounded border-2 border-rock-300 bg-background p-1"
		id="edit-accent"
		type="color"
	/>
</div>

<div class="mx-auto mt-7 flex max-w-3xl px-4">
	<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-thumbnail"
		>Thumbnail:</label
	>
	<textarea
		class="h-28 grow rounded border-2 border-rock-300 bg-background p-1 font-mono text-rock-600 ring-steel-200 outline-none focus:bg-white focus:ring-4"
		name="edit-thumbnail"
		id="edit-thumbnail"
		bind:value={doc.info.thumbnail}></textarea>
</div>

<div class="mx-auto mt-5 flex max-w-3xl px-4">
	<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-status">Status:</label>
	<select
		class="rounded border-b-2 border-rock-300 bg-background px-4 py-2 font-mono text-lg font-bold text-rock-600 ring-steel-200 focus:ring-4"
		id="edit-status"
		bind:value={doc.info.status}
	>
		<option value="private">Private</option>
		<option value="unlisted">Unlisted</option>
		<option value="public">Public</option>
		<option value="featured">Featured</option>
	</select>
</div>

<div class="my-18 flex flex-col items-center">
	{#if confirmPublish}
		<div class="mb-4 max-w-1/2 rounded bg-yellow-100 p-2 text-lg text-yellow-700">
			Please note; this makes ALL changes made to the document PUBLIC, and that
			<br />THIS ACTION CANNOT BE UNDONE. <br />Click "Publish Changes" again if you wish to
			proceed.
		</div>
	{/if}
	<button
		class="rounded border-2 border-steel-300 bg-steel-50 px-4 py-1 text-xl font-bold text-steel-600 ring-steel-100 hover:bg-white hover:ring-4 active:translate-y-1 active:bg-steel-100 disabled:pointer-events-none disabled:opacity-50"
		type="button"
		onclick={() => (!confirmPublish ? (confirmPublish = true) : publishChanges())}
		disabled={disablePublishBtn}>Publish Changes</button
	>
	{#if publishResp}
		{#await publishResp}
			<div class="text-rock-700 italic">Processing...</div>
		{:then}
			<div class="font-bold text-green-700">Success!</div>
			<!-- {let respText = $state('')}
				{const _ = resp.text().then((text) => (respText = text))}
				<div class="font-bold text-red-700">
					({resp.status}) Something went wrong. Message:<br /><span class="font-normal"
						>{respText}</span
					>
				</div> -->
		{:catch err}
			<div class="font-bold text-red-700">
				Something went wrong. {err instanceof Error && err.message}
			</div>
		{/await}
	{/if}
</div>

<style>
	@reference "./tailwindinit.css";

	:global {
		#edit-tags-doc span.space {
			@apply text-2xl;
		}
		#edit-tags-doc span:not(.space) {
			@apply my-2 block rounded border-2 border-rock-300 bg-background p-0.5;
		}
		#edit-tags-doc span.new {
			@apply border-dashed;
		}
		#edit-tags-doc span.error {
			@apply border-red-300;
		}
		#edit-tags-doc span.error::before {
			@apply absolute inline-block translate-y-[calc(100%+(--spacing(1)))] bg-white font-sans text-sm font-bold text-nowrap text-red-400 not-italic;
			content: var(--errormsg);
		}
		#edit-tags-doc:focus span.focused {
			@apply bg-white ring-4 ring-steel-200;
		}

		/* Make the "placeholder" for when there are no tags (the field is empty) */

		#edit-tags-doc span.error[style*='Missing tag']:only-child {
			@apply opacity-0;
		}
		#edit-tags-doc:has(span.error[style*='Missing tag']:only-child)::before {
			content: 'Tag Guidance Document';
			@apply absolute -z-10 my-2 rounded border-b-2 border-rock-300 bg-background p-0.5 text-nowrap text-rock-600/50;
		}
		#edit-tags-doc:focus::before {
			@apply bg-white! ring-4 ring-steel-200;
		}
		/*#edit-tags span.error:only-child {
      display: none:
    }*/
	}
</style>
