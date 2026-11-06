<script lang="ts">
	import {
		DocumentEditor,
		type EditorState,
		type GenericDocumentEditorProps,
		MetaTextInputField,
		MetaTextAreaField,
		MetaTagsField,
		type CompLibInfo
	} from '#lib';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function initEditorState() {
		let startMode: 'document' | 'component';
		let startResourceName: string;
		let startDocumentRedirect: string | null;

		// /?id=1&mode=document
		// /?id=1&mode=component
		const query = new URLSearchParams(window.location.search);

		let mode = query.get('mode') ?? 'document';
		if (mode !== 'document' && mode !== 'component') {
			console.warn(
				`Value '${mode}' of key 'mode' in URL query was not recognized as either 'document' or 'component'. Defaulting to 'document'.`
			);
			mode = 'document';
		}
		startMode = mode as 'document' | 'component';

		let resourceName = query.get('id');
		if (!resourceName) {
			console.warn(`Missing value for key 'id' in URL query. Defaulting to '1'.`);
			resourceName = '1';
		}
		startResourceName = resourceName;

		let documentRedirect = query.get('redirect');
		startDocumentRedirect = documentRedirect;

		const final: EditorState = {
			mode: startMode,
			resourceName: startResourceName,
			documentRedirect: startDocumentRedirect
		};

		goto(generateURL(final), {
			state: final,
			replace: true,
			shallow: true
		});
	}
	function generateURL(state: EditorState) {
		const query = new URLSearchParams();
		query.set('id', state.resourceName);
		query.set('mode', state.mode);
		if (state.documentRedirect) query.set('redirect', state.documentRedirect);
		const url = `?${query.toString()}`;
		return url;
	}

	initEditorState();

	const metaInputFields = {
		title: titleInput,
		description: descriptionInput,
		tags: tagsInput,
		accent: accentInput,
		thumbnail: thumbnailInput,
		status: statusInput
	};

	type DocumentEditorProps = GenericDocumentEditorProps<{
		title: string;
		description: string;
		tags: string[];
		accent: string;
		thumbnail: string;
		status: string;
	}>;

	const stateIsEditorState = (x: any): x is EditorState => {
		if (Object.hasOwn(x, 'resourceName') && Object.hasOwn(x, 'mode')) return true;
		else return false;
	};

	const doChangePage: DocumentEditorProps['doChangePage'] = (changes) => {
		if (!stateIsEditorState(page.state)) return;
		const state_ = $state.snapshot(page.state);
		Object.assign(state_, changes);

		// history.pushState(state_, '', generateURL(state_));
		goto(generateURL(state_), {
			state: state_,
			shallow: true
		});
	};

	const doFullSync: DocumentEditorProps['doFullSync'] = (id, body, metaChanges) => {
		const key = `DOC-${id}`;
		let existingData;
		try {
			const retrieved = localStorage.getItem(key) ?? 'null';
			// console.log(retrieved);
			existingData = JSON.parse(retrieved);
		} catch (er) {
			console.error(er);
		}
		if (existingData) {
			Object.assign(existingData, { body, ...metaChanges });
			// console.log('doFullSync setting:', existingData);
			localStorage.setItem(key, JSON.stringify(existingData));
		} else {
			console.error("doFullSync for document that doesn't yet exist");
			localStorage.setItem(key, JSON.stringify({ body, ...metaChanges }));
		}
	};

	const doPatchSync: DocumentEditorProps['doPatchSync'] = (id, changes, metaChanges) => {
		const key = `DOC-${id}`;
		let existingData;
		try {
			const retrieved = localStorage.getItem(key) ?? 'null';
			// console.log(retrieved);
			existingData = JSON.parse(retrieved);
		} catch (err) {
			console.error(err);
		}
		if (!existingData)
			throw new Error(`Called doPatchSync for document that doesn't yet exist. ID: ${id}`);

		Object.assign(existingData, metaChanges);
		let body = existingData['body'];
		for (const patch of changes) {
			body = body.slice(0, patch.index) + patch.value + body.slice(patch.index + patch.length);
		}
		existingData['body'] = body;

		// console.log('doPatchSync setting:', existingData);
		localStorage.setItem(key, JSON.stringify(existingData));
	};

	const getDoc: DocumentEditorProps['getDoc'] = (id) => {
		const key = `DOC-${id}`;
		const existingData = JSON.parse(localStorage.getItem(key) ?? 'null');
		if (!existingData) {
			// Create nonexistant document.
			const final = {
				id: '1',
				body: '',
				stylesheet: '',
				compLibVer: getLatestCompLibVersion(),
				title: 'hi',
				description: '',
				tags: [],
				accent: '',
				thumbnail: '',
				status: ''
			};
			localStorage.setItem(key, JSON.stringify(final));

			return final;
		}
		return existingData;
	};

	const doMediaUpload: DocumentEditorProps['doMediaUpload'] = (
		file,
		{ informUploadStatus, informUploadProgress, informErrorMessage }
	) => {
		console.log('Uploading file', file);
		informUploadStatus('uploading');
		(async () => {
			try {
				informUploadProgress(0);

				const root = await navigator.storage.getDirectory();
				informUploadProgress(0.2);

				const fileHandle = await root.getFileHandle(file.name, { create: true });
				informUploadProgress(0.4);

				const writable = await fileHandle.createWritable();
				informUploadProgress(0.6);

				await writable.write(file);
				informUploadProgress(0.8);

				await writable.close();
				informUploadProgress(1);
				informUploadStatus('completed');
			} catch (err) {
				if (err instanceof Error) informErrorMessage(err.message);
				informUploadStatus('failed');
			}
		})();
		return {
			cancelUpload: () => undefined,
			getFilepath: () => ''
		};
	};

	const doMediaRemove: DocumentEditorProps['doMediaRemove'] = async (filepath) => {
		const root = await navigator.storage.getDirectory();
		await root.removeEntry(filepath);
	};

	const getAllUploadedMedia: DocumentEditorProps['getAllUploadedMedia'] = async () => {
		const root = await navigator.storage.getDirectory();
		const final: [name: string, url: string][] = [];
		for await (const key of root.keys()) {
			final.push([key, '/uploads/' + key]);
		}
		return final;
	};

	const doPublish: DocumentEditorProps['doPublish'] = (doc) => {
		console.log('✨ PUBLISHED', doc);
	};

	const doCompLibUpdate: DocumentEditorProps['doCompLibUpdate'] = (info) => {
		localStorage.setItem(`COMPLIB-VER-${info.version}`, JSON.stringify(info));
		localStorage.setItem(`COMPLIB-LATESTVER`, info.version);
	};

	const getLatestCompLibVersion: DocumentEditorProps['getLatestCompLibVersion'] = () => {
		return localStorage.getItem('COMPLIB-LATESTVER') ?? null;
	};

	const getCompLib: DocumentEditorProps['getCompLib'] = (version) => {
		if (!version)
			return {
				version: '',
				previousVersion: null,
				components: [],
				nameChanges: [],
				message: ''
			};

		const parsed: CompLibInfo | null = JSON.parse(
			localStorage.getItem(`COMPLIB-VER-${version}`) ?? 'null'
		);
		if (parsed === null) throw new Error(`Component library of version ${version} not found.`);
		else return parsed;
	};
</script>

<svelte:head>
	<title>Edit Document</title>
</svelte:head>

<DocumentEditor
	editorState={stateIsEditorState(page.state)
		? page.state
		: { resourceName: '1', mode: 'document', documentRedirect: null }}
	{metaInputFields}
	{doChangePage}
	{doFullSync}
	{doPatchSync}
	{getDoc}
	{doMediaUpload}
	{doMediaRemove}
	{getAllUploadedMedia}
	{doPublish}
	{doCompLibUpdate}
	{getLatestCompLibVersion}
	{getCompLib}
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
