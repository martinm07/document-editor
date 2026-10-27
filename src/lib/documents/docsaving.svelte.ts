import { useDebounce } from 'runed';
import {
	generateElCompContentStr,
	generateStyleCompContentStr
} from '../components/component.svelte.js';
import { Comps, updateCompEdit } from '../components/libraryeditor.svelte.js';
import {
	reconstructHTMLString,
	patchMutations,
	type DocNodeMap,
	type StringPosNodeMap,
	type DocPatchStr,
	generatePosNodes,
	applyPatches,
	getElementString
} from './docsyncing.js';
import { localSave, localSaveEntryIsDoc, pruneLocalSave, type Doc } from '../store.svelte.js';
import { closestAttribute, DynamicStylesheet } from '../helper.js';
import {
	isHistoryNotBodyContainer,
	type DocumentEditorProps,
	type EditorState
} from '../App.svelte';
import type { CompilePublishInfo, SvelteCompiler } from '../svelte/compiler.js';
import type { DocumentMetaUpdate } from '#lib/types.js';

const getDocumentID = (editorState: EditorState) =>
	editorState.mode === 'document' ? Number.parseInt(editorState.resourceName) : null;
const getComponentID = (editorState: EditorState) =>
	editorState.mode === 'component' ? editorState.resourceName : null;

// Time between subsequent server syncs, in ms
const SERVER_SYNC_INTERVAL_TIME = 5000;

interface SaveDocConstructor {
	editorState: () => DocumentEditorProps['editorState'];
	doPatchSync: () => DocumentEditorProps['doPatchSync'];
	doFullSync: () => DocumentEditorProps['doFullSync'];
	doc: Doc;
	comps: Comps;

	makePatches: () => ReturnType<typeof patchMutations>;
	getDocEl: () => HTMLElement | undefined;
	docNodes: DocNodeMap;
	stringPosNodeMap: StringPosNodeMap;
	doServerSync?: boolean;
	debug?: boolean;
}

export class SaveDoc {
	doPatchSync: () => DocumentEditorProps['doPatchSync'];
	doFullSync: () => DocumentEditorProps['doFullSync'];
	doc: Doc;
	comps: Comps;

	serverSyncInterval: NodeJS.Timeout | undefined;
	serverSyncPatchesQueue: DocPatchStr[] = [];
	prevFetch: Promise<void> | null = null;
	doServerSync: boolean;
	// syncDocMetadataDebounce: (info: typeof doc.info) => void;
	// syncDocMetadataDebounce: typeof useDebounce<Array<typeof doc.info>>;
	syncDocMetadataDebounce: ReturnType<
		typeof useDebounce<[string, typeof this.doc.info], Promise<void>>
	>;
	syncDocStylesDebounce: ReturnType<typeof useDebounce<[string, string], Promise<void>>>;

	editorState: () => DocumentEditorProps['editorState'];
	prevDocumentType: DocumentEditorProps['editorState']['mode'] | null = null;
	prevDocumentID: DocumentEditorProps['editorState']['resourceName'] | null = null;
	// prevDocInfo: typeof doc.info | null = null;

	makePatches: () => ReturnType<typeof patchMutations>;
	getDocEl: () => HTMLElement | undefined;
	syncingHTMLStr = '';

	docNodes: DocNodeMap;
	stringPosNodeMap: StringPosNodeMap;

	debug: boolean = false;
	private appHTMLStr = '';

	constructor(p: SaveDocConstructor) {
		this.editorState = p.editorState;
		this.doPatchSync = p.doPatchSync;
		this.doFullSync = p.doFullSync;
		this.doc = p.doc;
		this.comps = p.comps;

		if (SERVER_SYNC_INTERVAL_TIME > 0)
			this.serverSyncInterval = setInterval(
				() => this.syncServerDocPatch(getDocumentID(p.editorState())),
				SERVER_SYNC_INTERVAL_TIME
			);

		this.syncDocMetadataDebounce = useDebounce(
			(documentID: string, info: typeof this.doc.info) => {
				return this.syncDocMetadata(documentID, info);
			},
			() => SERVER_SYNC_INTERVAL_TIME
		);

		this.syncDocStylesDebounce = useDebounce(
			(documentID: string, styles: string) => {
				return this.syncDocStyles(documentID, styles);
			},
			() => SERVER_SYNC_INTERVAL_TIME
		);

		this.getDocEl = p.getDocEl;
		this.docNodes = p.docNodes;
		this.stringPosNodeMap = p.stringPosNodeMap;
		this.makePatches = p.makePatches;
		this.doServerSync = p.doServerSync ?? true;
		this.debug = p.debug ?? false;
	}

