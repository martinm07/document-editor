<script module lang="ts">
	export interface IDocMeta {
		informMetaUpdate: (mutations: TempMutationRecord[]) => void;
	}
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { watch } from 'runed';
	import type { SaveDoc } from './docsaving.svelte.js';
	import { deepEqual, getNodeParents } from '../helper.js';
	import { type TempMutationRecord } from './docsyncing.js';
	import type { Doc } from '../store.svelte.js';
	import type { DocumentEditorProps, EditorState } from '../App.svelte';

	const doc: Doc = getContext('doc');
	const getDocEl: () => HTMLElement = getContext('getDocEl');
	const editorState: () => EditorState = getContext('editorState');

	interface Props {
		docSaver: SaveDoc;
	}
	let { docSaver }: Props = $props();

	$inspect(doc.id);

	function checkMetaDataEl(el: Element) {
		const propName = el.getAttribute('data-field');
		const propValue = JSON.parse(el.textContent);
		if (
			propName &&
			doc.info &&
			Object.hasOwn(doc.info, propName) &&
			!deepEqual(doc.info[propName], propValue)
		) {
			doc.info[propName] = propValue;
		}
	}

	export function informMetaUpdate(mutations: TempMutationRecord[]) {
		if (!doc.infoFetched) return;
		const docEl = getDocEl();

		for (const mutation of mutations) {
			const toCheck = [mutation.target, ...getNodeParents(mutation.target, docEl, true)];
			for (const node of toCheck) {
				if (!(node instanceof Element)) continue;
				if (node.classList.contains('document-meta-data')) {
					// Check the document-meta-data element
					checkMetaDataEl(node);
					break;
				} else if (node.classList.contains('doc-meta')) {
					Array.from(node.children).forEach((child) => {
						if (child.classList.contains('document-meta-data')) checkMetaDataEl(child);
					});
					break;
				} else if (node === docEl) {
					if (
						mutation.addedNode instanceof Element &&
						mutation.addedNode.classList.contains('doc-meta')
					) {
						Array.from(mutation.addedNode.children).forEach((child) => {
							if (child.classList.contains('document-meta-data')) checkMetaDataEl(child);
						});
					}
					break;
				}
			}
		}

		// if (!doc.infoFetched) return;
		// return;
		// for (const mutation of mutations) {
		// 	// We can rule out all attributes mutations, as there many only be characterData or childList for tags
		// 	if (mutation.type === 'attributes') continue;
		// 	const target =
		// 		mutation.type === 'childList' ? (mutation.addedNode ?? mutation.target) : mutation.target;
		// 	const parentEl = !(target instanceof Element) ? target.parentElement : target;
		// 	const metaEl = parentEl?.closest('.document-meta-data');
		// 	const targetIsMetaContainer =
		// 		target instanceof HTMLElement && target.classList.contains('doc-meta');
		// 	if (doc.info && parentEl && metaEl instanceof HTMLElement) {
		// 		// console.log("Doing update for ", metaEl);
		// 		updateStateForMetaEl(metaEl);
		// 	} else if (doc.info && targetIsMetaContainer) {
		// 		Array.from(target.children).forEach((metaEl) => {
		// 			if (!(metaEl instanceof HTMLElement)) return;
		// 			updateStateForMetaEl(metaEl);
		// 		});
		// 	}
		// }
	}

	// Server sync
	watch(
		() => $state.snapshot(doc.info),
		(curr, prev) => {
			if (editorState().mode === 'document' && !deepEqual(curr, prev)) {
				docSaver.syncDocMetadataDebounce(doc.id, curr);
			}
		},
		{
			lazy: true
		}
	);
</script>

<div
	class="doc-meta history-not-body"
	{@attach (containerEl) => {
		if (!doc.info) return;
		const metaPropNames = Object.keys($state.snapshot(doc.info));

		const consumedProps: string[] = [];
		for (const child of containerEl.children) {
			if (!child.classList.contains('document-meta-data') || !child.hasAttribute('data-field')) {
				child.remove();
				continue;
			}

			const propName = child.getAttribute('data-field');
			if (!propName || !metaPropNames.includes(propName)) {
				child.remove();
				continue;
			}

			const newValue = JSON.stringify(doc.info[propName]);
			if (child.textContent !== newValue) {
				child.textContent = newValue;
			}
			consumedProps.push(propName);
		}

		for (const propName of metaPropNames) {
			if (consumedProps.includes(propName)) continue;
			// This is a property that doesn't yet have an element associated with it; add it now
			const newPre = document.createElement('pre');
			newPre.classList.add('document-meta-data');
			newPre.setAttribute('data-field', propName);
			newPre.textContent = JSON.stringify(doc.info[propName]);
			containerEl.appendChild(newPre);
		}
	}}
></div>

<!-- <div class="doc-meta history-not-body">
	<pre class="document-meta-data" data-field="id">{doc.info ? doc.id : ''}</pre>
	<pre class="document-meta-data" data-field="componentLibVer">{doc.info
			? doc.compLibVer
			: ''}</pre>
	<pre class="document-meta-data" data-field="status">{doc.info ? doc.info.status : ''}</pre>

	<pre class="document-meta-data" data-field="title">{doc.info ? doc.info.title : ''}</pre>
	<pre class="document-meta-data" data-field="description">{doc.info
			? doc.info.description
			: ''}</pre>
	<pre class="document-meta-data" data-field="accent">{doc.info ? doc.info.accent : ''}</pre>
	<pre class="document-meta-data" data-field="thumbnail">{doc.info ? doc.info.thumbnail : ''}</pre>

	<div
		class="document-meta-data"
		data-field="tags"
		{@attach (container) => {
			if (!doc.info.tags) return;
			if (container.childElementCount > doc.info.tags.length) {
				// If there are more child <span>s than tags, we must remove the excess
				Array.from(container.children)
					.slice(doc.info.tags.length)
					.forEach((child) => child.remove());
			} else if (container.childElementCount < doc.info.tags.length) {
				// If there are more tags than child <span>s, we must add new <span>s to make up the difference
				doc.info.tags.slice(container.childElementCount).forEach((tag) => {
					const newSpan = document.createElement('span');
					newSpan.textContent = tag;
					container.appendChild(newSpan);
				});
			}
			// Now that there's exactly one <span> child for every tag in doc.info.tags, we can go through them and make sure the textContents are correct
			Array.from(container.children).forEach((child, i) => {
				const tag = doc.info.tags[i];
				if (child.textContent !== tag) child.textContent = tag;
			});
		}}
	></div>
</div> -->

<style>
	.doc-meta {
		background: lightgoldenrodyellow;
		display: none;
		/*height: 100px;*/
	}

	/*.document-meta-data {*/
	/*display: hidden;*/
	/*display: block;*/
	/*}*/
</style>
