<script lang="ts">
	import { getContext } from 'svelte';
	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
	import ArrowsCounterClockwiseIcon from 'phosphor-svelte/lib/ArrowsCounterClockwiseIcon';

	import ComponentTray from '../components/ComponentTray.svelte';
	import {
		Comps,
		updateCompAdd,
		updateCompRemove,
		updateCompRestore
	} from '../components/libraryeditor.svelte.js';
	import { mode } from '../store.svelte.js';
	import starterSvelteCode from '../svelte/startersvelte.txt?raw';
	import type { DocumentEditorProps } from '../App.svelte';
	import type { Component, ComponentType, ComponentWithOptionalEditInfo } from '#lib/types.js';

	const editorState: () => DocumentEditorProps['editorState'] = getContext('editorState');
	const doChangePage: () => DocumentEditorProps['doChangePage'] = getContext('doChangePage');
	const comps: Comps = getContext('comps');

	function selectComponentEdit(comp: ComponentWithOptionalEditInfo) {
		if (editorState().mode !== 'component') return;
		// changePage('component', comp.identName, editorState.documentRedirect);
		doChangePage()({
			mode: 'component',
			resourceName: comp.identName ?? comp.name,
			documentRedirect: editorState().resourceName
		});
	}

	function handleComponentRemoveOrRestore(comp: ComponentWithOptionalEditInfo) {
		if (comp.state === 'removed') updateCompRestore(comp.identName ?? comp.name);
		else updateCompRemove(comp.identName ?? comp.name, comps);
	}

	function getStarterContent(type: ComponentType, startName: number) {
		switch (type) {
			case 'element':
				return `<div data-component="unnamed-${startName}-[1]">*initial*</div>`;
			case 'style':
				return `/*! COMP-INHERITED unnamed-${startName}-[1]*/em{font-size:0.9em}`;
			case 'svelte':
				return starterSvelteCode;
			default:
				throw new Error(`Passed unrecognised type to getStarterContent(). Got '${type}'`);
		}
	}

	function selectComponentCreate() {
		let startName = 1;
		while (comps.lib.some((comp) => comp.name === `unnamed-${startName}`)) startName++;

		// const edit = updateCompAdd({
		// 	name: `unnamed-${startName}`,
		// 	type: createCompType,
		// 	content: getStarterContent(createCompType, startName),
		// 	parts: '1'
		// });
		let addCompInfo: Component;
		if (createCompType === 'svelte') {
			addCompInfo = {
				name: `unnamed-${startName}`,
				type: createCompType,
				content: getStarterContent(createCompType, startName)
			};
		} else {
			addCompInfo = {
				name: `unnamed-${startName}`,
				type: createCompType,
				content: getStarterContent(createCompType, startName),
				parts: ['1']
			};
		}

		const edit = updateCompAdd(addCompInfo);

		doChangePage()({
			mode: 'component',
			resourceName: edit.identName,
			// documentRedirect: editorState().mode === "document" ? editorState().resourceName : editorState().documentRedirect
			documentRedirect: editorState().documentRedirect
		});
	}

	let createCompType: ComponentType = $state('element');

	// $inspect(comps.lib);
	// $inspect(comps.current);
</script>

{#if editorState().mode === 'component'}
	<div class:hidden={mode.sidebar !== 'viewcomponent'}>
		<ComponentTray
			comps={comps.lib}
			mainAction={selectComponentEdit}
			mainActionTag="a"
			generateHref={(comp) => `/documents/edit/component/${comp.identName}`}
			secondaryAction={handleComponentRemoveOrRestore}
			secondaryActionTag="button"
			secondaryActionLabel="Remove/restore component"
		>
			{#snippet secondaryActionContent(comp)}
				{#if comp.state === 'removed'}
					<ArrowsCounterClockwiseIcon />
				{:else}
					<TrashIcon />
				{/if}
			{/snippet}
		</ComponentTray>
	</div>
{/if}

<div
	class="mt-4 flex flex-col items-center justify-center gap-2 p-2"
	class:hidden={!mode.sidebar.includes('component') || editorState().mode !== 'component'}
>
	<button
		class="rounded border-2 border-steel-300 bg-steel-100 px-3 py-1.5 font-mono text-lg font-bold text-steel-600 shadow-2xs inset-shadow-xs inset-shadow-rock-500 transition-[padding,box-shadow] hover:px-3.5 hover:shadow-md hover:inset-shadow-2xs hover:inset-shadow-steel-100 hover:active:translate-y-1 hover:active:bg-steel-200 hover:active:text-steel-700"
		onclick={selectComponentCreate}>New component</button
	>
	<div
		class="font-mono text-sm tracking-tight text-rock-600 italic"
		style="word-spacing: -0.125rem;"
	>
		Component type to create:
		<select
			class="cursor-pointer border border-transparent p-1 text-base text-rock-700 not-italic hover:text-rock-600 focus:outline-none focus-visible:border-rock-400"
			bind:value={createCompType}
		>
			<option value="element">element</option>
			<option value="style">style</option>
			<option value="colour">colour</option>
			<option value="svelte">svelte</option>
		</select>
	</div>
</div>