	/**
	 * Does local sync and server sync, and determines whether or not to make patches of any changes
	 * (primarily by if the changes were simply the loading of the document/component, or if the document/component was being edited)
	 * @returns Patches, stringPosForwardUpdateMap, stringPosBackwardUpdateMap, HTML string
	 */
	save(): ReturnType<typeof patchMutations> {
		// Check if the loaded document just changed
		if (
			this.prevDocumentType !== this.editorState().mode ||
			this.prevDocumentID !== this.editorState().resourceName
		) {
			// Flush the serverSyncPatches queue
			if (this.prevDocumentType === 'document' && this.prevDocumentID) {
				// Apply the patches
				this.syncServerDocPatch(Number.parseInt(this.prevDocumentID));
			} else {
				// If the previous loading document was not of document type, then there shouldn't be any patches,
				//  but just to be safe we splice the queue anyway.
				this.serverSyncPatchesQueue.splice(0, this.serverSyncPatchesQueue.length);
			}

			// Clear docNodes and stringPosNodeMap
			this.docNodes.keys().forEach((key) => this.docNodes.delete(key));
			this.stringPosNodeMap.keys().forEach((key) => this.stringPosNodeMap.delete(key));

			let syncedHTMLStr: string | undefined;
			if (this.editorState().mode === 'document') {
				syncedHTMLStr = this.syncDocFull();
			} else if (this.editorState().mode === 'component') {
				syncedHTMLStr = this.syncCompLocal();
			}

			if (syncedHTMLStr === undefined) {
				console.error('Full document sync failed.');
			} else {
				this.prevDocumentType = this.editorState().mode;
				this.prevDocumentID = this.editorState().resourceName;

				this.appHTMLStr = syncedHTMLStr;
				return [[], new Map(), new Map(), syncedHTMLStr];
			}
		}

		const [patches, historyForwardMap, historyBackwardMap, htmlStr] = this.makePatches();

		if (this.editorState().mode === 'document') {
			// this.syncDocLocal(htmlStr);
			this.serverSyncPatchesQueue.push(...patches.map((patch) => patch.str_));
		} else if (this.editorState().mode === 'component') {
			this.syncCompLocal(htmlStr);
		}

		this.prevDocumentType = this.editorState().mode;
		this.prevDocumentID = this.editorState().resourceName;

		this.appHTMLStr = htmlStr;
		return [patches, historyForwardMap, historyBackwardMap, htmlStr];
	}

	flushServerChanges() {
		const bodyPromise = this.syncServerDocPatch(getDocumentID(this.editorState()));
		const metaPromise = this.syncDocMetadataDebounce.runScheduledNow();
		const stylesPromise = this.syncDocStylesDebounce.runScheduledNow();
		return Promise.all([bodyPromise, metaPromise, stylesPromise]);
	}

	/**
	 * Generates the full HTML string for the currently active document body, and syncs it to the server.
	 * Also updates the local save through calling `syncDocLocal`.
	 *
	 * This is done so that when we generate patches for this HTML string later, we can be confident that the HTML string stored on the server
	 * has the same formatting and everything i.e. it is exactly identical to the string we're making patches for locally (and not just *functionally* identical).
	 *
	 * Note: ONLY syncs the document body― not any other document info, as it is expected this will only be called upon initial document loading (and so won't
	 * used for syncing any actual changes).
	 * TODO: Can add option to sync other document info as well.
	 */
	syncDocFull() {
		const documentID = getDocumentID(this.editorState());
		const docEl = this.getDocEl();
		if (documentID === null || !docEl) return;

		const [htmlStr] = reconstructHTMLString(docEl, {
			docNodes: this.docNodes,
			docContainer: docEl,
			includeContainer: false,
			includeHistoryNotBodyEls: true
		});
		generatePosNodes(this.docNodes, this.stringPosNodeMap);

		// console.log("🎈🎈🎈 Got HTML string:", htmlStr);

		let filteredHTMLStr = htmlStr;

		const changes: { start: number; len: number }[] = [];
		this.docNodes.forEach((nodeInfo, node) => {
			if (isHistoryNotBodyContainer(node))
				changes.push({
					start: nodeInfo.stringPos,
					len: nodeInfo.stringLen
				});
		});

		changes.sort((a, b) => b.start - a.start);

		changes.forEach(
			(change) =>
				(filteredHTMLStr =
					filteredHTMLStr.slice(0, change.start) + filteredHTMLStr.slice(change.start + change.len))
		);

		if (this.debug) {
			console.log('🎈🎈🎈 After changes: ', changes, ' Syncing htmlStr:\n\n', filteredHTMLStr);
		}

		this.syncingHTMLStr = filteredHTMLStr;
		this.syncDocLocal();

		// if (this.doServerSync)
		// 	fetch_('/documents/api/sync_document_full', {
		// 		method: 'post',
		// 		body: JSON.stringify({
		// 			id: documentID,
		// 			body: filteredHTMLStr
		// 		}),
		// 		keepalive: true
		// 	});
		if (this.doServerSync) {
			this.doFullSync()(`${documentID}`, filteredHTMLStr);
		}

		return htmlStr;
	}

