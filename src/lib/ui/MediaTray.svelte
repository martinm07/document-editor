<script module lang="ts">
	export const dClassMediaTray =
		'absolute w-[60%] xl:w-[35%] right-[2%] h-[calc(50vh-4rem)] bg-white z-10 top-12 border-2 border-t-0 rounded-b-lg border-rock-300 flex flex-col';
</script>

<script lang="ts">
	import { getContext, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { watch } from 'runed';
	import UploadIcon from 'phosphor-svelte/lib/UploadIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import XCircleIcon from 'phosphor-svelte/lib/XCircleIcon';
	import ArrowCounterClockwiseIcon from 'phosphor-svelte/lib/ArrowCounterClockwiseIcon';

	import { prefixBytesVal } from '../helper.js';
	import { fetchedMediaFiles, fileStates, mediaFiles, type Doc } from '../store.svelte.js';
	import type { DocumentEditorProps } from '../App.svelte';

	// const MAX_CONCURRENT_UPLOADS = 4;

	const doc: Doc = getContext('doc');
	const doMediaUpload: () => DocumentEditorProps['doMediaUpload'] = getContext('doMediaUpload');
	const doMediaRemove: () => DocumentEditorProps['doMediaRemove'] = getContext('doMediaRemove');
	const getAllUploadedMedia: () => DocumentEditorProps['getAllUploadedMedia'] =
		getContext('getAllUploadedMedia');

	//////////////// HANDLING LIST

	async function updateList() {
		console.log(doc.id);
		// fetch_(`/documents/api/get_media_files?id=${doc.id}`)
		// 	.then((resp) => resp.json())
		// 	.then((data) => {
		// 		mediaFiles.splice(0, mediaFiles.length, ...data);
		// 		fetchedMediaFiles.yes = true;
		// 	});
		const retrieved = await getAllUploadedMedia()();
		mediaFiles.splice(0, mediaFiles.length, ...retrieved);
		fetchedMediaFiles.yes = true;
	}

	$effect(() => {
		if (fetchedMediaFiles.yes || !doc.infoFetched) return;
		untrack(() => updateList());
	});

	// $inspect(mediaFiles);

	async function saveToClipboard(filepath: string) {
		try {
			navigator.clipboard.writeText(filepath);
			return '';
		} catch (error) {
			return (error as DOMException).message;
		}
	}

	async function removeMediaFile(nameToRemove: string) {
		try {
			// const resp = await fetch_('/documents/api/remove_media_file', {
			// 	method: 'post',
			// 	body: JSON.stringify({
			// 		id: doc.id,
			// 		path: filename
			// 	})
			// });
			// if (resp.ok) {
			// 	const fileIndex = mediaFiles.indexOf(filename);
			// 	if (fileIndex !== -1) {
			// 		mediaFiles.splice(fileIndex, 1);
			// 	} else {
			// 		console.error(`"filename" (${filename}) isn't in mediaFiles:`, mediaFiles);
			// 	}
			// }
			await doMediaRemove()(nameToRemove);

			const fileIndex = mediaFiles.findIndex(([name]) => nameToRemove === name);
			if (fileIndex !== -1) {
				mediaFiles.splice(fileIndex, 1);
			} else {
				console.error(`"nameToRemove" (${nameToRemove}) isn't in mediaFiles:`, mediaFiles);
			}
		} catch (err) {
			console.error(err);
		}
	}

	//////////////// HANDLING UPLOAD

	let uploadErrMsg: string = $state('');
	let files: FileList | null = $state(null);
	watch(
		() => files,
		() => {
			if (!files) return;
			uploadErrMsg = '';
			fileStates.splice(0, fileStates.length);
			Array.from(files).forEach((file) => {
				fileStates.push({
					file,
					status: 'idle',
					progress: '',
					errMessage: null
				});
			});
		}
	);

	function onSubmit(e: SubmitEvent): () => void {
		e.preventDefault();
		console.log('SUBMITTED');
		if (!fileStates || fileStates.length === 0) {
			uploadErrMsg = 'No files selected.';
			return () => undefined;
		}

		// const uploadQueue: Function[] = [];
		// const cancellables: XMLHttpRequest[] = [];
		// let N = MAX_CONCURRENT_UPLOADS;

		const cancellables: Function[] = [];
		for (const fileState of fileStates) {
			const { cancelUpload, getFilepath } = doMediaUpload()(fileState.file, {
				informUploadStatus: (status) => {
					fileState.status = status;
				},
				informUploadProgress: (progress) => {
					fileState.progress = (progress * 100).toPrecision(3);
				},
				informErrorMessage: (msg) => {
					fileState.errMessage = msg;
				}
			});
			cancellables.push(cancelUpload);

			// const formData = new FormData();
			// formData.append('file', fileState.file);
			// formData.set('id', doc.id);
			// console.log(doc.id);

			// uploadQueue.push(() => {
			// 	if (N <= 0) {
			// 		console.error('N is 0 or less');
			// 		return;
			// 	}
			// 	N -= 1;

			// 	fileState.status = 'uploading';
			// 	const { xhr, promise } = xhr_('/documents/api/add_media_file', {
			// 		method: 'POST',
			// 		body: formData,
			// 		onUploadProgress: (e) => {
			// 			if (e.lengthComputable) {
			// 				const progressVal = (e.loaded / e.total) * 100;
			// 				fileState.progress = progressVal.toPrecision(3);

			// 				// console.log(`${(e.loaded / e.total) * 100}%`);
			// 			} else {
			// 				fileState.progress = '';
			// 			}
			// 		}
			// 	});

			// 	promise
			// 		.then((resp) => {
			// 			if (resp.status < 200 || resp.status >= 300) {
			// 				console.error(`Upload failed: ${resp.status} "${resp.responseText}"`);
			// 				fileState.status = 'failed';
			// 				fileState.errMessage = resp.responseText;
			// 			} else {
			// 				fileState.status = 'completed';
			// 			}
			// 		})
			// 		.catch(() => (fileState.status = 'failed'))
			// 		.finally(() => {
			// 			N += 1;
			// 		});

			// 	cancellables.push(xhr);
			// });

			// fileState.status = 'queued';
		}

		return () => {
			cancellables.forEach((func) => func());
		};

		// const uploadQueueInterval = setInterval(() => {
		// 	if (N <= 0) return;
		// 	if (uploadQueue.length === 0) {
		// 		clearInterval(uploadQueueInterval);
		// 		console.log('FINISHED ALL UPLOADS');
		// 		return;
		// 	}

		// 	const nextUpload = uploadQueue.shift();
		// 	nextUpload?.();
		// });

		// return () => {
		// 	uploadQueue.splice(0, uploadQueue.length);
		// 	clearInterval(uploadQueueInterval);
		// 	cancellables.forEach((xhr) => xhr.abort());
		// };
	}

	let cancelUpload: () => void = () => undefined;

	function refresh() {
		console.log('REFRESHED');
		fileStates.splice(0, fileStates.length);

		updateList();
	}
</script>

<div class="relative grow overflow-hidden bg-background">
	{let showPopup = $state(false)}
	{let showPopupTransition: NodeJS.Timeout | undefined}
	{let popupEl: HTMLElement | undefined}
	{let error: string = $state('')}
	<div class="h-full overflow-y-scroll py-4">
		{#each mediaFiles as [name, url], i}
			<div class="flex">
				<button
					class="mr-2 ml-5 block grow rounded border-rock-200 p-1.5 text-start font-mono text-lg break-all text-rock-800 transition-transform duration-75 hover:bg-rock-100 active:scale-95 active:bg-rock-200"
					onclick={async () => {
						error = await saveToClipboard(url);

						showPopup = true;
						clearTimeout(showPopupTransition);
						showPopupTransition = setTimeout(() => (showPopup = false), 3000);
						if (popupEl) {
							popupEl.animate(
								[
									{ transform: 'scale(100%)' },
									{ transform: 'scale(110%)' },
									{ transform: 'scale(100%)' }
								],
								{
									duration: 250,
									iterations: 1
								}
							);
						}
					}}
				>
					{name}
				</button>
				<button
					class="mr-6 rounded px-2 text-2xl text-steel-700 hover:bg-rock-100 active:bg-rock-200"
					onclick={() => removeMediaFile(name)}><XCircleIcon /></button
				>
			</div>
			<div class="mx-6 my-0.5 h-0.5 bg-rock-200" class:hidden={i === mediaFiles.length - 1}></div>
		{/each}
	</div>
	{#if showPopup}
		<div
			bind:this={popupEl}
			transition:fly={{ y: 50 }}
			class="pointer-events-none absolute bottom-3 ml-[50%] -translate-x-1/2 rounded-lg bg-steel-700 px-4 py-1 text-lg font-bold text-steel-50 [.error]:bg-red-700 [.error]:text-red-50"
			class:error
		>
			{#if !error}
				Copied path to clipboard!
			{:else}
				Error copying to clipboard:<br />
				{error}
			{/if}
		</div>
	{/if}
</div>
<form
	class="max-h-10/12 border-t-2 border-rock-200 bg-white"
	onsubmit={(e) => (cancelUpload = onSubmit(e))}
>
	<div class="h-full overflow-y-scroll py-3">
		<div class="flex items-center justify-center">
			<!-- <label class="text-xl text-rock-700 mr-4" for="media-upload">Add media:</label
      > -->
			<input
				class="w-28 text-white file:w-28 file:cursor-pointer file:rounded-full file:border-2 file:border-steel-300 file:bg-steel-200 file:py-1 file:font-mono file:text-lg file:font-semibold file:text-steel-700 hover:file:bg-steel-300 hover:file:text-steel-800 disabled:pointer-events-none disabled:opacity-50"
				bind:files
				id="media-upload"
				name="media-upload"
				multiple
				type="file"
				disabled={fileStates.some(({ status }) => status === 'queued' || status === 'uploading')}
			/>
			{#if fileStates.every(({ status }) => status === 'idle')}
				<button
					class="ml-4 rounded-lg border-2 border-steel-300 bg-steel-50 p-2 text-xl text-steel-800 hover:bg-steel-100 hover:text-steel-900 active:translate-y-1 active:bg-steel-200"
					type="submit"><UploadIcon /></button
				>
			{:else if fileStates.some(({ status }) => status === 'queued' || status === 'uploading')}
				<button
					class="ml-4 rounded-lg border-2 border-steel-300 bg-steel-50 p-2 text-xl text-steel-800 hover:bg-steel-100 hover:text-steel-900 active:translate-y-1 active:bg-steel-200"
					type="button"
					onclick={() => cancelUpload()}><XIcon /></button
				>
			{:else}
				<button
					class="ml-4 rounded-lg border-2 border-steel-300 bg-steel-50 p-2 text-xl text-steel-800 hover:bg-steel-100 hover:text-steel-900 active:translate-y-1 active:bg-steel-200"
					type="button"
					onclick={() => refresh()}><ArrowCounterClockwiseIcon /></button
				>
			{/if}
		</div>

		{#if uploadErrMsg}
			<div class="mt-3 text-center text-red-700">{uploadErrMsg}</div>
		{/if}
		{#if fileStates.length > 0}
			<div class="mt-3 text-center text-base/4 text-rock-800">
				{#each fileStates as { file, status, progress, errMessage }, i}
					{#if file}
						<p
							class="my-2 flex flex-wrap items-center justify-center"
							class:italic={status !== 'completed'}
						>
							<span class="mr-2">{file.name}</span>
							{#if status === 'idle'}
								<span class="text-rock-600">({prefixBytesVal(file.size)})</span>
								<button
									class="ml-2 text-lg text-steel-600 hover:text-steel-500"
									type="button"
									onclick={() => {
										fileStates.splice(i, 1);
									}}><XCircleIcon /></button
								>
							{:else if status === 'queued'}
								<span class="text-rock-600 not-italic">(queued)</span>
							{:else if status === 'uploading'}
								<span class="text-rock-700 not-italic"
									>({progress ? progress + '%' : 'uploading...'})</span
								>
							{:else if status === 'failed'}
								<span class="error text-red-700 not-italic">failed</span>
								{#if errMessage}
									<span class="w-full" aria-hidden="true"></span>
									<span class="-mt-0.5 mb-2 text-red-700">“{errMessage}”</span>
								{/if}
							{:else if status === 'completed'}
								<span class="text-green-700">(done)</span>
							{/if}
						</p>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</form>
