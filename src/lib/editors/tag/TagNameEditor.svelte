<script lang="ts">
	import { onDestroy, getContext } from 'svelte';
	import { on } from 'svelte/events';
	import { watch } from 'runed';

	import { autocompleteSuggestions, selection } from '../../store.svelte.js';
	import { calculateTotalOffset, findNodeFromOffset } from '../css/CSSEditor.svelte';
	import tagAttributes from './../attributes/tag_attributes.json';

	interface Props {
		selected: Element[];
	}
	let { selected }: Props = $props();

	const changeElementInMasks: (oldEl: Element, newEl: Element) => void =
		getContext('changeElementInMasks');

	function allSameName(tags: Element[]): boolean {
		return Boolean(tags.map((el) => el.tagName).reduce((p, c) => (p === c ? c : '')));
	}

	function changeTagNames() {
		const replacements: HTMLElement[] = [];
		for (const target of selected) {
			const replacement = document.createElement(inputValTag);
			// Moves all the children to the new element
			while (target.firstChild) replacement.appendChild(target.firstChild);
			// Copy attributes
			for (let i = target.attributes.length - 1; i >= 0; --i) {
				replacement.attributes.setNamedItem(target.attributes[i].cloneNode() as Attr);
			}

			// Replace with replacement
			target.parentNode?.replaceChild(replacement, target);
			changeElementInMasks(target, replacement);
			replacements.push(replacement);
		}
		selection.selected = replacements;
		$autocompleteSuggestions = [];
	}

	function parseTagStr(str: string) {
		const strLower = str.toLowerCase();
		const strFiltered = strLower.match(/[a-z1-6]/g)?.join('') ?? '';

		tagNameURL = getTagURL(strFiltered);
		// if (tagNameURL && tagName !== strFiltered) {
		//   const replacements: HTMLElement[] = [];
		//   for (const target of selected) {
		//     const replacement = document.createElement(strFiltered);
		//     // Moves all the children to the new element
		//     while (target.firstChild) replacement.appendChild(target.firstChild);
		//     // Copy attributes
		//     for (let i = target.attributes.length - 1; i >= 0; --i) {
		//       replacement.attributes.setNamedItem(
		//         target.attributes[i].cloneNode() as Attr,
		//       );
		//     }

		//     // Replace with replacement
		//     target.parentNode?.replaceChild(replacement, target);
		//     changeElementInMasks(target, replacement);
		//     replacements.push(replacement);
		//   }
		//   $nodesSelection = [];
		//   request2AnimationFrames(() => ($nodesSelection = replacements));
		// }

		return `&#60;<span>${strFiltered}</span>&#62;`;
	}

	let tagEl: HTMLElement | undefined = $state();
	let tagName: string | null = $state(null);
	let tagNameURL: string | null = $state(null);

	let inputVal: string = $state('');
	let inputValTag: string = $derived(inputVal.slice(1, -1));

	let inputValDifferent: boolean = $derived(inputValTag !== tagName);

	watch(
		() => selected,
		() => {
			if (!tagEl || selected.length === 0) return;
			tagName = allSameName(selected) ? selected[0].tagName.toLowerCase() : '';
			tagEl.innerHTML = parseTagStr(tagName ?? '');
			tagNameURL = getTagURL(tagName ?? '');
			inputVal = tagEl.textContent ?? '';
		}
	);

	function getTagURL(tagName: string) {
		return tagAttributes.find((el) => el.tag === tagName)?.url ?? null;
	}

	function onInput(e_: any) {
		const e = e_ as InputEvent;
		if (!tagEl) return;
		const caret = document.getSelection();
		const offset = calculateTotalOffset(tagEl, caret?.focusNode, caret?.focusOffset);
		inputVal = tagEl.textContent ?? '';
		const parsed = parseTagStr(inputVal);
		tagEl.innerHTML = parsed;

		tagNameURL = getTagURL(parsed.slice(11, -12));

		const [node, newOffset] = findNodeFromOffset(tagEl, inputVal.length === 3 ? 2 : offset);
		caret?.setPosition(node, newOffset);
		handleAutocomplete();
	}

	function handleAutocomplete() {
		const caret = getSelection();
		if (!caret || !caret.focusNode) return;
		const node = caret.focusNode;
		if (
			(node instanceof HTMLElement && node.tagName === 'SPAN') ||
			node.parentElement?.tagName === 'SPAN'
		) {
			$autocompleteSuggestions = tagAttributes
				.map(({ tag }) => tag)
				.filter(
					(name) =>
						name.toLowerCase() === name && node.textContent && name.startsWith(node.textContent)
				)
				.toSorted((a, b) => a.length - b.length);
		} else {
			$autocompleteSuggestions = [];
		}
	}

	const off = on(document, 'selectionchange', () => {
		const caret = document.getSelection();
		if (!caret || !tagEl) return;

		const possibilities: [Node | null, number, Node | null, number][] = [
			[caret.anchorNode, caret.anchorOffset, caret.focusNode, caret.focusOffset],
			[caret.focusNode, caret.focusOffset, caret.anchorNode, caret.anchorOffset]
		];

		const mainTextNode = tagEl.childNodes[1].childNodes[0];
		if (!(mainTextNode instanceof Text)) return;
		for (const [anchorNode, anchorOffset, focusNode, focusOffset] of possibilities) {
			if (focusNode && focusNode === tagEl.childNodes[0]) {
				if (anchorNode) caret.setBaseAndExtent(anchorNode, anchorOffset, mainTextNode, 0);
				else caret.setPosition(mainTextNode, 0);
			}
			if (focusNode && focusNode === tagEl.childNodes[2]) {
				if (anchorNode)
					caret.setBaseAndExtent(
						anchorNode,
						anchorOffset,
						mainTextNode,
						(mainTextNode.textContent?.length ?? 1) - 0
					);
				else caret.setPosition(mainTextNode, (mainTextNode.textContent?.length ?? 1) - 0);
			}
		}
	});
	onDestroy(off);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && tagNameURL && inputValDifferent) {
			changeTagNames();
			e.stopPropagation();
			e.preventDefault();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<span
	bind:this={tagEl}
	oninput={onInput}
	onkeydown={onKeydown}
	contenteditable="true"
	class:invalid={!tagNameURL}
	class="tagname-display rounded bg-steel-100 p-2 font-mono text-lg font-bold text-rock-700 ring-steel-300/50 focus:ring-2 focus:outline-none"
	role="textbox"
	spellcheck="false"
	tabindex="0"
>
	&#60;<span>{tagName}</span>&#62;
</span><a
	href={tagNameURL}
	target="_blank"
	class:disabled={!tagNameURL}
	aria-disabled={!tagNameURL}
	class="ml-1 inline-block text-xl text-rock-700 hover:opacity-60 [.disabled]:pointer-events-none [.disabled]:opacity-50"
	tabindex={!tagNameURL ? -1 : 0}
	aria-label="Open MDN link"
>
	<ion-icon name="help-circle-outline"></ion-icon>
</a>
<div class="mt-3">
	<button
		class="-ml-5 cursor-pointer rounded px-2 py-1 text-lg text-rock-600 underline ring-4 ring-rock-600/10 hover:no-underline [.disabled]:cursor-default [.disabled]:no-underline [.disabled]:opacity-50"
		class:disabled={!tagNameURL}
		class:hidden={!inputValDifferent}
		onclick={changeTagNames}>Confirm change</button
	>
</div>

<style>
	:global(.tagname-display.invalid span) {
		/* @apply underline decoration-wavy decoration-red-700; */
		text-decoration: underline wavy #b91c1c;
	}
</style>