	/**
	 * Applies queued patches to currently active document body.
	 *
	 * TODO: Also sync other document info when it changes, using the local save of that info (ideally the local save has some field like "dirty" which indicates whether there
	 *        are indeed changes that need to be synced).
	 */
	syncServerDocPatch(documentID: number | null): Promise<void> {
		if (documentID === null || !this.doServerSync) return Promise.resolve();

		const createFetch = () => {
			const patches = this.serverSyncPatchesQueue
				.filter((patch) => {
					return patch.correction !== -1;
				})
				.map((patch) => {
					return {
						index: patch.start - patch.correction,
						length: patch.length,
						value: patch.value
					};
				});

			// We also use the patches to find what we can store locally for the document
			this.syncingHTMLStr = applyPatches(
				this.syncingHTMLStr,
				patches.map((patch) => {
					return {
						str_: {
							start: patch.index,
							length: patch.length,
							value: patch.value
						}
					};
				})
			);
			this.syncDocLocal();

			if (this.debug) {
				console.log('Patches:', structuredClone(this.serverSyncPatchesQueue));
				console.log('App HTML string:\n-------------\n', this.appHTMLStr);
				console.log('New server HTML string (probably):\n---------------\n', this.syncingHTMLStr);
			}

			// const resp = fetch_('/documents/api/sync_document_patch', {
			// 	method: 'post',
			// 	body: JSON.stringify({
			// 		id: documentID,
			// 		patches,
			// 		complibver: doc.info.componentLibVer
			// 	})
			// });

			const resp = Promise.resolve(
				this.doPatchSync()(`${documentID}`, patches, {
					compLibVer: this.doc.info?.componentLibVer
				})
			);

			this.serverSyncPatchesQueue.splice(0, this.serverSyncPatchesQueue.length);
			return resp;
		};

		if (this.serverSyncPatchesQueue.length === 0) return Promise.resolve();

		if (this.prevFetch === null) this.prevFetch = createFetch();
		else this.prevFetch = this.prevFetch.then(createFetch);
		return this.prevFetch;
	}

	async syncDocMetadata(documentID: string, info: typeof this.doc.info) {
		if (!this.doServerSync || !info) return;
		console.log('DOING UPDATE OF METADATA');
		// const resp = await fetch_('/documents/api/update_document_metadata', {
		// 	method: 'post',
		// 	body: JSON.stringify({
		// 		id: info.id.trim(),
		// 		title: info.title,
		// 		description: info.description,
		// 		tags: info.tags,
		// 		accent: info.accent,
		// 		thumbnail: info.thumbnail,
		// 		status: info.status
		// 	})
		// });
		// if (!resp.ok) {
		// 	console.log('🎈', resp);
		// 	console.error(await resp.text());
		// 	return;
		// }

		// const data = await resp.json();

		const data = await this.doPatchSync()(documentID, [], info);

		// doc.info.title = data['title'];
		// doc.info.description = data['description'];
		// doc.info.tags = data['tags'];
		// doc.info.accent = data['accent'];
		// doc.info.thumbnail = data['thumbnail'];
		// doc.info.status = data['status'];
	}

