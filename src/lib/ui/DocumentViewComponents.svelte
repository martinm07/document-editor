<script lang="ts">
	import ComponentTray from '../components/ComponentTray.svelte';

	import WrenchIcon from 'phosphor-svelte/lib/WrenchIcon';
	import { mode, savedComponents, type SavedComponentWithEdit } from '../store.svelte';
	import { changePage, editorState } from '../url.svelte';
	import { comps } from '../components/libraryeditor.svelte';

	function selectComponentEdit(comp: SavedComponentWithEdit) {
		if (editorState.mode !== 'document') return;
		changePage('component', comp.identName, editorState.resourceName);
	}
</script>

{#if editorState.mode === 'document' && mode.sidebar === 'viewcomponent'}
	<ComponentTray
		comps={savedComponents}
		mainActionTag="none"
		secondaryAction={selectComponentEdit}
		secondaryActionTag="a"
		generateHref={(comp) => `/documents/edit/component/${comp.identName}`}
		secondaryActionLabel="Edit component"
	>
		{#snippet secondaryActionContent()}
			<WrenchIcon />
		{/snippet}
	</ComponentTray>
{/if}

{#if comps.savedLib.length === 0 && editorState.mode !== 'component' && mode.sidebar.includes('component')}
	<div class="mt-4 text-center text-3xl text-gray-400 italic">
		There appear to be no components in this library, for now.<br />
		<a
			class="text-gray-500 underline hover:no-underline"
			href="/documents/edit/component"
			onclick={(e) => {
				e.preventDefault();
				changePage('component', 'null', editorState.resourceName);
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					changePage('component', 'null', editorState.resourceName);
				}
			}}>Edit component library?</a
		>
	</div>
{/if}
