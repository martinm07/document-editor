<script module lang="ts">
	export const dClassDocMetaEdit =
		'absolute w-[96%] left-[2%] h-[calc(100vh-4rem)] bg-white z-10 top-12 border-2 border-t-0 rounded-b-lg border-rock-300 overflow-y-scroll shadow-[0_30px_5px_20px_var(--background-50)]'; //t
</script>

<script lang="ts">
	import { getContext } from 'svelte';

	import { type Doc } from '../store.svelte.js';
	import { DynamicStylesheet } from '../helper.js';
	import { createPublishDoc } from '../documents/docsaving.svelte.js';
	import { generateRuleString } from '../documents/DocStyles.svelte';
	import type { SvelteCompiler } from '../svelte/compiler.js';
	import type { DocumentEditorProps } from '../App.svelte';

	const doc: Doc = getContext('doc');
	const getDocEl: () => HTMLElement = getContext('getDocEl');
	const metaInputFields: () => DocumentEditorProps['metaInputFields'] =
		getContext('metaInputFields');

	const doPublish: () => DocumentEditorProps['doPublish'] = getContext('doPublish');
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

	let confirmPublish = $state(false);
	let publishResp: Promise<void> | null = $state(null);
	let disablePublishBtn = $state(false);
</script>

<div class="my-4 text-center text-xl text-rock-800 italic">View/Edit the document's metadata</div>

{#each Object.entries(metaInputFields()) as [propName, propSnippet]}
	{@render propSnippet(
		() => doc.info[propName],
		(val) => {
			doc.info[propName] = val;
		}
	)}
{/each}

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
