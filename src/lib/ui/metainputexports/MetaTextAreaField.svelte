<script lang="ts">
	import FitContentWrapTextarea from '../FitContentWrapTextarea.svelte';

	interface Props {
		name: string;
		value: string;
		label?: string;
		placeholder?: string;
		/**
		 * Should return an empty string when the input is valid, and a message (non-empty string) to show the user when invalid.
		 */
		validate?: (val: string) => string;
	}
	let { name, value = $bindable(), label, placeholder, validate }: Props = $props();
</script>

<div class="mx-auto mt-5 flex max-w-5xl items-stretch px-4 text-lg">
	{#if label}
		<label for={name} class="flex items-center text-2xl text-rock-700">{label}</label>
	{/if}
	<div class="relative mx-3 grow">
		<FitContentWrapTextarea
			class="{validate?.(value)
				? 'error'
				: ''} w-full grow resize-none rounded border-b-2 border-rock-300 bg-background px-3 py-1.5 font-mono text-rock-600 inset-shadow-none ring-steel-200 inset-shadow-rock-200 outline-none focus:bg-white focus:ring-4 [.error]:border-red-300 [.error]:focus:ring-red-200"
			dontModifyWidth
			{name}
			id={name}
			{placeholder}
			bind:value
		/>
		{#if validate?.(value)}
			<div class="absolute bottom-2 ml-3 translate-y-full text-sm font-bold text-red-400">
				<span class="bg-white px-1">{validate?.(value)}</span>
			</div>
		{/if}
	</div>
</div>