	async syncDocStyles(documentID: string, styles: string) {
		if (!this.doServerSync) return;
		console.log('DOING UPDATE OF STYLES');
		// const resp = await fetch_('/documents/api/sync_development_stylesheet', {
		// 	method: 'post',
		// 	body: JSON.stringify({
		// 		id: doc.info.id,
		// 		stylesheet: styles
		// 	})
		// });
		// if (!resp.ok) {
		// 	console.error(await resp.text());
		// 	return;
		// }
		try {
			await this.doPatchSync()(documentID, [], { stylesheet: styles });
		} catch (err) {
			console.error(err);
		}

		// const dataStyles = await resp.text();
		// doc.styles = parseStylesheetStr(dataStyles);
	}

	syncDocLocal() {
		const documentID = getDocumentID(this.editorState());
		const docEl = this.getDocEl();
		if (documentID === null || !docEl) return;

		const docInfoContainer = docEl.querySelector('#doc-info');
		if (docInfoContainer) {
			// TODO: The plan is that other information about the document is stored as part of the HTML,
			//        in hidden elements at the top or bottom of the page.
			//        (that way undo/redo can work on it as well- and any state the editor can edit is just HTML; that seems elegant).
		}

		const savedInfo = localSave.current[`D:${documentID}`];
		if (!savedInfo) {
			if (!this.doc.info?.componentLibVer)
				throw new Error(
					`Tried creating entry in localSave for document of ID "${documentID}" in syncDocLocal, but couldn't as compLibVer.currentVer is null.`
				);
			localSave.current[`D:${documentID}`] = {
				id: `${documentID}`,
				lastUsed: Date.now(),
				body: this.syncingHTMLStr,
				compLibVer: this.doc.info.componentLibVer
			};
		} else if (!localSaveEntryIsDoc(savedInfo)) throw new Error("Entry wasn't for a document.");
		else {
			savedInfo.lastUsed = Date.now();
			savedInfo.body = this.syncingHTMLStr;
			savedInfo.compLibVer = this.doc.info?.componentLibVer;
			pruneLocalSave();
		}
	}

	/**
	 * Saves the component to persistent storage (locally). Used for saving both patches and full loads (distinguished by whether htmlStr is passed in or not).
	 * @param htmlStr Pass in the HTML string representing the component if it exists (which it should as this.makePatches() maintains it through updates). If it doesn't exist (i.e. when the component has been newly loaded in) then this function will generate it itself from the current document body, and populate this.docNodes and this.stringPosNodeMap in the process.
	 * @returns
	 */
	syncCompLocal(htmlStr?: string) {
		const componentID = getComponentID(this.editorState());
		const docEl = this.getDocEl();
		if (componentID === null || !docEl) return;

		const comp = this.comps.lib.find((comp) => comp.identName === componentID);
		if (!comp) return;

		// The reconstructHTMLString creates the HTML string for the document, taking
		//  into account masked attribute values, and also gives a mapping of nodes to
		//  their indexes and lengths in the generated HTML string, which allows us to
		//  manually insert "data-component" attributes without ever actually affecting
		//  the DOM.
		let nodeMap: DocNodeMap | undefined;
		if (htmlStr === undefined) {
			[htmlStr, nodeMap] = reconstructHTMLString(docEl, {
				docNodes: this.docNodes, // TODO: Should this be included here?
				docContainer: docEl,
				includeContainer: false,
				includeHistoryNotBodyEls: true
			});

			generatePosNodes(this.docNodes, this.stringPosNodeMap);
		}

		// We still call generateElCompContentStr for style-type components, as
		//  in that editor state we still want to have the document editing as a playground
		//  for seeing how styles affect the document.
		// const { content, parts } = generateElCompContentStr(
		//   docEl,
		//   htmlStr,
		//   nodeMap ?? this.docNodes,
		//   comp.name,
		// );

		if (comp.type === 'element') {
			const { content, parts } = generateElCompContentStr(
				docEl,
				htmlStr,
				nodeMap ?? this.docNodes,
				comp.name
			);

			updateCompEdit(componentID, { content, parts: parts.split('|') }, this.comps);
		} else if (comp.type === 'style') {
			const { content, parts } = generateStyleCompContentStr(this.doc.styles, comp.name);
			updateCompEdit(componentID, { content, parts: parts.split('|') }, this.comps);
		} else if (comp.type === 'svelte') {
			updateCompEdit(componentID, { content: this.doc.body }, this.comps);
		}

		return htmlStr;
	}
}

interface CreatePublishDocParams {
	svelteCompiler: SvelteCompiler;
}

