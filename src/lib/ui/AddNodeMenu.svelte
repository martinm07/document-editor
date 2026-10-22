<script lang="ts">
	import ComponentTray from '../components/ComponentTray.svelte';

	import WrenchIcon from 'phosphor-svelte/lib/WrenchIcon';
	import {
		mode,
		savedComponents,
		selection,
		type SavedComponent,
		type SavedComponentWithEdit
	} from '../store.svelte';
	import { changePage, editorState } from '../url.svelte';
	import { watch } from 'runed';
	import { getContext } from 'svelte';
	import { addCompLibVerAttrs, decodeElComponentStr } from '../components/component.svelte';

	const removeFromSelection: (nodes?: Node[] | Node) => void = getContext('removeFromSelection');
	const setSelection: (nodes?: Node[] | Node) => void = getContext('setSelection');

	function addComponent(comp: SavedComponent) {
		if (editorState.mode !== 'document') return;

		if (comp.type === 'element') {
			const componentFrag = decodeElComponentStr(comp.content, 'document');
			addCompLibVerAttrs(componentFrag);
			const topLevel = Array(...componentFrag.childNodes);

			selection.selected[0].replaceWith(componentFrag);
			setSelection(topLevel);
			mode.sidebar = 'edit';
		} else if (comp.type === 'svelte') {
			// localName is the tagName, but already lowercased
			const sourceEl = document.createElement(selection.selected[0].localName);
			sourceEl.setAttribute('data-sveltecomp-source', '');
			sourceEl.setAttribute('data-sveltecomp-compname', comp.name);
			sourceEl.style.setProperty('--markertext', `"Mounted ${comp.name}"`);

			const codeEl = document.createElement('pre');
			codeEl.setAttribute('data-sveltecomp-code', '');
			codeEl.textContent = comp.content;

			sourceEl.appendChild(codeEl);
			selection.selected[0].replaceWith(sourceEl);

			mode.sidebar = 'edit';
		}
	}

	function selectComponentEdit(comp: SavedComponentWithEdit) {
		if (editorState.mode !== 'document') return;
		changePage('component', comp.identName, editorState.resourceName);
	}

	// When the selection changes while we are adding a new node,
	//  OR when the sidebar mode changes (without the temp-added being replaced as
	//   happens when actually clicking "Create Empty Node" or clicking a component).
	//  cancel the adding of that node
	watch([() => selection.selected, () => mode.sidebar], (_, [prevSelection, prevSidebar]) => {
		if (
			prevSidebar === 'addcomponent' &&
			prevSelection // &&
			// selection.length !== 1
		) {
			console.log('Now removing temp added node');
			prevSelection.forEach((el) => {
				if (el.classList.contains('temp-added')) {
					el.remove();
					removeFromSelection(el);
				}
			});
			// removeFromSelection(prevSelection);
			requestAnimationFrame(() => (mode.sidebar = 'edit'));
		}
	});
</script>

{#if editorState.mode === 'document' && mode.sidebar === 'addcomponent'}
	<div class="mt-3 mb-8 text-center">
		{let createEmptyBtnFocused = $state(false)}
		<button
			type="button"
			class="create-empty-node border-rock-400 text-rock-600 bg-rock-100 hover:bg-rock-200 ring-rock-200 relative rounded border-2 px-3 py-2 text-lg shadow-inner shadow-white focus:ring-4 focus:outline-none"
			onclick={() => {
				// There should only be one selected element, nonetheless we use forEach for reliability's sake
				selection.main.forEach((el) => {
					el.classList.remove('temp-added');
					el.removeAttribute('class');
				});

				mode.sidebar = 'edit';
			}}
			onfocusin={() => (createEmptyBtnFocused = true)}
			onfocusout={() => (createEmptyBtnFocused = false)}
			>Create Empty Node
			<span
				class="text-rock-400 absolute right-0 bottom-0 translate-y-full text-sm italic"
				class:hidden={!createEmptyBtnFocused}>(press enter)</span
			></button
		>
	</div>

	<ComponentTray
		comps={savedComponents.filter((comp) => comp.type === 'element' || comp.type === 'svelte')}
		mainAction={addComponent}
		mainActionTag="button"
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
