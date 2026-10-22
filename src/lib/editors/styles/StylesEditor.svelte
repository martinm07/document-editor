<script lang="ts">
	import {
		doc,
		mode,
		savedComponents,
		type DocCSSRule,
		type SavedComponent,
		type SavedComponentWithEdit
	} from '../../store.svelte';
	import CSSEditor, { parseStylesStr } from '../css/CSSEditor.svelte';
	import FitContentInput from '/shared/components/FitContentInput.svelte';
	import { setContext } from 'svelte';
	import { StyleCache } from '../css/AllStyleEditors.svelte';
	import DotsSixVerticalIcon from 'phosphor-svelte/lib/DotsSixVerticalIcon';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import ComponentTray from '../../components/ComponentTray.svelte';
	import { parseStylesheetStr } from '../../documents/DocStyles.svelte';
	import { changePage, editorState } from '../../url.svelte';
	import WrenchIcon from 'phosphor-svelte/lib/WrenchIcon';
	import { getCompNameAndPart } from '../../components/component.svelte';
	import LinkBreakIcon from 'phosphor-svelte/lib/LinkBreakIcon';
	import CaretRightIcon from 'phosphor-svelte/lib/CaretRightIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';

	const styleCache = new StyleCache();
	setContext('styleCache', styleCache);

	let dragSource = $state(-1);
	let draggingRule = false;

	// let addingRule = $state(false);

	function addRuleEmpty() {
		doc.styles.push({
			selector: '',
			declarations: ':;',
			compInheritance: null
		});
		mode.sidebar = 'styles';
	}

	function addRuleComponent(comp: SavedComponent) {
		const parsed = parseStylesheetStr(comp.content);
		console.log('When adding style-type component, parsed:', parsed);

		doc.styles.push(...parsed);
		mode.sidebar = 'styles';
	}

	function selectComponentEdit(comp: SavedComponentWithEdit) {
		if (editorState.mode !== 'document') return;
		changePage('component', comp.identName, editorState.resourceName);
	}

	function breakInheritance(groupI: number) {
		if (!stylesGrouped.at(groupI)) {
			console.error(
				`groupI (${groupI}) not a valid index of stylesGrouped`,
				$state.snapshot(stylesGrouped)
			);
			return;
		}

		console.log('BREAK INHERITANCE');
		const stylesI = stylesGrouped.slice(0, groupI).reduce((p, c) => p + c.styles.length, 0);
		const numInGroup = stylesGrouped[groupI].styles.length;
		for (let i = stylesI; i < stylesI + numInGroup; i++) {
			doc.styles[i].compInheritance = null;
		}
	}

	type GroupedStyles =
		| { isComp: false; styles: DocCSSRule[] }
		| {
				isComp: true;
				compName: string;
				compDesc: string;
				compTags: string[];
				styles: DocCSSRule[];
		  };

	const stylesGrouped: GroupedStyles[] = $derived.by(() => {
		const final: GroupedStyles[] = [];

		// for (const rule of doc.styles) {
		for (let i = 0; i < doc.styles.length; i++) {
			const rule = doc.styles[i];

			if (rule.compInheritance !== null && editorState.mode !== 'component') {
				const [compName] = getCompNameAndPart(rule.compInheritance);
				const prev = final.at(-1);
				if (prev?.isComp && prev?.compName === compName) {
					prev.styles.push(rule);
				} else {
					const compInfo = savedComponents.find((comp) => comp.name === compName);
					let compDesc = '';
					let compTags: string[] = [];
					if (compInfo) {
						compDesc = compInfo.description ?? '';
						compTags = compInfo.tags?.split(',') ?? [];
					} else {
						// prettier-ignore
						console.warn("Wasn't able to find matching component in component library for style-type component", rule, "savedComponents: ", savedComponents);
					}

					final.push({
						isComp: true,
						compName,
						compDesc,
						compTags,
						styles: [rule]
					});
				}
			} else {
				final.push({
					isComp: false,
					styles: [rule]
				});
			}
		}

		return final;
	});

	// $inspect(stylesGrouped);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			e.stopImmediatePropagation();
		}
	}}
/>

