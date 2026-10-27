<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';

	import { compLibEdits } from '../store.svelte.js';
	import { saveLibChanges, discardLibChanges } from './libraryeditor.svelte.js';
	import { tada } from '../helper.js';
	import type { DocumentEditorProps, EditorState } from '../App.svelte';

	const editorState: () => EditorState = getContext('editorState');
	const doCompLibUpdate: () => DocumentEditorProps['doCompLibUpdate'] =
		getContext('doCompLibUpdate');

	let showFullModal = $state(false);
	let btnTempDisabled = $state(false);
	const BTN_TEMP_DISABLED_TIMEOUT = 1000;

	let commitMsg: string = $state('');
	let commitDesc: string = $state('');

	let commitMsgError: string | null = $state(null);
	let commitMsgInput: HTMLInputElement | null = $state(null);
	let submitBtn: HTMLButtonElement | null = $state(null);
	function saveChangesSubmit(e?: Event) {
		if (e) e.preventDefault();
		if (!commitMsg) {
			commitMsgError = 'Missing message';
			if (commitMsgInput) commitMsgInput.focus();
			return;
		}

		// saveLibChanges(commitMsg, commitDesc, submitBtn);
		saveLibChanges({
			message: commitMsg,
			description: commitDesc,
			submitBtn,
			doCompLibUpdate: doCompLibUpdate()
		});
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') showFullModal = false;
	}}
/>

{#if showFullModal && editorState().mode === 'component' && compLibEdits.current.length > 0}
	<div
		transition:fly={{ y: 48 }}
		class="fixed bottom-6 z-10 ml-[25%] h-[40%] w-1/2 rounded-lg border-2 border-rock-300 bg-background"
	>
		<form
			class="max-h-full w-full overflow-y-auto px-3 pt-6 pb-20"
			method="post"
			onsubmit={(e) => saveChangesSubmit(e)}
		>
			<div class="flex items-center justify-center">
				<label for="lib-change-msg" class="mr-2.5 text-lg text-rock-700">Message:</label>
				<div class="relative max-w-96 grow">
					<input
						type="text"
						name="lib-change-msg"
						id="lib-change-msg"
						placeholder="Briefly describing intent of changes"
						class="w-full rounded border-2 border-rock-300 bg-white px-3 py-1.5 text-rock-800 ring-steel-200 outline-none focus:ring-4"
						bind:value={commitMsg}
						bind:this={commitMsgInput}
						oninput={() => {
							commitMsgError = null;
						}}
					/>
					{#if commitMsgError !== null}
						<div
							class="absolute bottom-2 ml-3 translate-y-full text-sm font-bold text-red-400"
							in:tada={{ duration: 400 }}
						>
							<span class="bg-background px-1">{commitMsgError}</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="mt-6 flex items-center justify-center">
				<label for="lib-change-desc" class="mr-2.5 text-lg text-rock-700">Description:</label>
				<textarea
					name="lib-change-desc"
					id="lib-change-desc"
					placeholder="More complete description of changes and their intents (Optional)"
					class="max-w-96 grow rounded border-2 border-rock-300 bg-white px-3 py-1.5 text-rock-800 ring-steel-200 outline-none focus:ring-4"
					bind:value={commitDesc}></textarea>
			</div>
		</form>
		<button
			class="absolute top-2 right-2 flex items-center justify-center text-3xl text-rock-700 transition-transform hover:rotate-90"
			aria-label="Close"
			onclick={() => (showFullModal = false)}
		>
			<ion-icon name="close"></ion-icon>
		</button>
	</div>
{/if}
{#if editorState().mode === 'component' && compLibEdits.current.length > 0}
	<div
		transition:fly={{ y: 48 }}
		class="fixed bottom-6 z-20 ml-[50%] -translate-x-1/2 rounded-md shadow-lg shadow-rock-300 transition-all duration-300 hover:-translate-y-1 hover:active:translate-y-0 [.inmodal]:bottom-9 [.inmodal]:shadow-none"
		class:inmodal={showFullModal}
	>
		<button
			class="rounded-lg border-2 border-green-700 bg-green-500 px-4 py-2 text-lg font-bold text-white shadow-inner shadow-green-100 ring-green-700/30 transition-colors text-shadow-green-700 text-shadow-xs hover:bg-green-600 focus:ring-4 hover:active:cursor-default hover:active:bg-green-700 disabled:pointer-events-none disabled:opacity-40 [.inmodal]:bg-green-50 [.inmodal]:text-green-600 [.inmodal]:shadow-none [.inmodal]:text-shadow-none [.inmodal]:hover:active:text-white"
			type="button"
			class:inmodal={showFullModal}
			disabled={btnTempDisabled}
			onclick={() => {
				if (showFullModal) saveChangesSubmit();
				// if (showFullModal) showFullModal = false;
				else {
					showFullModal = true;
					btnTempDisabled = true;
					setTimeout(() => (btnTempDisabled = false), BTN_TEMP_DISABLED_TIMEOUT);
				}
			}}>{showFullModal ? 'Save changes' : 'Finalise changes'}</button
		>
		{#if showFullModal}
			<button
				class="absolute -right-7 translate-x-full rounded-lg border-2 border-red-700 p-3 text-xl font-bold text-red-700 shadow-inner shadow-red-100 ring-red-700/30 transition-colors text-shadow-red-700 text-shadow-xs hover:bg-red-600 hover:text-red-50 focus:ring-4 hover:active:cursor-default hover:active:bg-red-700 disabled:pointer-events-none disabled:opacity-40"
				type="button"
				disabled={btnTempDisabled}
				onclick={() => {
					discardLibChanges();
				}}
			>
				<TrashIcon />
			</button>
		{/if}
	</div>
{/if}
