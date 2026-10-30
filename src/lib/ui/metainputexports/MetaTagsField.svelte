<script lang="ts">
	import { TagsEditor } from '#lib/components/ComponentMetaEdit.svelte';
	import { deepEqual } from '#lib/helper.ts';
	import { watch } from 'runed';

	interface Props {
		name: string;
		value: string[];
		label?: string;
		validate?: (tagI: number, tags: string[]) => [exists: boolean, error: boolean, msg: string];
	}

	let { name, value = $bindable(), label, validate }: Props = $props();

	let tagsEditorEl: HTMLElement | null = $state(null);
	let didEditorSync: boolean = false;

	let tagsEditor: TagsEditor;
	(() => {
		tagsEditor = new TagsEditor(
			validate ?? (() => [true, false, '']),
			(tags) => {
				value = tags;
				didEditorSync = true;
				setTimeout(() => (didEditorSync = false));
			},
			['+']
		);
	})();

	watch(
		() => value,
		(curr, prev) => {
			if (didEditorSync) {
				console.log('SKIPPED');
				didEditorSync = false;
				return;
			}
			if (!deepEqual(curr, prev) && tagsEditorEl) tagsEditor.setTags(curr, tagsEditorEl);
		}
	);
</script>

<svelte:document
	onselectionchange={() => {
		if (!tagsEditorEl) return;
		tagsEditor.onSelectionChange(tagsEditorEl);
	}}
/>

<div class="mx-auto mt-5 flex max-w-5xl px-4">
	{#if label}
		<label for={name} class="flex items-center text-2xl text-rock-700" id="{name}-label"
			>{label}</label
		>
	{/if}
	<div
		role="application"
		aria-labelledby={name}
		spellcheck="false"
		contenteditable="true"
		id={name}
		bind:this={tagsEditorEl}
		oninput={(e) => {
			if (tagsEditorEl) {
				tagsEditor.onInput(tagsEditorEl);
				// handleTagsAutocomplete();
			}
		}}
		onkeydown={(e) => tagsEditor.onKeydown(e)}
		class="meta-tags-field relative mx-3 flex min-w-60 flex-wrap font-mono text-rock-600 outline-none"
	></div>
</div>

<style>
	@reference "../tailwindinit.css";

	:global {
		.meta-tags-field span.space {
			@apply text-2xl;
		}
		.meta-tags-field span:not(.space) {
			@apply my-2 block rounded border-2 border-rock-300 bg-background p-0.5;
		}
		.meta-tags-field span.new {
			@apply border-dashed;
		}
		.meta-tags-field span.error {
			@apply border-red-300;
		}
		.meta-tags-field span.error::before {
			@apply absolute inline-block translate-y-[calc(100%+(--spacing(1)))] bg-white font-sans text-sm font-bold text-nowrap text-red-400 not-italic;
			content: var(--errormsg);
		}
		.meta-tags-field:focus span.focused {
			@apply bg-white ring-4 ring-steel-200;
		}

		/* Make the "placeholder" for when there are no tags (the field is empty) */

		.meta-tags-field span.error[style*='Missing tag']:only-child {
			@apply opacity-0;
		}
		.meta-tags-field:has(span.error[style*='Missing tag']:only-child)::before {
			content: 'Tag Guidance Document';
			@apply absolute -z-10 my-2 rounded border-b-2 border-rock-300 bg-background p-0.5 text-nowrap text-rock-600/50;
		}
		.meta-tags-field:focus::before {
			@apply bg-white! ring-4 ring-steel-200;
		}
		/*#edit-tags span.error:only-child {
      display: none:
    }*/
	}
</style>
