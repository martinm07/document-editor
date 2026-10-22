<script lang="ts">
	import WarningDiamond from 'phosphor-svelte/lib/WarningDiamondIcon';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowBendUpLeftIcon from 'phosphor-svelte/lib/ArrowBendUpLeftIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import { compLib, doc, mode, savedComponents, type SavedComponent } from '../store.svelte';
	import { changePage, editorState } from '../url.svelte';
	import { getContext, onMount } from 'svelte';
	import {
		componentTypeToString,
		loadComponentLibrary,
		type GetCompLibFetchReturn
	} from './component.svelte';
	import { fetch_ } from '/shared/helper';
	import { upgradeDoc, type CompLibUpgradeInfo } from './libraryupgrade';
	import type { DynamicStylesheet } from '../helper';
	import { watch, watchOnce } from 'runed';

	const getDocEl: () => HTMLElement = getContext('getDocEl');
	const bookmarkState: () => () => void = getContext('bookmarkState');
	const getComponentElStyles: () => DynamicStylesheet<string> = getContext('getComponentElStyles');
	const componentElStyles = getComponentElStyles();

	let isExpanded = $state(false);

	function reduceVerString(fullVer: string, newLen: number = 8) {
		const newVerValChoices = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
		const fullVerVals = fullVer.replace(',', '');
		const spacing = Math.floor(fullVerVals.length / newLen);

		let final = '';
		for (let i = 0; i < newLen; i++) {
			const fullVerPart = fullVerVals.slice(i * spacing, (i + 1) * spacing);
			const num = fullVerPart
				.split('')
				.map((char) => char.charCodeAt(0))
				.reduce((p, c) => p + c, 0);
			const letterChoice = newVerValChoices[num % newVerValChoices.length];
			final += letterChoice;
		}

		return final;
	}

	let upgradeInfo: CompLibUpgradeInfo | null = $derived(compLib.upgradeInfo);

	let submitStatus: 'error' | 'idle' | 'success' | 'none' = $state('none');
	let submitMsg: string = $state('');

	let restoreState: () => void | undefined;
	let oldComponentLibrary: SavedComponent[] | undefined;

	let fetchedCompLibVer = false;
	let oldCompLibVer: string = $state('');
	watch(
		() => doc.info.componentLibVer,
		() => {
			if (fetchedCompLibVer || !doc.info.componentLibVer) return;
			oldCompLibVer = doc.info.componentLibVer;
			fetchedCompLibVer = true;
		}
	);

	async function upgradeLibrarySubmit() {
		if (!upgradeInfo) {
			submitStatus = 'error';
			submitMsg = 'No information about upgrade. Try reloading.';
			return;
		}

		submitStatus = 'idle';
		submitMsg = 'Fetching latest component library...';

		let resp = await fetch_('/documents/api/get_component_library');
		if (!resp.ok) {
			submitStatus = 'error';
			submitMsg = 'Unexpected error while fetching the latest component library. Try again later.';
			return;
		}
		const data: GetCompLibFetchReturn = await resp.json();

		data.library.forEach((comp) => {
			comp.type = componentTypeToString(comp.type);
		});

		if (data.version !== upgradeInfo.to_version) {
			submitStatus = 'error';
			submitMsg = 'Current upgrade information is stale. Please reload the page.';
			return;
		}

		submitMsg = 'Updating document content...';

		mode.disabled = true;
		mode.inCompLibUpgrade = true;
		restoreState = bookmarkState();

		oldCompLibVer = doc.info.componentLibVer;
		oldComponentLibrary = $state.snapshot(savedComponents);

		try {
			doc.info.componentLibVer = upgradeInfo.to_version;

			upgradeDoc(getDocEl(), oldComponentLibrary, data.library, $state.snapshot(upgradeInfo));

			// componentElStyles.clear();
			// data.library.forEach((comp) =>
			//   setComponentStyles(comp, componentElStyles),
			// );
			loadComponentLibrary(data.library, 'document', componentElStyles);
		} catch (err) {
			submitStatus = 'error';
			submitMsg = 'INTERNAL ERROR' + (err instanceof Error ? ': ' + err.message : '');

			mode.disabled = false;
			setTimeout(() => (mode.inCompLibUpgrade = false));
			doc.info.componentLibVer = oldCompLibVer;

			// componentElStyles.clear();
			// savedComponents.forEach((comp) =>
			//   setComponentStyles(comp, componentElStyles),
			// );
			loadComponentLibrary(oldComponentLibrary, 'document', componentElStyles);

			throw err;
		}

		submitMsg = 'Syncing new document library version identifier...';
		submitStatus = 'success';
	}
</script>

<div
	class="rounded border-2 border-yellow-300 bg-yellow-50"
	class:hidden={editorState.mode !== 'document' || !mode.sidebar.includes('component')}
