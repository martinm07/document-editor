<script lang="ts">
	import CaretRightIcon from 'phosphor-svelte/lib/CaretRightIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import LinkBreakIcon from 'phosphor-svelte/lib/LinkBreakIcon';

	import {
		selection,
		savedComponents,
		mode,
		compPartToInheritedAttrs,
		type PropsList
	} from '../store.svelte';
	import { breakInheritance, getCompNameAndPart } from './component.svelte';
	import { splitStringAtChar } from '../editors/css/handlecss';
	import { stylesIntersection } from '../editors/css/CSSEditor.svelte';
	import { isHiddenAttribute, type Attribute } from '../editors/attributes/AttributesEditor.svelte';

	interface Props {
		currentAttrs: Attribute[];
	}
	let { currentAttrs }: Props = $props();

	const compsSelected = $derived.by(() => {
		currentAttrs.length;
		if (selection.main.length <= 0) return false;
		return selection.main.every((el) => el.hasAttribute('data-component'));
	});

	const compName = $derived.by(() => {
		currentAttrs.length;
		if (selection.main.length <= 0) return null;
		const elDataComponent = selection.main[0].getAttribute('data-component');
		if (!elDataComponent) return null;
		const [name] = getCompNameAndPart(elDataComponent);
		if (
			selection.main.every((el) => {
				const checkDataComponent = el.getAttribute('data-component');
				if (checkDataComponent && getCompNameAndPart(checkDataComponent)[0] === name) return true;
				else return false;
			})
		)
			return name;
		else return null;
	});

	const compPart = $derived.by(() => {
		currentAttrs.length;
		if (selection.main.length <= 0) return null;
		const elDataComponent = selection.main[0].getAttribute('data-component');
		if (!elDataComponent) return null;
		if (selection.main.every((el) => el.getAttribute('data-component') === elDataComponent)) {
			const [, part] = getCompNameAndPart(elDataComponent);
			return part;
		} else return null;
	});

	const compDescription = $derived.by(() => {
		currentAttrs.length;
		const comp = savedComponents.find((comp) => comp.name === compName);
		if (!comp) return null;
		else return comp.description ?? '';
	});

	const compTags = $derived.by(() => {
		currentAttrs.length;
		const comp = savedComponents.find((comp) => comp.name === compName);
		if (!comp) return null;
		else return comp.tags?.split(',') ?? [];
	});

	let compInheritedInfoOpen = $state(true);

	const inheritedTagName = $derived.by(() => {
		if (selection.main.length <= 0) return null;
		const elTagName = selection.main[0].tagName;
		if (selection.main.every((el) => el.tagName === elTagName)) return elTagName.toLowerCase();
		else return '';
	});

	const inheritedStyles = $derived.by(() => {
		if (selection.main.length <= 0) return [];
		/// This could be considered necessary if we need to update the display on updates to attributes,
		/// But for these displays of styles they can't be overriden directly, and hence we don't need to.
		// if (!$state.snapshot(editorAttrs)) return [];

		// There are a variable number of "style" attributes that need to be parsed,
		//  as there are the inherited normally applied styles of component parts, but also
		//  the styles that apply by pseudoclass.
		// Parsing involves taking the intersection of styles for each style attribute independently,
		//  and actually parsing that intersection into a list of property names and values.
		const styleAttrValues: Map<string, string[]> = new Map();
		// selection.main.forEach((el) => {
		//   Array.from(el.attributes).forEach((attr) => {
		//     if (attr.name.startsWith("data-dummycompstyle")) {
		//       const mapItemName = attr.name.startsWith("data-dummycompstyle-")
		//         ? attr.name.slice("data-dummycompstyle-".length)
		//         : "";
		//       let stylesList = styleAttrValues.get(mapItemName);
		//       if (!stylesList) styleAttrValues.set(mapItemName, [attr.value]);
		//       else stylesList.push(attr.value);
		//     }
		//   });
		// });

		Array.from(selection.main[0].attributes).forEach((attr) => {
			if (attr.name.startsWith('data-dummycompstyle')) {
				styleAttrValues.set(attr.name, [attr.value]);
			}
		});
		selection.main.slice(1).forEach((el) => {
			styleAttrValues.forEach((stylesList, attrName) => {
				const elAttrVal = el.getAttribute(attrName);
				if (elAttrVal === null) {
					styleAttrValues.delete(attrName);
				} else {
					stylesList.push(elAttrVal);
				}
			});
		});

		const final: Map<string, PropsList> = new Map();

		styleAttrValues.forEach((stylesList, attrName) => {
			const reducedStylesList = stylesList
				.map((styleStr) => {
					if (styleStr.length === 0) return [];
					return splitStringAtChar(styleStr, ';').map((prop) => {
						const final = splitStringAtChar(prop, ':');
						if (final.length !== 2) {
							console.error(
								`When parsing inherited styles for attribute '${attrName}', there was a parsing error.`,
								stylesList
							);
							return [final[0], final.at(-1)];
						}
						return final;
					}) as PropsList;
				})
				.reduce((prev, curr) => {
					return stylesIntersection(prev, curr);
				});

			const mapItemName = attrName.startsWith('data-dummycompstyle-')
				? attrName.slice('data-dummycompstyle-'.length)
				: '';
			if (reducedStylesList.length > 0) final.set(mapItemName, reducedStylesList);
			else final.set(mapItemName, [['', '']]);
		});
		// splitStringAtChar()

		return final;
	});

	const inheritedAttributes = $derived.by(() => {
		if (selection.main.length <= 0) return [];

		// const final: PropsList = [];
		// let firstEl = true;
		// selection.main.forEach((el) => {
		//   const elDataComponent = el.getAttribute("data-component");
		//   if (!elDataComponent) return;
		//   const numInherited =
		//     compPartToInheritedAttrs.get(elDataComponent)?.length;

		//   if (numInherited === undefined) {
		//     console.error(
		//       `No entry for data-component '${elDataComponent}' in compPartToInheritedAttrs`,
		//       compPartToInheritedAttrs,
		//     );
		//     return;
		//   }

		//   const inherited = Array.from(el.attributes).slice(0, numInherited);
		//   if (firstEl) {
		//     inherited.forEach((attr) => final.push([attr.name, attr.value]));
		//     firstEl = false;
		//   } else {
		//     inherited.forEach((attr) => {
		//       const matchingI = final.findIndex((item) => item[0] === attr.name);
		//       if (matchingI >= 0 && final[matchingI][1] !== attr.value)
		//         final.splice(matchingI, 1);
		//     });
		//   }
		// });
		return currentAttrs
			.filter((attr) => {
				if (
					selection.main.every((el) => {
						const elDataComponent = el.getAttribute('data-component');
						if (!elDataComponent) return;
						const numInherited = compPartToInheritedAttrs.get(elDataComponent)?.length;

						if (numInherited === undefined) {
							console.error(
								`No entry for data-component '${elDataComponent}' in compPartToInheritedAttrs`,
								compPartToInheritedAttrs
							);
							return;
						}

						const attrI = Array.from(el.attributes).findIndex(
							(checkAttr) => checkAttr.name === attr.name
						);
						if (attrI >= 0 && attrI < numInherited) return true;
						else return false;
					})
				) {
					return true;
				} else return false;
			})
			.map((attr) => {
				if (attr.name.startsWith('data-override-')) {
					return {
						name: attr.name.slice('data-override-'.length),
						value: attr.value,
						overridden: true
					};
				} else {
					return {
						name: attr.name,
						value: attr.value,
						overridden: false
					};
				}
			})
			.filter((attr) => !isHiddenAttribute(attr.name) && attr.name !== 'data-component');

		// return final;
	});
