<script lang="ts">
	import Fuse, { type FuseResult } from 'fuse.js';
	import { type Snippet } from 'svelte';
	import { watch } from 'runed';
	import type { ComponentWithOptionalEditInfo } from '#lib/types.js';

	interface Props {
		mainAction?: (comp: ComponentWithOptionalEditInfo) => void;
		mainActionTag: 'a' | 'button' | 'none';

		secondaryAction?: (comp: ComponentWithOptionalEditInfo) => void;
		secondaryActionTag: 'a' | 'button' | 'none';
		secondaryActionContent?: Snippet<[comp: ComponentWithOptionalEditInfo]>;
		secondaryActionLabel?: string;

		generateHref?: (comp: ComponentWithOptionalEditInfo) => string;

		comps: ComponentWithOptionalEditInfo[];
	}

	let {
		mainAction,
		mainActionTag,

		secondaryAction,
		secondaryActionTag,
		secondaryActionContent,
		secondaryActionLabel,

		generateHref,

		comps
	}: Props = $props();

	const fuse = new Fuse<ComponentWithOptionalEditInfo>([], {
		ignoreLocation: true,
		ignoreFieldNorm: false,
		includeMatches: true,
		// useExtendedSearch: true,
		keys: [
			{
				name: 'name',
				weight: 0.475
			},
			{
				name: 'description',
				getFn: (comp) => comp.description ?? '',
				weight: 0.475
			},
			{
				name: 'tags',
				getFn: (comp) => comp.tags ?? '',
				weight: 0.05
			}
		]
	});

	watch(
		() => $state.snapshot(comps),
		(compsSnapshot) => {
			fuse.setCollection(compsSnapshot);
			updateSearchResults();
		}
	);

	interface ParseQueryResult {
		originalQuery: string;
		strippedQuery: string;
		tagFilters: string[];
		exactPhrases: string[];
	}
	function parseQuery(query: string): ParseQueryResult {
		const tagFilters: string[] = [];
		const exactPhrases: string[] = [];

		const extractTagsRegex = /\[(.+?)\]/g;
		const spliceTagInfo: { index: number; length: number }[] = [];

		query.matchAll(extractTagsRegex).forEach((match) => {
			const tag = match[1];
			tagFilters.push(tag);
			spliceTagInfo.push({
				index: match.index,
				length: match[0].length
			});
		});

		let queryWithoutTags = query;
		spliceTagInfo.sort((a, b) => b.index - a.index);
		spliceTagInfo.forEach(
			({ index, length }) =>
				(queryWithoutTags =
					queryWithoutTags.slice(0, index) + queryWithoutTags.slice(index + length))
		);

		const extractExactPhrasesRegex = /"(.+?)"/g;
		const transformPhrasesInfo: {
			index: number;
			length: number;
			value: string;
		}[] = [];

		queryWithoutTags.matchAll(extractExactPhrasesRegex).forEach((match) => {
			const exactPhrase = match[1];
			exactPhrases.push(exactPhrase);
			transformPhrasesInfo.push({
				index: match.index,
				length: match[0].length,
				value: exactPhrase
			});
		});

		let finalQuery = queryWithoutTags;
		transformPhrasesInfo.sort((a, b) => b.index - a.index);
		transformPhrasesInfo.forEach(
			({ index, length, value }) =>
				(finalQuery = finalQuery.slice(0, index) + value + finalQuery.slice(index + length))
		);

		return {
			originalQuery: query,
			strippedQuery: finalQuery,
			tagFilters,
			exactPhrases
		};
	}

	let query = $state('');

	let searchResults: ComponentWithOptionalEditInfo[] = $state([]);

	const sortedSearchResults = $derived(
		searchResults.toSorted((a, b) => {
			const toNum = (state: typeof a.state) => {
				if (state === 'added') return -3;
				if (state === 'removed') return -2;
				if (state === 'modified') return -1;
				else return 0;
			};
			return toNum(a.state) - toNum(b.state);
		})
	);

	// $inspect(sortedSearchResults);

	/**
	 * Uses `query`, parses it using `parseQuery`, uses the result in `fuse.search`,
	 * and then splices searchResults with the new results
	 * (filtering results to those that have the tags and exact phrases found in the query syntax, and adding HTML <mark> elements to the values in the resulting `comp.name`, `comp.description` and `comp.tags` fields).
	 */
	function updateSearchResults() {
		if (!query) {
			searchResults = comps;
			return;
		}

		const { strippedQuery, tagFilters, exactPhrases } = parseQuery(query);
		const results = fuse.search(strippedQuery);

		searchResults = [];
		for (const result of results) {
			if (!componentHasTags(result.item, tagFilters)) continue;
			if (!componentHasPhrases(result.item, exactPhrases)) continue;

			const markedComp = addMarksToComponent(result.item, result.matches);
			searchResults.push(markedComp);
		}
	}

	function componentHasTags(comp: ComponentWithOptionalEditInfo, tags: string[]) {
		const compTags = comp.tags ?? [];
		return tags.every((tag) => compTags.includes(tag));
	}

	function componentHasPhrases(comp: ComponentWithOptionalEditInfo, exactPhrases: string[]) {
		return exactPhrases.every(
			(phrase) =>
				comp.name.includes(phrase) ||
				comp.description?.includes(phrase) ||
				comp.tags?.includes(phrase)
		);
	}

	function addMarksToComponent(
		comp: ComponentWithOptionalEditInfo,
		matches: FuseResult<ComponentWithOptionalEditInfo>['matches']
	): ComponentWithOptionalEditInfo {
		// `matches` is an array of objects, where each object specifies a different key
		// for the comp item, and has an array `indices` where each item is a 2-tuple of numbers,
		// giving the start and end characters for the match.

		// prettier-ignore
		const markedComp = structuredClone(comp) as unknown as { [key: string]: string; };

		for (const keyMatches of matches ?? []) {
			if (!keyMatches.key || !keyMatches.value) {
				console.error(
					"Fuse.js match object didn't have a 'key' and/or 'value' field.",
					keyMatches,
					matches
				);
				continue;
			}

			const oldValue = keyMatches.value;
			let newValue = oldValue;

			const sortedIndices = keyMatches.indices.toSorted(([aIndex], [bIndex]) => bIndex - aIndex);
			sortedIndices.forEach(([startIndex, endIndex]) => {
				const insertValue = '<mark>' + oldValue.slice(startIndex, endIndex + 1) + '</mark>';
				newValue = newValue.slice(0, startIndex) + insertValue + newValue.slice(endIndex + 1);
			});

			markedComp[keyMatches.key] = newValue;
		}

		return markedComp as unknown as ComponentWithOptionalEditInfo;
	}

	//////////////

	let searchBoxFocused = $state(false);

	let activeResultI = $state(-1);
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		let selectedCompI: number;
		if (searchBoxFocused && activeResultI > -1) selectedCompI = activeResultI;
		else if (e.submitter?.dataset?.i !== undefined)
			selectedCompI = Number.parseInt(e.submitter.dataset.i);
		else {
			console.error('Could not determine selected component.');
			return;
		}

		const selectedComp = sortedSearchResults[selectedCompI];
		mainAction?.(selectedComp);
	}}