>
	<button
		class="peer group flex w-full items-center justify-around py-1 font-serif text-lg text-yellow-700 hover:cursor-pointer hover:bg-yellow-100"
		onclick={() => (isExpanded = !isExpanded)}
	>
		<WarningDiamond /><span class="underline group-hover:no-underline">Library Outdated</span
		><WarningDiamond />
	</button>
	{#if isExpanded}
		<div class="p-1 text-yellow-900 peer-hover:bg-yellow-100">
			<div class="text-center text-sm text-balance italic">
				<span class="mb-1 inline-block not-italic"
					>This document does not have the latest version of the component library.</span
				><br />
				Components in this document
				<strong>don't have their latest updates</strong>. Choose if you want to
				<strong>apply changes</strong> (described below).
			</div>
			<div class="flex flex-col items-center justify-center py-2">
				<button
					class="rounded-lg border-2 border-yellow-900 px-3 py-1.5 font-mono text-lg transition-colors hover:border-yellow-700 hover:bg-yellow-700 hover:text-yellow-100 disabled:pointer-events-none disabled:opacity-40"
					disabled={submitStatus === 'idle' || submitStatus === 'success'}
					onclick={upgradeLibrarySubmit}
				>
					Upgrade Library
				</button>
				{#if submitStatus === 'idle'}
					<div class="text-rock-500 text-center italic">
						{submitMsg}
					</div>
				{:else if submitStatus === 'error'}
					<div class="text-center text-red-600">
						{submitMsg}
					</div>
				{:else if submitStatus === 'success'}
					<div class="font-bold text-green-700">Upgrade successful!</div>
					<div class="text-green-700 italic">
						Reload the page or click below to confirm the changes.
					</div>
					<div class="mt-2 flex text-xl">
						<button
							class="mx-1 flex items-center rounded border-2 border-yellow-900 bg-yellow-700 px-3 py-1 font-bold text-yellow-100 transition-colors hover:bg-yellow-800 active:translate-y-0.5 active:bg-yellow-900"
							onclick={() => {
								restoreState();
								if (oldComponentLibrary)
									loadComponentLibrary(oldComponentLibrary, 'document', componentElStyles);
								else
									console.error(
										'oldComponentLibrary undefined when restoring document to before library upgrade.'
									);

								submitStatus = 'none';
								submitMsg = '';

								// componentElStyles.clear();
								// savedComponents.forEach((comp) =>
								//   setComponentStyles(comp, componentElStyles),
								// );
							}}><ArrowBendUpLeftIcon class="mr-2" weight="bold" /> Reject</button
						>
						<button
							class="mx-1 flex items-center px-3 py-1 font-bold underline hover:no-underline active:translate-y-0.5 active:text-yellow-900/80"
							onclick={() => window.location.reload()}
							><CheckIcon class="mr-1" weight="bold" /> Accept</button
						>
					</div>
				{/if}
			</div>
			<div class="flex items-center justify-center font-mono italic">
				<div>{reduceVerString(oldCompLibVer)}</div>
				<ArrowRight class="mx-1" />
				<div>{reduceVerString(compLib.latestVer ?? '')}</div>
			</div>
			{#if upgradeInfo}
				<div class="mt-2">
					{#each upgradeInfo.diff_msgs as msg}
						<div class="mb-1">
							<div class="flex items-center px-2">
								<div class="font-mono italic">
									{reduceVerString(msg.version)}
								</div>
								<div class="font-bold">:&nbsp;</div>
								<div class="text-sm">{msg.message}</div>
							</div>
							<div class="pr-2 pl-4 text-sm/tight italic">
								{msg.description}
							</div>
						</div>
					{/each}
				</div>
				<div class="mx-6 my-2 h-px bg-yellow-300"></div>
				<div class="text-center text-lg font-bold text-yellow-800">
					Components that will be affected:
				</div>
				<div class="mb-2 px-3 text-center">
					{#each upgradeInfo.remove_list as name}
						<div class="inline-flex items-center" title="Delete &quot;{name}&quot;">
							<div class="mr-1 font-mono text-lg font-bold text-red-700">D</div>
							<div class="text-red-800 line-through">{name}</div>
						</div>
						<span class="mx-1 inline-block last-of-type:hidden">,&nbsp;</span>
					{/each}
					{#each upgradeInfo.content_list as name}
						<div class="inline-flex items-center" title="Modify content of &quot;{name}&quot;'">
							<div class="mr-1 font-mono text-lg font-bold text-yellow-700">M</div>
							<div>{name}</div>
						</div>
						<span class="mx-1 inline-block last-of-type:hidden">,&nbsp;</span>
					{/each}
					{#each Object.entries(upgradeInfo.name_map) as [oldName, newName]}
						{#if oldName !== newName}
							<div
								class="inline-flex items-center text-green-800"
								title="Rename &quot;{oldName}&quot; to &quot;{newName}&quot;"
							>
								<div class="mr-1 font-mono text-lg font-bold text-green-700">R</div>
								<div>{oldName}</div>
								<ArrowRight class="mx-0.5" />
								<div>{newName}</div>
							</div>
							<span class="mx-1 inline-block last-of-type:hidden">,&nbsp;</span>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