</script>

{#if compsSelected}
	<div class="text-rock-800 relative my-2 w-full text-xl [:not(.hidden)]:inline-block">
		<span
			class="absolute -ml-2 -translate-y-0.5 text-nowrap [.only-child]:right-3 [:not(.only-child)]:-translate-x-full"
			class:hidden={!compsSelected}
			class:only-child={compName === null}
		>
			<button
				class="text-steel-600 hover:bg-steel-100 hover:active:bg-steel-200 hover:active:text-steel-700 flex items-center rounded p-1 text-2xl hover:active:translate-y-0.5"
				title="Break inheritance of element from component"
				aria-label="Break inheritance of element from component"
				onclick={() => breakInheritance(selection.main)}><LinkBreakIcon weight="bold" /></button
			>
		</span>
		<span class="bg-rock-100 rounded px-3 py-1.5" class:hidden={compName === null}>{compName}</span>
		<span class="absolute ml-2 text-nowrap" class:hidden={!compPart}
			><span class="text-rock-600 mr-1">∋</span><span class="inline-block -translate-y-px"
				>{compPart}</span
			></span
		>
	</div>
	<div class="text-rock-700 mb-1 text-lg italic" class:hidden={compDescription === null}>
		{compDescription}
	</div>
	<div class="text-rock-700 text-lg/9 italic" class:hidden={compTags === null}>
		{#each compTags as tag}
			<span class="bg-rock-50 border-rock-200 rounded border px-1 py-0.5">{tag}</span>
			&nbsp;
		{/each}
	</div>

	<div class:hidden={compName === null} class="bg-rock-200 my-3 h-0.5"></div>

	<button
		class="text-rock-700 hover:text-rock-600 mt-4 flex items-center justify-start text-lg"
		class:hidden={compName === null}
		onclick={() => (compInheritedInfoOpen = !compInheritedInfoOpen)}
	>
		Inherited styles & attributes
		{#if compInheritedInfoOpen}
			<CaretDownIcon class="ml-1 inline text-xl" />
		{:else}
			<CaretRightIcon class="ml-1 inline text-xl" />
		{/if}
	</button>

	{#if compInheritedInfoOpen && mode.sidebar === 'edit' && compName !== null}
		<div class="mt-3">
			<span class="bg-rock-100 text-rock-700 rounded p-2 font-mono text-lg font-bold"
				>&lt;{inheritedTagName}&gt;</span
			>
		</div>
		{#each inheritedStyles.entries() as [stylesAttr, propsList]}
			<div class="my-4">
				{#if stylesAttr}
					<div class="text-rock-700 flex items-center justify-center font-mono text-lg">
						{stylesAttr}
					</div>
				{/if}
				<div
					class="styles-display text-rock-700 bg-rock-100 inline-block rounded p-2 text-left font-mono text-sm"
				>
					{#each propsList as prop}
						<b>{prop[0]}</b><span class="colon">:</span><em>{prop[1]}</em><span class="semic"
							>;</span
						><br />
					{/each}
				</div>
			</div>
		{/each}
		<div class="h-1"></div>
		{#each inheritedAttributes as { name, value, overridden }}
			<div class="text-rock-700 my-3 flex flex-wrap items-center justify-center font-mono text-sm">
				<div
					class:overridden
					class="bg-rock-100 [.overridden]:text-rock-500 m-0.5 box-content max-w-[calc(100%-8px)] rounded p-1 font-bold text-wrap"
				>
					{name}
				</div>
				<div
					class:overridden
					class="bg-rock-100 [.overridden]:text-rock-500 m-0.5 box-content max-w-[calc(100%-8px)] rounded p-1 text-wrap wrap-break-word"
				>
					{value}
				</div>
			</div>
		{/each}
	{/if}

	<div class:hidden={compName === null} class="bg-rock-200 my-3 h-0.5"></div>
{/if}
