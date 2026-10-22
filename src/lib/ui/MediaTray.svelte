<script module lang="ts">
	export const dClassMediaTray =
		'absolute w-[60%] xl:w-[35%] right-[2%] h-[calc(50vh-4rem)] bg-white z-10 top-12 border-2 border-t-0 rounded-b-lg border-rock-300 flex flex-col'; //t
</script>

<script lang="ts">
	import UploadIcon from 'phosphor-svelte/lib/UploadIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import XCircleIcon from 'phosphor-svelte/lib/XCircleIcon';
	import ArrowCounterClockwiseIcon from 'phosphor-svelte/lib/ArrowCounterClockwiseIcon';
	import { fetch_, xhr_, prefixBytesVal } from '/shared/helper';
	import { watch } from 'runed';
	import { doc, fetchedMediaFiles, fileStates, mediaFiles } from '../store.svelte';
	import { untrack } from 'svelte';
	import { fly } from 'svelte/transition';

	const MAX_CONCURRENT_UPLOADS = 4;

	//////////////// HANDLING LIST

	function updateList() {
		console.log(doc.info.id);
		fetch_(`/documents/api/get_media_files?id=${doc.info.id}`)
			.then((resp) => resp.json())
			.then((data) => {
				mediaFiles.splice(0, mediaFiles.length, ...data);
				fetchedMediaFiles.yes = true;
			});
	}

	$effect(() => {
		if (fetchedMediaFiles.yes || !doc.infoFetched) return;
		untrack(() => updateList());
	});

	// $inspect(mediaFiles);

	async function saveToClipboard(filename: string) {
		try {
			let fpath: string;
			if (globalThis.jinjaParsed) {
				fpath = `/documents/media/${doc.info.id}/${filename}`;
			} else {
				fpath =
					import.meta.env.VITE_DEV_FLASK_SERVER + `/documents/media/${doc.info.id}/${filename}`;
			}

			navigator.clipboard.writeText(fpath);
			return '';
		} catch (error) {
			return (error as DOMException).message;
		}
	}

	async function removeMediaFile(filename: string) {
		try {
			const resp = await fetch_('/documents/api/remove_media_file', {
				method: 'post',
				body: JSON.stringify({
					id: doc.info.id,
					path: filename
				})
			});
			if (resp.ok) {
				const fileIndex = mediaFiles.indexOf(filename);
				if (fileIndex !== -1) {
					mediaFiles.splice(fileIndex, 1);
				} else {
					console.error(`"filename" (${filename}) isn't in mediaFiles:`, mediaFiles);
				}
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

		const uploadQueue: Function[] = [];
		const cancellables: XMLHttpRequest[] = [];
		let N = MAX_CONCURRENT_UPLOADS;

		for (const fileState of fileStates) {
			const formData = new FormData();
			formData.append('file', fileState.file);
			formData.set('id', doc.info.id);
			console.log(doc.info.id);

			uploadQueue.push(() => {
				if (N <= 0) {
					console.error('N is 0 or less');
					return;
				}
				N -= 1;

				fileState.status = 'uploading';
				const { xhr, promise } = xhr_('/documents/api/add_media_file', {
					method: 'POST',
					body: formData,
					onUploadProgress: (e) => {
						if (e.lengthComputable) {
							const progressVal = (e.loaded / e.total) * 100;
							fileState.progress = progressVal.toPrecision(3);

							// console.log(`${(e.loaded / e.total) * 100}%`);
						} else {
							fileState.progress = '';
						}
					}
				});

				promise
					.then((resp) => {
						if (resp.status < 200 || resp.status >= 300) {
							console.error(`Upload failed: ${resp.status} "${resp.responseText}"`);
							fileState.status = 'failed';
							fileState.errMessage = resp.responseText;
						} else {
							fileState.status = 'completed';
						}
					})
					.catch(() => (fileState.status = 'failed'))
					.finally(() => {
						N += 1;
					});

				cancellables.push(xhr);
			});

			fileState.status = 'queued';
		}

		const uploadQueueInterval = setInterval(() => {
			if (N <= 0) return;
			if (uploadQueue.length === 0) {
				clearInterval(uploadQueueInterval);
				console.log('FINISHED ALL UPLOADS');
				return;
			}

			const nextUpload = uploadQueue.shift();
			nextUpload?.();
		});

		return () => {
			uploadQueue.splice(0, uploadQueue.length);
			clearInterval(uploadQueueInterval);
			cancellables.forEach((xhr) => xhr.abort());
		};
	}

	let cancelUpload: () => void = () => undefined;

	function refresh() {
		console.log('REFRESHED');
		fileStates.splice(0, fileStates.length);

		updateList();
	}
</script>

<div class="bg-background relative grow overflow-hidden">
	{let showPopup = $state(false)}
	{let showPopupTransition: number | undefined}
	{let popupEl: HTMLElement | undefined}
	{let error: string = $state('')}
	<div class="h-full overflow-y-scroll py-4">
		{#each mediaFiles as filename, i}
			<div class="flex">
				<button
					class="text-rock-800 border-rock-200 hover:bg-rock-100 active:bg-rock-200 mr-2 ml-5 block grow rounded p-1.5 text-start font-mono text-lg break-all transition-transform duration-75 active:scale-95"
					onclick={async () => {
						error = await saveToClipboard(filename);

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
					{filename}
				</button>
				<button
					class="hover:bg-rock-100 text-steel-700 active:bg-rock-200 mr-6 rounded px-2 text-2xl"
					onclick={() => removeMediaFile(filename)}><XCircleIcon /></button
				>
			</div>
			<div class="bg-rock-200 mx-6 my-0.5 h-0.5" class:hidden={i === mediaFiles.length - 1}></div>
		{/each}
	</div>
	{#if showPopup}
		<div
			bind:this={popupEl}
			transition:fly={{ y: 50 }}
			class="bg-steel-700 text-steel-50 pointer-events-none absolute bottom-3 ml-[50%] -translate-x-1/2 rounded-lg px-4 py-1 text-lg font-bold [.error]:bg-red-700 [.error]:text-red-50"
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
	class="border-rock-200 max-h-10/12 border-t-2 bg-white"
	onsubmit={(e) => (cancelUpload = onSubmit(e))}
>
	<div class="h-full overflow-y-scroll py-3">
		<div class="flex items-center justify-center">
			<!-- <label class="text-xl text-rock-700 mr-4" for="media-upload">Add media:</label
      > -->
			<input
				class="file:bg-steel-200 file:text-steel-700 file:border-steel-300 hover:file:bg-steel-300 hover:file:text-steel-800 w-28 text-white file:w-28 file:cursor-pointer file:rounded-full file:border-2 file:py-1 file:font-mono file:text-lg file:font-semibold disabled:pointer-events-none disabled:opacity-50"
				bind:files
				id="media-upload"
				name="media-upload"
				multiple
				type="file"
				disabled={fileStates.some(({ status }) => status === 'queued' || status === 'uploading')}
			/>
			{#if fileStates.every(({ status }) => status === 'idle')}
				<button
					class="text-steel-800 bg-steel-50 hover:bg-steel-100 hover:text-steel-900 border-steel-300 active:bg-steel-200 ml-4 rounded-lg border-2 p-2 text-xl active:translate-y-1"
					type="submit"><UploadIcon /></button
				>
			{:else if fileStates.some(({ status }) => status === 'queued' || status === 'uploading')}
				<button
					class="text-steel-800 bg-steel-50 hover:bg-steel-100 hover:text-steel-900 border-steel-300 active:bg-steel-200 ml-4 rounded-lg border-2 p-2 text-xl active:translate-y-1"
					type="button"
					onclick={() => cancelUpload()}><XIcon /></button
				>
			{:else}
				<button
					class="text-steel-800 bg-steel-50 hover:bg-steel-100 hover:text-steel-900 border-steel-300 active:bg-steel-200 ml-4 rounded-lg border-2 p-2 text-xl active:translate-y-1"
					type="button"
					onclick={() => refresh()}><ArrowCounterClockwiseIcon /></button
				>
			{/if}
		</div>

		{#if uploadErrMsg}
			<div class="mt-3 text-center text-red-700">{uploadErrMsg}</div>
		{/if}
		{#if fileStates.length > 0}
			<div class="text-rock-800 mt-3 text-center text-base/4">
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
									class="text-steel-600 hover:text-steel-500 ml-2 text-lg"
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
