<script lang="ts">
	import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
	import ArrowBendUpLeftIcon from 'phosphor-svelte/lib/ArrowBendUpLeftIcon';

	import FitContentInput from '../../ui/FitContentInput.svelte';
	import MDNPseudoLinks from './mdn_pseudo_links.json';
	import { selection } from '../../store.svelte.js';

	function addPseudoClass(e: SubmitEvent) {
		e.preventDefault();
		if (!valid) return;
		selection.main.forEach((el) => {
			console.log('ADDING PSEUDO-CLASS DATA ATTRIBUTE FOR ELEMENT', el, value);
			el.setAttribute(`data-style-${value}`, '');
		});
		value = '';
		onGoBack?.();
	}

	interface Props {
		extraValidation?: (value: string) => boolean;
		onGoBack?: () => void;
	}
	let { extraValidation, onGoBack }: Props = $props();

	let value: string = $state('');

	let helpLink = $derived.by(() => {
		if (value === '') return MDNPseudoLinks.find((item) => item.name === '__default__')?.url;
		return MDNPseudoLinks.find((item) => item.name === value)?.url;
	});

	let valid = $derived.by(() => {
		const isRealPseudoClass = MDNPseudoLinks.some((item) => item.name === value);
		const isExtraValid = extraValidation?.(value) ?? true;
		return isRealPseudoClass && isExtraValid;
	});

	// TODO: Autocomplete
</script>

<form class="mt-3 flex items-stretch justify-center" onsubmit={(e) => addPseudoClass(e)}>
	{#if onGoBack}
		<button
			type="button"
			class="m-0.5 mr-2 rounded border-2 border-rock-300 bg-rock-50 px-0.5 text-xl text-rock-600 hover:bg-rock-100 active:translate-y-1 active:bg-rock-200"
			onclick={() => onGoBack()}><ArrowBendUpLeftIcon /></button
		>
	{/if}
	<button
		type="submit"
		class="m-0.5 mr-2 rounded border-2 border-rock-300 bg-rock-50 px-0.5 text-xl text-rock-600 hover:bg-rock-100 active:translate-y-1 active:bg-rock-200 disabled:pointer-events-none disabled:opacity-50"
		disabled={!valid}><PlusIcon /></button
	>

	<FitContentInput
		type="text"
		class="box-content rounded bg-steel-100 px-1.5 py-1 font-mono font-bold text-rock-700 decoration-2 focus:outline-none aria-invalid:underline aria-invalid:decoration-red-600 aria-invalid:decoration-dotted"
		placeholder="pseudoclass"
		aria-invalid={!valid && value !== ''}
		bind:value
		onkeydown={(e) => {
			if (e.key === 'Escape' && onGoBack) {
				e.stopPropagation();
				onGoBack();
			}
		}}
		{@attach (el) => {
			if (!onGoBack) return;
			el.focus();
		}}
	/>

	<a
		href={helpLink}
		aria-label="Open MDN docs"
		class="ml-1 inline-flex items-center text-xl text-rock-700 hover:opacity-60 [.disabled]:pointer-events-none [.disabled]:opacity-50"
		class:disabled={!helpLink}
		aria-disabled={!helpLink}
		target="_blank"><ion-icon name="help-circle-outline"></ion-icon></a
	>
</form>
