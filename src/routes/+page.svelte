<script lang="ts">
	import {
		DocumentEditor,
		type EditorState,
		MetaTextInputField,
		MetaTextAreaField,
		MetaTagsField
	} from '#lib';

	const editorState: EditorState = $state({
		mode: 'document',
		resourceName: '1',
		documentRedirect: null
	});

	const metaInputFields = {
		title: titleInput,
		description: descriptionInput,
		tags: tagsInput,
		accent: accentInput,
		thumbnail: thumbnailInput,
		status: statusInput
	};
</script>

<DocumentEditor
	{editorState}
	{metaInputFields}
	doChangePage={() => undefined}
	doFullSync={() => undefined}
	doPatchSync={() => undefined}
	doMediaUpload={() => ({ cancelUpload: () => undefined, getFilepath: () => '' })}
	doMediaRemove={() => undefined}
	doPublish={() => undefined}
	doCompLibUpdate={() => undefined}
	getDoc={() => ({
		id: '1',
		body: '',
		stylesheet: '',
		compLibVer: '',
		title: 'hi',
		description: '',
		tags: [],
		accent: '',
		thumbnail: '',
		status: ''
	})}
	getLatestCompLibVersion={() => ''}
	getCompLib={() => []}
	getAllUploadedMedia={() => []}
/>

{#snippet titleInput(getval: () => string, setval: (val: string) => void)}
	<MetaTextInputField
		bind:value={getval, setval}
		name="title"
		label="Title:"
		validate={(title) => {
			if (!title) return 'Title required';
			return '';
		}}
	/>
{/snippet}

{#snippet descriptionInput(getval: () => string, setval: (val: string) => void)}
	<MetaTextAreaField bind:value={getval, setval} name="description" label="Description:" />
{/snippet}

{#snippet tagsInput(getval: () => string[], setval: (val: string[]) => void)}
	<MetaTagsField bind:value={getval, setval} name="tags" label="Tags:" />
	<div class="mx-auto mt-1 max-w-5xl pl-8 text-base text-rock-500 italic">
		Press "+" while editing to add new tags.
	</div>
{/snippet}

{#snippet accentInput(getval: () => string, setval: (val: string) => void)}
	<div class="mx-auto mt-5 flex max-w-3xl px-4">
		<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-accent">Accent:</label>
		<input
			bind:value={getval, setval}
			class="rounded border-2 border-rock-300 bg-background p-1"
			id="edit-accent"
			type="color"
		/>
	</div>
{/snippet}

{#snippet thumbnailInput(getval: () => string, setval: (val: string) => void)}
	<div class="mx-auto mt-7 flex max-w-3xl px-4">
		<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-thumbnail"
			>Thumbnail:</label
		>
		<textarea
			class="h-28 grow rounded border-2 border-rock-300 bg-background p-1 font-mono text-rock-600 ring-steel-200 outline-none focus:bg-white focus:ring-4"
			name="edit-thumbnail"
			id="edit-thumbnail"
			bind:value={getval, setval}></textarea>
	</div>
{/snippet}

{#snippet statusInput(getval: () => string, setval: (val: string) => void)}
	<div class="mx-auto mt-5 flex max-w-3xl px-4">
		<label class="mr-3 flex items-center text-2xl text-rock-700" for="edit-status">Status:</label>
		<select
			class="rounded border-b-2 border-rock-300 bg-background px-4 py-2 font-mono text-lg font-bold text-rock-600 ring-steel-200 focus:ring-4"
			id="edit-status"
			bind:value={getval, setval}
		>
			<option value="private">Private</option>
			<option value="unlisted">Unlisted</option>
			<option value="public">Public</option>
			<option value="featured">Featured</option>
		</select>
	</div>
{/snippet}