>
	<div class="sticky top-4 z-20 my-2">
		<input
			type="text"
			placeholder="search"
			bind:value={query}
			class="w-full rounded border-2 border-rock-600 bg-rock-50 px-2 py-1 font-mono text-rock-700 ring-rock-200 placeholder:italic focus:ring-4 focus:outline-none"
			oninput={() => updateSearchResults()}
			onfocusin={() => {
				searchBoxFocused = true;
				activeResultI = 0;
			}}
			onfocusout={() => {
				searchBoxFocused = false;
				activeResultI = -1;
			}}
			onkeydown={(e) => {
				if (e.key === 'ArrowUp') {
					activeResultI = Math.max(activeResultI - 1, 0);
					e.preventDefault();
				} else if (e.key === 'ArrowDown') {
					activeResultI = Math.min(activeResultI + 1, sortedSearchResults.length - 1);
					e.preventDefault();
				} else if (e.key === 'Escape' && e.target instanceof HTMLInputElement) {
					e.target.blur();
					e.stopPropagation();
				}
			}}
		/>
		<!-- Helper box showing the syntax for search queries (when the search box is empty) -->
		<div
			class="pointer-events-none absolute flex w-full items-center justify-center rounded-t rounded-b-lg border-2 border-t-0 border-rock-400 bg-background py-1"
			class:hidden={!searchBoxFocused || query}
		>
			<div class="inline-block text-rock-700">
				<span class="my-0.5 inline-block"
					><span class="mr-1 inline-block font-mono">[tag]</span><span class="text-rock-500"
						>search within tag</span
					></span
				><br />
				<span class="my-0.5 inline-block"
					><span class="mr-1 inline-block font-mono">"words here"</span><span class="text-rock-500"
						>exact phrase</span
					></span
				>
			</div>
		</div>
	</div>

	{#each sortedSearchResults as comp, i}
		{let state = $derived(comp.state ?? 'normal')}
		{let active = $derived(i === activeResultI)}

		{const prevState = $derived(sortedSearchResults[i - 1]?.state)}
		{#if comp.state && comp.state !== prevState}
			<!-- (this is purely for the component library editor) Insert a divider/header that gives the states of the following component results. -->
			<div class="sec-title relative mx-1 flex items-center justify-center text-lg font-bold">
				<div class="absolute h-0.5 w-full bg-rock-200"></div>
				<span class="z-10 inline-block bg-background text-rock-600 uppercase">{comp.state}</span>
			</div>
		{/if}

		<!-- Container for component display result -->
		<div
			class="component-search-result relative my-1 flex scroll-mt-16 scroll-mb-4 rounded-lg p-1 text-rock-700 focus-within:bg-rock-100 hover:bg-rock-100 has-[.secondary-btn:hover]:bg-background! [.active]:bg-rock-100"
			class:active
		>
			<!-- Main information on component (name, description, tags) -->
			<div class="relative w-full" class:line-through={state === 'removed'}>
				<!-- Name is our main interactible element, we use a ::before style so that hovering
             anywhere over the display result hovers the title. -->
				{#if mainActionTag === 'a'}
					<a
						href={generateHref?.(comp)}
						class="breakout-interactible static font-mono"
						onclick={(e) => {
							// FUN FACT: the "onclick" event handler fires even when the anchor tag is interacted with via keyboard (e.g. pressing Enter) or other ways! Intercepting the click event is hence the "idiomatic" way of intercepting anchor tag navigation for SPAs.

							e.preventDefault();
							mainAction?.(comp);
						}}
						>{@html comp.name}
						<span class="font-mono text-xs tracking-tighter text-rock-600">({comp.type}-type)</span
						></a
					>
				{:else if mainActionTag === 'button'}
					<button class="breakout-interactible static font-mono" type="submit" data-i={i}
						>{@html comp.name}
						<span class="font-mono text-xs tracking-tighter text-rock-600">({comp.type}-type)</span
						></button
					>
				{:else}
					<div class="static font-mono">
						{@html comp.name}
						<span class="font-mono text-xs tracking-tighter text-rock-600">({comp.type}-type)</span>
					</div>
				{/if}

				<div class="text-sm text-rock-600">{@html comp.description ?? ''}</div>
				<div class="mt-1 w-full text-sm">
					{#each comp.tags ?? [] as tag}
						<span class="m-0.5 inline-block rounded border border-steel-200 bg-steel-100 px-0.5"
							>{@html tag}</span
						>
					{/each}
				</div>
			</div>
			<!-- Secondary action (to the side of the main information) -->
			{#if secondaryActionTag === 'a' && secondaryActionContent}
				<div class="z-10 flex items-center justify-center">
					<a
						aria-label={secondaryActionLabel}
						href={generateHref?.(comp)}
						class="secondary-btn rounded-lg p-1 py-2 text-lg hover:bg-rock-100 focus:bg-rock-100 [.disabled]:hidden"
						onclick={(e) => {
							e.preventDefault();
							secondaryAction?.(comp);
						}}>{@render secondaryActionContent(comp)}</a
					>
				</div>
			{:else if secondaryActionTag === 'button' && secondaryActionContent}
				<div class="z-10 flex items-center justify-center">
					<button
						aria-label={secondaryActionLabel}
						class="secondary-btn rounded-lg p-1 py-2 text-lg hover:bg-rock-100 focus:bg-rock-100 [.disabled]:hidden"
						type="button"
						onclick={(e) => {
							e.preventDefault();
							secondaryAction?.(comp);
						}}>{@render secondaryActionContent(comp)}</button
					>
				</div>
			{/if}
		</div>
		<div class="h-0.5 bg-rock-200 last-of-type:h-0 has-[+_.sec-title]:h-0"></div>
	{/each}
</form>

<style>
	.breakout-interactible,
	.breakout-interactible::before {
		cursor: pointer;
	}

	.breakout-interactible::before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	:global(.component-search-result mark) {
		background-color: var(--steel-100);
		color: inherit;
	}
	:global(
		.component-search-result.active mark,
		.component-search-result:focus mark,
		.component-search-result:hover mark,
		.component-search-result span mark
	) {
		background-color: var(--steel-200);
	}
</style>