export async function createPublishDoc(
	docEl: HTMLElement,
	stylesheets: (DynamicStylesheet<any> | string)[],
	p: CreatePublishDocParams
): Promise<{ bodyStr: string; stylesheetStr: string }> {
	const [htmlStr, nodeMap] = reconstructHTMLString(docEl, {
		docContainer: docEl,
		includeContainer: false,
		includeHistoryNotBodyEls: false
	});

	const strUpdates: { insert: string; length: number; index: number }[] = [];

	const compileInfo: CompilePublishInfo = [];

	nodeMap.entries().forEach(([node, info]) => {
		if (info.isEl && node instanceof Element) {
			if (node.hasAttribute('data-sveltecomp-source')) {
				const uuid = crypto.randomUUID();
				const parentEl = node.parentElement;
				if (!parentEl) {
					console.error("data-sveltecomp-source element somehow didn't have parentElement");
					return;
				}
				const parentDataID = parentEl.getAttribute('data-id');
				if (!parentDataID) {
					console.error("Parent of data-sveltecomp-source element didn't have data-id attribute.");
					return;
				}

				const children = Array.from(node.children);

				const codeEl = children.find((child) => child.hasAttribute('data-sveltecomp-code'));
				if (!codeEl) {
					console.error(
						"data-sveltecomp-source element didn't have a child data-sveltecomp-code element"
					);
					return;
				}
				const svelteCode = codeEl.textContent;

				const name = node.getAttribute('data-sveltecomp-compname') ?? 'component';

				const props: CompilePublishInfo[0]['props'] = [];
				children.forEach((child) => {
					const propname = child.getAttribute('data-sveltecomp-propname');
					if (!propname) return;
					const proptype = child.getAttribute('data-sveltecomp-proptype') ?? 'string';
					props.push({
						name: propname,
						type: proptype as 'string' | 'html' | 'dom' | 'snippet',
						value: proptype === 'string' ? child.textContent : child.innerHTML
					});
				});

				compileInfo.push({
					uuid,
					parentDataID,
					svelteCode,
					name,
					props
				});

				// Replace the source element with a comment containing nothing but the UUID
				//  (this UUID will be used by the generated script to mount the component)
				strUpdates.push({
					index: info.stringPos,
					length: info.stringLen,
					insert: `<!--${uuid}-->`
				});
			} else if (!closestAttribute(node, 'data-sveltecomp-source')) {
				// Patch out certain attributes of the element
				const newEl = document.createElement(node.localName);
				Array.from(node.attributes).forEach((attr) => {
					if ('data-complibver' === attr.name) return;
					if ('data-componentname' === attr.name) return;
					if ('data-iscompcontainer' === attr.name) return;
					if ('data-comppartblacklist' === attr.name) return;
					if ('data-compdisinherited' === attr.name) return;
					if (/^data-style-.*$/g.test(attr.name)) return;
					if (/^data-dummycompstyle.*$/g.test(attr.name)) return;
					if (/^data-override-.*$/g.test(attr.name)) return;

					newEl.setAttribute(attr.name, attr.value);
				});

				const [newTagStr] = getElementString(newEl);

				strUpdates.push({
					index: info.stringPos,
					length: info.startTagLen,
					insert: newTagStr
				});
			}
		}
	});

	let bodyStr = htmlStr;
	strUpdates.sort((a, b) => b.index - a.index);

	strUpdates.forEach(({ index, length, insert }) => {
		bodyStr = bodyStr.slice(0, index) + insert + bodyStr.slice(index + length);
	});

	// Create compilation
	const svelteReply = await p.svelteCompiler.compileForPublish(compileInfo);
	if (!svelteReply.ok) throw new Error('Compiling svelte-type components failed.');

	// TODO: Does this (svelteReply.code) need to be encoded or escaped in any way?
	bodyStr += '<script type="module">' + svelteReply.code + '</script>';

	let stylesheetStr = '';

	stylesheets.forEach((stylesheet) => {
		if (stylesheet instanceof DynamicStylesheet) {
			Array.from(stylesheet.stylesheet.cssRules).forEach((cssRule) => {
				stylesheetStr += cssRule.cssText + '\n\n';
			});
		} else {
			stylesheetStr += stylesheet + '\n\n';
		}
	});

	stylesheetStr += '\n\n' + svelteReply.css;

	return {
		bodyStr,
		stylesheetStr
	};
}