{#snippet ruleControls(i: number, numInGroup: number)}
	<button
		class="hover:text-rock-700 move-glyph text-base"
		onmousedown={(e) => {
			if (e.target instanceof Element) {
				e.target.closest('.doccssrule-drag-item')?.setAttribute('draggable', 'true');
			}
		}}
		onmouseup={(e) => {
			if (e.target instanceof Element) {
				e.target.closest('.doccssrule-drag-item')?.setAttribute('draggable', 'false');
			}
		}}><DotsSixVerticalIcon /></button
	><button
		type="button"
		class="inline-flex items-center justify-center text-xl text-red-700 hover:opacity-60"
		onclick={() => {
			const stylesI = stylesGrouped.slice(0, i).reduce((p, c) => p + c.styles.length, 0);
			doc.styles.splice(stylesI, numInGroup);
		}}
		aria-label="Remove attribute"><ion-icon name="close-circle-outline"></ion-icon></button
	>
{/snippet}

{#snippet cssRule(rule: DocCSSRule, i: number, hideControls?: boolean)}
	<div class="relative mb-2 flex max-w-full gap-2 pl-6">
		{#if rule.invalid}
			<div
				class="absolute -ml-2 flex h-full -translate-x-full items-center text-xl text-yellow-600"
				aria-label="Not able to insert rule into stylesheet"
				title="Not able to insert rule into stylesheet"
			>
				<WarningIcon weight="bold" />
			</div>
		{/if}
		<FitContentInput
			type="text"
			class="bg-steel-100 text-steel-800 ring-steel-300/50 box-content rounded px-1.5 py-1 font-mono focus:ring-2 focus:outline-none"
			placeholder="CSS rule selector"
			bind:value={rule.selector}
		/>
		{#if !hideControls}
			{@render ruleControls(i, 1)}
		{/if}
	</div>
	<CSSEditor syncAttrName="style" bind:value={rule.declarations} />
{/snippet}

{#if mode.sidebar === 'styles'}
	<ul>
		{#each stylesGrouped as group, i}
			{const rules = $derived(group.styles)}
			<li
				class="doccssrule-drag-item [.dropzone-active]:bg-rock-100/50 border-steel-300 flex flex-col items-center py-3 [.dropzone-active-down]:border-b-4 [.dropzone-active-up]:border-t-4 [.ghost-item]:opacity-70"
				class:drag-target={dragSource >= 0}
				data-i={i}
				ondragstart={(e) => {
					if (e.target instanceof Element && e.target.classList.contains('doccssrule-drag-item'))
						draggingRule = true;

					e.dataTransfer?.setData('text/plain', `${i},${group.styles.length}`);
					dragSource = i;
				}}
				ondragover={(e) => {
					if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

					if (draggingRule) e.preventDefault();
				}}
				ondragenter={(e) => {
					if (!draggingRule) return;
					// console.log("Entered", e.target);
					if (e.target instanceof Element) {
						const target = e.target.closest('.doccssrule-drag-item');
						if (dragSource !== i) target?.classList.add('dropzone-active');
						if (i < dragSource) target?.classList.add('dropzone-active-up');
						if (i > dragSource) target?.classList.add('dropzone-active-down');
					}
				}}
				ondragleave={(e) => {
					if (!draggingRule) return;
					// console.log("Left", e.target);
					if (e.target instanceof Element) {
						const target = e.target.closest('.doccssrule-drag-item');

						target?.classList.remove('dropzone-active');
						target?.classList.remove('dropzone-active-up');
						target?.classList.remove('dropzone-active-down');
					}
				}}
				ondrop={(e) => {
					e.preventDefault();
					const data = e.dataTransfer?.getData('text/plain');
					if (!data || dragSource < 0) return;

					let oldI, numToMove: number;
					try {
						const splitData = data.split(',');
						oldI = Number.parseInt(splitData[0]);
						numToMove = Number.parseInt(splitData[1]);
					} catch {
						console.warn("Couldn't parse ", data, ' into two integers.');
						return;
					}
					if (isNaN(oldI) || isNaN(numToMove)) {
						console.warn("Couldn't parse ", data, ' into two integers.');
						return;
					}

					if (e.target instanceof Element) {
						const target = e.target.closest('.doccssrule-drag-item');
						target?.classList.remove('dropzone-active');
						target?.classList.remove('dropzone-active-up');
						target?.classList.remove('dropzone-active-down');
					}

					// Perform the actual operation of moving the rule

					// The indexes are for the grouped styles; we want to convert these into raw indexes on doc.styles
					const oldStylesI = stylesGrouped.slice(0, oldI).reduce((p, c) => p + c.styles.length, 0);
					const newStylesI = stylesGrouped.slice(0, i).reduce((p, c) => p + c.styles.length, 0);

					console.log('oldStylesI:', oldStylesI, 'newStylesI:', newStylesI);
					console.log('group.styles:', $state.snapshot(group.styles));
					console.log('numToMove:', $state.snapshot(numToMove));

					// group.styles.length
					const items = doc.styles.splice(oldStylesI, numToMove);
					doc.styles.splice(newStylesI, 0, ...items);
				}}
				ondragend={(e) => {
					dragSource = -1;
					draggingRule = false;
					// This is necessary as it is seems the onmouseup on the handler doesn't tend to work, perhaps due to drag events which are cancelled
					// Luckily, e.target always refers to the top element we're actually dragging (the one with draggable='true'), and not any of its children or anything.
					if (e.target instanceof Element) e.target.setAttribute('draggable', 'false');
				}}
			>
				{#if !group.isComp}
					{#each rules as rule}
						{@render cssRule(rule, i)}
					{/each}
				{:else}
					{let compInheritedInfoOpen = $state(false)}
					<div
						class="text-rock-800 relative mx-auto my-2 inline-flex w-fit items-center gap-2 text-center text-xl"
					>
						<span class="absolute -ml-2 -translate-x-full text-nowrap">
							<button
								class="text-steel-600 hover:bg-steel-100 hover:active:bg-steel-200 hover:active:text-steel-700 flex items-center rounded p-1 text-2xl hover:active:translate-y-0.5"
								title="Break inheritance of element from component"
								aria-label="Break inheritance of element from component"
								onclick={() => breakInheritance(i)}><LinkBreakIcon weight="bold" /></button
							>
						</span>
						<span class="bg-rock-100 rounded px-3 py-1.5" class:hidden={group.compName === null}
							>{group.compName}</span
						>{@render ruleControls(i, group.styles.length)}
					</div>
					<div class="text-rock-700 mb-1 text-lg italic" class:hidden={group.compDesc === null}>
						{group.compDesc}
					</div>
					<div class="text-rock-700 text-lg/9 italic" class:hidden={group.compTags === null}>
						{#each group.compTags as tag}
							<span class="bg-rock-50 border-rock-200 rounded border px-1 py-0.5">{tag}</span>
							&nbsp;
						{/each}
					</div>

					<button
						class="text-rock-700 hover:text-rock-600 mr-auto flex items-center text-lg"
						onclick={() => (compInheritedInfoOpen = !compInheritedInfoOpen)}
					>
						Inherited CSS rules
						{#if compInheritedInfoOpen}
							<CaretDownIcon class="ml-1 inline text-xl" />
						{:else}
							<CaretRightIcon class="ml-1 inline text-xl" />
						{/if}
					</button>

					{#if compInheritedInfoOpen}
						{#each rules as rule}
							{const parsedDeclarationsHTML = $derived(parseStylesStr(rule.declarations)[0])}

							<div class="my-3 flex flex-col items-center gap-1.5">
								<div class="bg-rock-100 text-steel-800 box-content rounded px-1.5 py-1 font-mono">
									{rule.selector}
								</div>
								<div
									class="styles-display text-rock-700 bg-rock-100 inline-block rounded p-2 text-left font-mono text-sm"
								>
									{@html parsedDeclarationsHTML}
								</div>
							</div>
						{/each}
					{/if}
				{/if}
			</li>
			<span class="bg-rock-300 block h-px last-of-type:h-0"></span>
		{/each}
	</ul>
	<div class="bg-rock-300 mt-6 h-px w-full text-center">
		<button
			class="bg-background text-rock-400 hover:text-rock-200 inline-block -translate-y-1/2 px-2 text-xl"
			onclick={() => {
				if (editorState.mode === 'document') {
					mode.sidebar = 'stylesadd';
				} else {
					addRuleEmpty();
				}
			}}>+</button
		>
	</div>
{:else}
	<div class="mt-3 mb-8 text-center">
		{let createEmptyBtnFocused = $state(false)}
		<button
			type="button"
			class="border-rock-400 text-rock-600 bg-rock-100 hover:bg-rock-200 ring-rock-200 relative rounded border-2 px-3 py-2 text-lg shadow-inner shadow-white focus:ring-4 focus:outline-none"
			onclick={() => {
				addRuleEmpty();
			}}
			onfocusin={() => (createEmptyBtnFocused = true)}
			onfocusout={() => (createEmptyBtnFocused = false)}
			{@attach (btnEl) => {
				btnEl.focus();
			}}
			>Create Empty Rule
			<span
				class="text-rock-400 absolute right-0 bottom-0 translate-y-full text-sm italic"
				class:hidden={!createEmptyBtnFocused}>(press enter)</span
			></button
		>
	</div>

	<ComponentTray
		comps={savedComponents.filter((comp) => comp.type === 'style')}
		mainAction={addRuleComponent}
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

<style>
	/* It is necessary to set the pointer-events to none so that dragenter and dragleave events aren't fired when
     mousing through the children of the element being dragged, which makes knowing when to show and hide the drag visual much harder */
	/* Also note that this needs to be :global, due to Svelte not recognising the CSSEditor in some way causing it to fail to match (seems like a bug) */
	:global(.drag-target div) {
		pointer-events: none !important;
	}
</style>
