<script lang="ts">
	import { getContext } from 'svelte';
	import WrenchIcon from 'phosphor-svelte/lib/WrenchIcon';

	import ComponentTray from '../components/ComponentTray.svelte';
	import { compPartToInheritedAttrs, mode, savedComponents, selection } from '../store.svelte.js';
	import { changeElToComp, getCompNameAndPart } from '../components/component.svelte.js';
	import type { DocumentEditorProps } from '../App.svelte';
	import type { Component, ComponentWithOptionalEditInfo } from '#lib/types.js';

	const editorState: () => DocumentEditorProps['editorState'] = getContext('editorState');
	const doChangePage: () => DocumentEditorProps['doChangePage'] = getContext('doChangePage');

	function changeToComponent(comp: Component) {
		console.log('Changing to component!', $state.snapshot(comp));

		selection.island.forEach((el, i) => {
			changeElToComp(el, `${comp.name}-[${i + 1}]`);
		});
		mode.sidebar = 'edit';
	}

	// function selectComponentEdit(comp: ComponentWithEditInfo) {
	// 	if (editorState.mode !== 'document') return;
	// 	changePage('component', comp.identName, editorState.resourceName);
	// }
	function selectComponentEdit(comp: ComponentWithOptionalEditInfo) {
		if (editorState().mode !== 'document') return;

		doChangePage()({
			mode: 'component',
			resourceName: comp.identName ?? comp.name,
			documentRedirect: editorState().resourceName
		});
	}

	// TODO: Right now this behaviour is a little bit... not very useful
	//  It would generally be more useful if multi-selects just turned all selected elements
	//  into instances of the same component, rather than turning them into different parts of the one component (which has basically zero use-cases).
	// We could also try allow *all* element-type components, and just display a warning of some kind,
	//  for elements that aren't a perfect fit.

	const filteredCompLib = $derived.by(() => {
		if (mode.sidebar !== 'changetocomponent') return savedComponents;

		const numRequiredSiblings = selection.island.length;
		console.log('🏻', numRequiredSiblings, $state.snapshot(selection.island));
		console.log('🦰', $state.snapshot(compPartToInheritedAttrs));

		const blacklistSet = new Set<string>();

		const allowedCompNames = compPartToInheritedAttrs
			.entries()
			.filter(([dataComponent]) => {
				const [name, part] = getCompNameAndPart(dataComponent);
				const firstPart = Number.parseInt(part.split(',')[0]);

				if (firstPart > numRequiredSiblings) blacklistSet.add(name);

				return firstPart === numRequiredSiblings;
			})
			.map(([dataComponent]) => getCompNameAndPart(dataComponent)[0]);

		const allowedSet = new Set(allowedCompNames);
		console.log(allowedSet, blacklistSet);
		const filteredAllowedSet = allowedSet.difference(blacklistSet);
		console.log(filteredAllowedSet);

		// allowedCompNames.some(() => )

		return savedComponents.filter((comp) => filteredAllowedSet.has(comp.name));
	});
</script>

{#if editorState().mode === 'document' && mode.sidebar === 'changetocomponent' && selection.island.length > 0}
	<div class="mt-3 mb-8 text-center text-xl text-rock-800 italic">
		Change selection to component
	</div>
	<ComponentTray
		comps={filteredCompLib}
		mainAction={changeToComponent}
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
