<script lang="ts">
	import ComponentTray from '../components/ComponentTray.svelte';

	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
	import ArrowsCounterClockwiseIcon from 'phosphor-svelte/lib/ArrowsCounterClockwiseIcon';
	import {
		comps,
		updateCompAdd,
		updateCompRemove,
		updateCompRestore
	} from '../components/libraryeditor.svelte';
	import { mode, type SavedComponent, type SavedComponentWithEdit } from '../store.svelte';
	import { changePage, editorState } from '../url.svelte';
	import type { CompTypeStr } from '../components/component.svelte';
	import starterSvelteCode from '../svelte/startersvelte.txt?raw';

	function selectComponentEdit(comp: SavedComponent) {
		if (editorState.mode !== 'component') return;
		changePage('component', comp.identName, editorState.documentRedirect);
	}

	function handleComponentRemoveOrRestore(comp: SavedComponentWithEdit) {
		if (comp.state === 'removed') updateCompRestore(comp.identName);
		else updateCompRemove(comp.identName);
	}

	function getStarterContent(type: CompTypeStr, startName: number) {
		switch (type) {
			case 'element':
				return `<div data-component="unnamed-${startName}-[1]">*initial*</div>`;
			case 'style':
				return `/*! COMP-INHERITED unnamed-${startName}-[1]*/em{font-size:0.9em}`;
			case 'svelte':
				return starterSvelteCode;
		}
	}

	function selectComponentCreate() {
		let startName = 1;
		while (comps.lib.some((comp) => comp.name === `unnamed-${startName}`)) startName++;

		const edit = updateCompAdd({
			name: `unnamed-${startName}`,
			type: createCompType,
			content: getStarterContent(createCompType, startName),
			parts: '1'
		});
		changePage(
			'component',
			edit.identName,
			editorState.mode === 'document' ? editorState.resourceName : editorState.documentRedirect
		);
	}

	let createCompType: CompTypeStr = $state('element');

	// $inspect(comps.lib);
	// $inspect(comps.current);
</script>

{#if editorState.mode === 'component'}
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
	class:hidden={!mode.sidebar.includes('component') || editorState.mode !== 'component'}
>
	<button
		class="border-steel-300 bg-steel-100 text-steel-600 inset-shadow-rock-500 hover:inset-shadow-steel-100 hover:active:bg-steel-200 hover:active:text-steel-700 rounded border-2 px-3 py-1.5 font-mono text-lg font-bold shadow-2xs inset-shadow-xs transition-[padding,box-shadow] hover:px-3.5 hover:shadow-md hover:inset-shadow-2xs hover:active:translate-y-1"
		onclick={selectComponentCreate}>New component</button
	>
	<div
		class="text-rock-600 font-mono text-sm tracking-tight italic"
		style="word-spacing: -0.125rem;"
	>
		Component type to create:
		<select
			class="text-rock-700 hover:text-rock-600 focus-visible:border-rock-400 cursor-pointer border border-transparent p-1 text-base not-italic focus:outline-none"
			bind:value={createCompType}
		>
			<option value="element">element</option>
			<option value="style">style</option>
			<option value="colour">colour</option>
			<option value="svelte">svelte</option>
		</select>
	</div>
</div>
