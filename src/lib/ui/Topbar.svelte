<script lang="ts">
	import { circInOut } from 'svelte/easing';
	import { CompLib, mode, type Doc } from '../store.svelte';

	import ComponentMetaEdit, {
		dClassComponentMetaEdit
	} from '../components/ComponentMetaEdit.svelte';
	import DocMetaEdit, { dClassDocMetaEdit } from './DocMetaEdit.svelte';
	import MediaTray, { dClassMediaTray } from './MediaTray.svelte';

	import TreeView from 'phosphor-svelte/lib/TreeViewIcon';
	import SquaresFour from 'phosphor-svelte/lib/SquaresFourIcon';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import ImagesSquareIcon from 'phosphor-svelte/lib/ImagesSquareIcon';
	import PaintBrushBroadIcon from 'phosphor-svelte/lib/PaintBrushBroadIcon';
	import type { EditorState } from '#lib/App.svelte';
	import { getContext } from 'svelte';
	import type { Comps } from '#lib/components/libraryeditor.svelte.ts';
	// import { comps } from '../components/libraryeditor.svelte';

	const editorState: () => EditorState = getContext('editorState');
	// const doc: Doc = getContext("doc");
	const comps: Comps = getContext('comps');
	const compLib: CompLib = getContext('compLib');

	const dropdownContainerClass = $derived.by(() => {
		switch (mode.dropdown) {
			case 'compmetaedit':
				return dClassComponentMetaEdit;
			case 'docmetaedit':
				return dClassDocMetaEdit;
			case 'mediatray':
				return dClassMediaTray;
			default:
				return '';
		}
	});

	function dropdownExpandTransition(
		node: HTMLElement,
		params: { duration?: number; expandAmount?: number }
	) {
		// The element exists at this time, which is why this works
		const height = node.getBoundingClientRect().height;

		return {
			delay: 0,
			duration: params.duration ?? 150,
			easing: circInOut,
			css: (t: number, u: number) => {
				const startHeight = height - (params.expandAmount ?? 100);
				return `
          height: ${startHeight * u + height * t}px;
          opacity: ${t};
        `;
			}
		};
	}
</script>

<svelte:body
	onclick={(e) => {
		// Note, <svg> is NOT considered a HTMLElement, but is considered an Element
		if (!(e.target instanceof Element && (e.target.closest('.topbar') || !e.target.isConnected)))
			mode.dropdown = 'none';
	}}
/>

<div class="flex border-r-2 border-rock-300 bg-rock-100/70 p-1.5">
	<button
		class="complib-btn relative mr-0.5 flex aspect-square h-full items-center justify-center rounded border-rock-300 text-2xl text-rock-800 hover:bg-rock-200/70 [.active]:border [.active]:bg-background [.active]:hover:bg-rock-200/70"
		aria-label="View component library"
		title="View component library"
		class:active={mode.sidebar === 'viewcomponent'}
		class:warn={compLib.isVersFetched &&
			!compLib.isLibUpToDate &&
			editorState().mode === 'document'}
		onclick={() => {
			if (mode.sidebar === 'viewcomponent') mode.sidebar = 'edit';
			else mode.sidebar = 'viewcomponent';
		}}><SquaresFour /></button
	>
	{#if editorState().mode === 'document' || comps.current?.type === 'element'}
		<button
			class="mr-0.5 flex aspect-square h-full items-center justify-center rounded border-rock-300 text-2xl text-rock-800 hover:bg-rock-200/70 [.active]:border [.active]:bg-background [.active]:hover:bg-rock-200/70"
			aria-label="View node tree"
			title="View node tree"
			class:active={mode.sidebar === 'viewer'}
			onclick={() => {
				if (mode.sidebar === 'viewer') mode.sidebar = 'edit';
				else mode.sidebar = 'viewer';
			}}><TreeView /></button
		>
	{/if}
	{#if editorState().mode === 'document' || comps.current?.type === 'style'}
		<button
			class="flex aspect-square h-full items-center justify-center rounded border-rock-300 text-2xl text-rock-800 hover:bg-rock-200/70 [.active]:border [.active]:bg-background [.active]:hover:bg-rock-200/70"
			aria-label="Edit global styles"
			title="Edit global styles"
			class:active={mode.sidebar.startsWith('styles')}
			onclick={() => {
				if (mode.sidebar.startsWith('styles')) mode.sidebar = 'edit';
				else mode.sidebar = 'styles';
			}}><PaintBrushBroadIcon /></button
		>
	{/if}
</div>

<div class="mr-2 ml-auto flex">
	{#if editorState().mode === 'component'}
		<button
			class="m-1.5 flex aspect-square cursor-pointer items-center justify-center rounded text-3xl text-rock-700 hover:bg-rock-100"
			class:bg-rock-100={mode.dropdown === 'compmetaedit'}
			aria-label="Configure component metadata"
			onclick={() => {
				if (mode.dropdown === 'compmetaedit') mode.dropdown = 'none';
				else mode.dropdown = 'compmetaedit';
			}}><ListIcon /></button
		>
	{:else if editorState().mode === 'document'}
		<button
			class="m-1.5 flex aspect-square cursor-pointer items-center justify-center rounded text-3xl text-rock-700 hover:bg-rock-100"
			class:bg-rock-100={mode.dropdown === 'mediatray'}
			aria-label="Configure component metadata"
			onclick={() => {
				if (mode.dropdown === 'mediatray') mode.dropdown = 'none';
				else mode.dropdown = 'mediatray';
			}}
		>
			<ImagesSquareIcon class={mode.dropdown === 'mediatray' ? 'hidden' : ''} />
			<XIcon class={mode.dropdown === 'mediatray' ? '' : 'hidden'} />
		</button>

		<button
			class="m-1.5 flex aspect-square cursor-pointer items-center justify-center rounded text-3xl text-rock-700 hover:bg-rock-100"
			class:bg-rock-100={mode.dropdown === 'docmetaedit'}
			aria-label="Configure component metadata"
			onclick={() => {
				if (mode.dropdown === 'docmetaedit') mode.dropdown = 'none';
				else mode.dropdown = 'docmetaedit';
			}}
		>
			<ListIcon class={mode.dropdown === 'docmetaedit' ? 'hidden' : ''} />
			<XIcon class={mode.dropdown === 'docmetaedit' ? '' : 'hidden'} />
		</button>
	{/if}
</div>

{#if mode.dropdown !== 'none'}
	<div
		transition:dropdownExpandTransition={{ expandAmount: 500, duration: 100 }}
		class={dropdownContainerClass}
	>
		{#if mode.dropdown === 'docmetaedit'}
			<!-- <div class="h-screen"></div> -->
			<DocMetaEdit />
		{:else if mode.dropdown === 'compmetaedit'}
			<ComponentMetaEdit />
		{:else if mode.dropdown === 'mediatray'}
			<MediaTray />
		{/if}
	</div>
{/if}

<style>
	@reference "./tailwindinit.css";

	.complib-btn.warn::after {
		content: '!';
		@apply absolute -right-0.75 -bottom-0.75 bg-rock-100/70 text-3xl leading-[0.9] font-bold text-yellow-500;
	}
	.complib-btn.warn.active::after {
		@apply bg-background;
	}
	.complib-btn.warn:hover::after {
		@apply bg-rock-200/70;
	}
</style>
