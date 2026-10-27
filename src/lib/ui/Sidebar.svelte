<script lang="ts">
	import { getContext } from 'svelte';
	import { watch } from 'runed';
	import UpdateDocLib from '../components/UpdateDocLib.svelte';
	import ArrowArcLeftIcon from 'phosphor-svelte/lib/ArrowArcLeftIcon';
	import HouseIcon from 'phosphor-svelte/lib/HouseIcon';

	import AttributesEditor, {
		type Attribute,
		type IAttributesEditor
	} from '../editors/attributes/AttributesEditor.svelte';
	import AllStyleEditors, { type IAllStyleEditors } from '../editors/css/AllStyleEditors.svelte';
	import TagNameEditor from '../editors/tag/TagNameEditor.svelte';
	import { selection, mode, type Doc, CompLib } from '../store.svelte.js';
	import { deepEqual } from '../helper';
	import ComponentInfo from '../components/ComponentInfo.svelte';
	import LibraryEditorViewComponents from './LibraryEditorViewComponents.svelte';
	import AddNodeMenu from './AddNodeMenu.svelte';
	import DocumentViewComponents from './DocumentViewComponents.svelte';
	import ChangeToComponent from './ChangeToComponent.svelte';
	import StylesEditor from '../editors/styles/StylesEditor.svelte';
	import SvelteEditor from '../svelte/SvelteEditor.svelte';
	import SvelteComponentInfo from '../svelte/SvelteComponentInfo.svelte';
	import type { DocumentEditorProps } from '../App.svelte';
	import type { Comps } from '#lib/components/libraryeditor.svelte.ts';

	const doc: Doc = getContext('doc');
	const comps: Comps = getContext('comps');
	const compLib: CompLib = getContext('compLib');
	const editorState: () => DocumentEditorProps['editorState'] = getContext('editorState');
	const doChangePage: () => DocumentEditorProps['doChangePage'] = getContext('doChangePage');

	const updateHighlight: () => void = getContext('updateHighlight');

	interface Props {
		attributesEditor?: IAttributesEditor;
		cssEditor?: IAllStyleEditors;
	}

	let { attributesEditor = $bindable(), cssEditor = $bindable() }: Props = $props();

	let selectionHasComponents = $derived.by(() => {
		currentAttrs.length;
		return (
			editorState().mode === 'document' &&
			selection.main.some((el) => el.getAttribute('data-component'))
		);
	});

	watch(
		() => selection.main,
		() => {
			// It seems that we have to wait for the DOM to update with the new "highlight" elements
			//  before trying to update the highlight, hence the animation frame callback.
			requestAnimationFrame(updateHighlight);
		}
	);

	let currentAttrs: Attribute[] = $state([]);
	// $inspect(editorAttrs);
	// watch(
	//   () => $state.snapshot(editorAttrs),
	//   (curr, prev) => {
	//     if (!deepEqual(curr, prev) && curr.length > 0)
	//       console.log(
	//         curr.map((attr) => attr.name),
	//         curr,
	//       );
	//   },
	// );

	const elementEditMode = $derived(mode.sidebar === 'edit' && comps.current?.type !== 'svelte');
	const svelteEditMode = $derived(mode.sidebar === 'edit' && comps.current?.type === 'svelte');
</script>

{#if editorState().documentRedirect && mode.sidebar === 'edit'}
	<button
		aria-label="Return to document"
		class="absolute top-2 left-2 z-10 aspect-square rounded-lg border-2 border-rock-100 bg-background p-2 text-2xl text-rock-600 hover:bg-rock-100 hover:active:translate-y-1 hover:active:border-rock-200 hover:active:bg-rock-200 hover:active:text-rock-700"
		onclick={() => {
			const returnPage = editorState().documentRedirect;
			if (!returnPage) return;
			doChangePage()({
				mode: editorState().mode === 'component' ? 'document' : 'component',
				resourceName: returnPage,
				documentRedirect: null
			});
		}}
	>
		<ArrowArcLeftIcon weight="bold" />
	</button>
{:else if mode.sidebar === 'edit'}
	<a
		aria-label="Go to documents admin view"
		class="absolute top-2 left-2 z-10 aspect-square rounded-lg border-2 border-rock-100 bg-background p-2 text-2xl text-rock-600 hover:bg-rock-100 hover:active:translate-y-1 hover:active:border-rock-200 hover:active:bg-rock-200 hover:active:text-rock-700"
		href="/documents/admin"
	>
		<HouseIcon weight="bold" />
	</a>
{/if}

<!-- SIDEBAR MODE: edit (for element editing) -->

<div class="text-center" class:hidden={!elementEditMode}>
	<ComponentInfo {currentAttrs} />
	<SvelteComponentInfo {currentAttrs} />
</div>
<div
	class:hidden={!elementEditMode || selection.main.length === 0 || selectionHasComponents}
	class="text-center"
>
	<TagNameEditor selected={selection.main} />
</div>
<div
	class:hidden={!elementEditMode || selection.main.length === 0}
	class="mt-8 h-fit w-full p-2 text-center"
>
	<AllStyleEditors {currentAttrs} bind:this={cssEditor} />
</div>
<div class:hidden={!elementEditMode || selection.main.length === 0}>
	<AttributesEditor selected={selection.main} bind:this={attributesEditor} bind:currentAttrs />
</div>

<!-- SIDEBAR MODE: edit (for Svelte code editing) -->
<div class:hidden={!svelteEditMode} class="flex w-full">
	<SvelteEditor bind:value={doc.body} />
</div>

<!-- SIDEBAR MODE: component -->

{#if mode.inCompLibUpgrade || (compLib.isVersFetched && !compLib.isLibUpToDate)}
	<UpdateDocLib />
{/if}

<LibraryEditorViewComponents />
<DocumentViewComponents />

<AddNodeMenu />
<ChangeToComponent />

<!-- SIDEBAR MODE: viewer -->
<div class:hidden={mode.sidebar !== 'viewer'}>
	TODO: The document DOM viewer (/headings viewer for easier navigation?)
</div>

<!-- SIDEBAR MODE: styles -->
<div class:hidden={!mode.sidebar.startsWith('styles')}>
	<StylesEditor />
</div>
