import { CompLib, compLibEdits, savedComponents } from '../store.svelte.js';

// import { editorState } from '../url.svelte';
// import { componentTypeStrToNum } from './component.svelte';
import { assign } from '../helper.js';
import type {
	CompLibAddedEdit,
	CompLibEdit,
	CompLibModifiedEdit,
	Component,
	ComponentType,
	ComponentWithEditInfo,
	ComponentWithParts
} from '#lib/types.js';
// import { ident } from 'css-tree';
import type { CompLibInfo, DocumentEditorProps } from '../App.svelte';
import { componentHasParts } from './component.svelte.js';

// export interface CompParts {
// 	name: string;
// 	type: ComponentType;
// 	content: string;
// 	parts: string;
// 	description: string;
// 	tags: string;
// }
// type CompPartsKey = keyof CompParts;
// const keysList: Array<keyof CompLibModifiedEdit> = [
// 	'name',
// 	'type',
// 	'content',
// 	'description',
// 	'tags'
// ];

function compIsSame(comp1: Component, comp2: Component) {
	if (comp1.type !== comp2.type) return false;
	if (comp1.name !== comp2.name) return false;

	if (comp1.content !== comp2.content) return false;

	if (comp1.description !== comp2.description) return false;

	if (comp1.tags === undefined && comp2.tags !== undefined) return false;
	if (comp1.tags !== undefined && comp2.tags === undefined) return false;
	if (comp1.tags && comp1.tags.length !== comp2.tags?.length) return false;
	if (comp1.tags && comp1.tags.some((tag, i) => tag !== comp2.tags?.at(i))) return false;

	if (componentHasParts(comp1) && componentHasParts(comp2)) {
		if (comp1.parts.length !== comp2.parts.length) return false;
		if (comp1.parts.some((part, i) => part !== comp2.parts.at(i))) return false;
	}

	return true;
}

export function updateCompEdit(identName: string, update: Partial<Component>, comps: Comps) {
	const existingEditModifiedInfoI = compLibEdits.current.findIndex(
		(edit) => edit.state === 'modified' && edit.identName === identName
	);

	if (existingEditModifiedInfoI !== -1) {
		compLibEdits.current[existingEditModifiedInfoI] = assign(
			$state.snapshot(compLibEdits.current[existingEditModifiedInfoI]),
			update
		);

		const oldComp = comps.savedLib.find((comp) => comp.name === identName);
		const newComp = comps.lib.find((comp) => comp.identName === identName);

		if (oldComp && newComp && compIsSame(oldComp, newComp)) {
			// Remove edit object because it doesn't actually change anything
			compLibEdits.current.splice(existingEditModifiedInfoI, 1);
		} else if (!oldComp || !newComp) {
			console.warn(
				`modified component '${identName}' doesn't exist in the old component library or new component library`
			);
			console.log('savedLib:', $state.snapshot(comps.savedLib));
			console.log('newLib (savedLib with edits applied):', $state.snapshot(comps.lib));
		}
		return;
	}

	const existingEditAddedInfoI = compLibEdits.current.findIndex(
		(edit) => edit.state === 'added' && edit.identName === identName
	);

	if (existingEditAddedInfoI !== -1) {
		compLibEdits.current[existingEditAddedInfoI] = assign(
			$state.snapshot(compLibEdits.current[existingEditAddedInfoI]),
			update
		);
		return;
	}

	const existingComp = comps.savedLib.find((comp) => comp.name === identName);

	if (existingComp) {
		const newI =
			compLibEdits.current.push({
				identName: existingComp.name,
				state: 'modified',
				...update
			}) - 1;

		const oldComp = comps.savedLib.find((comp) => comp.name === identName);
		const newComp = comps.lib.find((comp) => comp.identName === identName);

		if (oldComp && newComp && compIsSame(oldComp, newComp)) {
			compLibEdits.current.splice(newI, 1);
		}
	} else {
		console.error(`Tried editing component that doesn't exist (identName '${identName}')`);
	}
}

// export function updateCompEdit(identName: string, update: Partial<Component>) {
// 	// console.log(`Updating component edit with name "${identName}"`, update);

// 	const currentLib = comps.savedLib;
// 	const newLib = comps.lib;
// 	// comps.savedLib;

// 	let i: number;
// 	// If the component already has an edit stored which is updating an existing component
// 	if (
// 		(i = compLibEdits.current.findIndex(
// 			(edit) => edit.state === 'modified' && edit.identName === identName
// 		)) !== -1
// 	) {
// 		newLib[i] = assign($state.snapshot(newLib[i]), update);

// 		const current = currentLib.find((comp) => comp.name === identName);
// 		if (!current)
// 			throw new Error(
// 				"compLibEdits is editing a component which doesn't exist in the current library"
// 			);

// 		const new_ = newLib[i];

// 		if (compIsSame(current, new_)) newLib.splice(i, 1);
// 	} else if (
// 		// If the component is being added, in which case change what is being added
// 		(i = newLib.findIndex((edit) => edit.state === 'added' && edit.identName === identName)) !== -1
// 	) {
// 		newLib[i] = assign($state.snapshot(newLib[i]), update);
// 		// For added component, their identifying name *is* their current name (because they had no previous name)
// 		// newLib[i] = assign($state.snapshot(newLib[i]), { name: identName });
// 	} else if (
// 		// If the component does not have an existing edit or is being added, then create a new edit
// 		(i = currentLib.findIndex((comp) => comp.name === identName)) !== -1
// 	) {
// 		// We only create the new edit if something is actually changing
// 		// const isSame = keysList.every(
// 		// 	(keyName) =>
// 		// 		update[keyName] === undefined ||
// 		// 		update[keyName] === null ||
// 		// 		currentLib[i][keyName] === update[keyName]
// 		// );
// 		// if (!compIsSame())
// 		// 	newLib.push({
// 		// 		state: 'modified',
// 		// 		identName: currentLib[i].name,
// 		// 		...update
// 		// 	});
// 	}
// }

export function updateCompAdd(add: Component) {
	// Generates a hexadeciaml number
	// (Math.random generates a float between 0 - 1, convert to hex with toString and slice the "0." at the start)
	const identName = Math.random().toString(16).slice(2);

	const newLibEdit: CompLibEdit = {
		state: 'added',
		identName,
		...add
	};
	compLibEdits.current.push(newLibEdit);
	return newLibEdit;
}

// export function updateCompAdd(add: { name: string; type: CompTypeStr } & Partial<CompParts>) {
// 	const newLib = compLibEdits.current;

// 	// Generates a hexadeciaml number
// 	// (Math.random generates a float between 0 - 1, convert to hex with toString and slice the "0." at the start)
// 	const identName = Math.random().toString(16).slice(2);

// 	const newLibEdit: (typeof compLibEdits.current)[0] = {
// 		editType: 'add',
// 		identName,
// 		...add
// 	};
// 	newLib.push(newLibEdit);
// 	return newLibEdit;
// }

export function updateCompRemove(identName: string, comps: Comps) {
	const addEditI = compLibEdits.current.findIndex(
		(edit) => edit.state === 'added' && edit.identName === identName
	);
	if (addEditI !== -1) {
		// We are removing a component that we were adding via an edit; we just remove it completely
		compLibEdits.current.splice(addEditI, 1);
	} else if (comps.savedLib.some((comp) => comp.name === identName)) {
		compLibEdits.current.push({
			state: 'removed',
			identName
		});
	} else {
		console.error(`Tried removing component that doesn't exist (identName '${identName}')`);
	}
}
export function updateCompRestore(identName: string) {
	const removeEditI = compLibEdits.current.findIndex(
		(edit) => edit.state === 'removed' && edit.identName === identName
	);
	if (removeEditI !== -1) {
		compLibEdits.current.splice(removeEditI, 1);
	} else {
		console.error(
			`Tried restoring component that doesn't exist as something removed (identName '${identName}')`
		);
	}
}

// export function updateCompRemove(identName: string) {
// 	const newLib = compLibEdits.current;
// 	const addedI = newLib.findIndex(
// 		(edit) => edit.editType === 'add' && edit.identName === identName
// 	);
// 	if (addedI !== -1) newLib.splice(addedI, 1);
// 	else
// 		newLib.push({
// 			editType: 'remove',
// 			identName: identName
// 		});
// }
// export function updateCompRestore(identName: string) {
// 	const newLib = compLibEdits.current;
// 	const i = newLib.findIndex((edit) => edit.editType === 'remove' && edit.identName === identName);
// 	if (i !== -1) newLib.splice(i, 1);
// }

/**
 * Modifies `baseLib`, applying the supplied `edits`, and returns `baseLib` along with `nameChanges`
 */
function applyCompLibEdits(baseLib: Component[], edits: CompLibEdit[]) {
	const nameChanges: [from: string, to: string][] = [];

	for (const edit of edits) {
		switch (edit.state) {
			case 'added':
				if (componentHasParts(edit)) {
					baseLib.push({
						name: edit.name,
						type: edit.type,
						content: edit.content,
						parts: edit.parts,
						description: edit.description,
						tags: edit.tags
					});
				} else {
					baseLib.push({
						name: edit.name,
						type: edit.type,
						content: edit.content,
						description: edit.description,
						tags: edit.tags
					});
				}
				break;
			case 'modified':
				const toEdit = baseLib.find((comp) => comp.name === edit.identName);
				if (!toEdit) {
					console.error(
						'doCompLib received modification for component not existant in component library.'
					);
					break;
				}

				if (edit.name !== undefined) {
					nameChanges.push([toEdit.name, edit.name]);
					toEdit.name = edit.name;
				}
				if (edit.description !== undefined) toEdit.description = edit.description;
				if (edit.tags !== undefined) toEdit.tags = edit.tags;
				if (edit.content !== undefined) toEdit.content = edit.content;
				if (edit.parts !== undefined && componentHasParts(toEdit)) toEdit.parts = edit.parts;

				break;
			case 'removed':
				const toRemoveI = baseLib.findIndex((comp) => comp.name === edit.identName);
				if (toRemoveI === -1) {
					console.error(
						'doCompLib received removal of component not existant in component library.'
					);
					break;
				}

				baseLib.splice(toRemoveI, 1);
				break;
		}
	}

	return { newCompLib: baseLib, nameChanges };
}

export function saveLibChanges(info: {
	message: string;
	description: string;
	submitBtn: HTMLButtonElement | null;
	doCompLibUpdate: DocumentEditorProps['doCompLibUpdate'];
	comps: Comps;
	compLib: CompLib;
}) {
	const edits = $state.snapshot(compLibEdits.current);

	const newVersion = crypto.randomUUID().replaceAll('-', '').slice(0, 8);

	const { newCompLib, nameChanges } = applyCompLibEdits(
		$state.snapshot(info.comps.savedLib),
		edits
	);

	const final: CompLibInfo = {
		version: newVersion,
		previousVersion: info.compLib.latestVer,
		components: newCompLib,
		nameChanges,
		message: info.message,
		description: info.description
	};

	console.log('Submitted update to component library', final);

	if (info.submitBtn) info.submitBtn.disabled = true;
	Promise.resolve(info.doCompLibUpdate(final))
		.then(() => {
			// If we're here, we assume the update was successful
			// Clear out all the saved edits
			compLibEdits.current.splice(0, compLibEdits.current.length);
			// Reload page so that the saved component library is refetched
			location.reload();
		})
		.catch((err) => {
			if (info.submitBtn) info.submitBtn.disabled = false;
		});
}

// export function saveLibChanges(msg: string, desc: string, submitBtn: HTMLButtonElement | null) {
// 	const edits = $state.snapshot(compLibEdits.current);

// 	type UpdateVal = {
// 		name?: string;
// 		type?: string;
// 		description?: string;
// 		tags?: string;
// 		content?: string;
// 		parts?: string[];
// 	};
// 	const nameToUpdateVal = (edit: (typeof edits)[0]): UpdateVal => {
// 		return {
// 			name: edit.name,
// 			type: edit.type ? componentTypeStrToNum(edit.type) : undefined,
// 			description: edit.description,
// 			tags: edit.tags,
// 			content: edit.content,
// 			parts: edit.parts?.split('|')
// 		};
// 	};

// 	const update: { [oldName: string]: UpdateVal } = {};
// 	edits
// 		.filter((edit) => edit.editType === 'edit')
// 		.forEach((edit) => {
// 			update[edit.identName] = nameToUpdateVal(edit);
// 		});

// 	const add: UpdateVal[] = [];
// 	edits
// 		.filter((edit) => edit.editType === 'add')
// 		.forEach((edit) => {
// 			add.push(nameToUpdateVal(edit));
// 		});

// 	const remove: string[] = [];
// 	edits
// 		.filter((edit) => edit.editType === 'remove')
// 		.forEach((edit) => {
// 			remove.push(edit.identName);
// 		});

// 	const final: { [key: string]: any } = {
// 		version: $state.snapshot(compLib.latestVer),
// 		message: msg,
// 		description: desc
// 	};
// 	if (Object.keys(update).length > 0) final.update = update;
// 	if (add.length > 0) final.add = add;
// 	if (remove.length > 0) final.remove = remove;

// 	if (submitBtn) submitBtn.disabled = true;

// 	console.log('Submitted update to component library', final);

// 	fetch_('/documents/api/update_components', {
// 		method: 'post',
// 		body: JSON.stringify(final)
// 	})
// 		.then((resp) => {
// 			if (!resp.ok) {
// 				if (submitBtn) submitBtn.disabled = false;
// 				return;
// 			}

// 			// Clear out all the saved edits when saving to server is successful
// 			compLibEdits.current.splice(0, compLibEdits.current.length);
// 			// Reload page so that the saved component library is refetched
// 			location.reload();
// 		})
// 		.catch((err) => {
// 			if (submitBtn) submitBtn.disabled = false;
// 		});
// }

export function discardLibChanges() {
	compLibEdits.current.splice(0);
	// Reload page so that the saved component library is refetched
	location.reload();
}

export class Comps {
	private editorState: () => DocumentEditorProps['editorState'];

	constructor(editorState: () => DocumentEditorProps['editorState']) {
		this.editorState = editorState;
	}

	/**
	 * The saved state of the currently selected component, or an empty object if not in component mode.
	 */
	savedCurrent: Component | null = $derived.by(() => {
		if (this.editorState().mode !== 'component') return null;
		const comps = $state.snapshot(savedComponents);
		let info = comps.find((comp) => comp.name === this.editorState().resourceName);
		return info ?? null;
	});

	/**
	 * The current state of the component being edited, merging saved info and unsaved edits.
	 */
	current: ComponentWithEditInfo | null = $derived.by(() => {
		if (!this.savedCurrent) {
			// the component currently selected does NOT exist in the saved component library; it could still have been added in an edit.
			const compAdded: CompLibEdit | undefined = compLibEdits.current.find(
				(edit) => edit.state === 'added' && edit.identName === this.editorState().resourceName
			);
			if (!compAdded) return null;
			else return compAdded as CompLibAddedEdit;
		} else {
			// The component currently selected exists in the saved component library; either it has been modified or it hasn't.
			let compEdit = compLibEdits.current.find(
				(edit) => edit.state === 'modified' && edit.identName === this.editorState().resourceName
			) ?? { state: 'unmodified', identName: this.savedCurrent.name };

			return assign(this.savedCurrent, compEdit);
		}
	});

	/**
	 * The list of components data as it is saved on the server.
	 */
	savedLib: Component[] = savedComponents;
	/**
	 * The list of components with edits applied.
	 */
	lib: ComponentWithEditInfo[] = $derived.by(() => {
		const savedComps = $state.snapshot(this.savedLib);

		// For example, when viewing a document who's component library isn't up to date in one tab,
		//  and making edits to the component library in another tab, we don't want those edits to be
		//  applied to the old component library in the tab where we're viewing the document.
		if (this.editorState().mode !== 'component') {
			const final: ComponentWithEditInfo[] = savedComponents.map((comp) =>
				assign(comp, { state: 'unmodified' as 'unmodified', identName: comp.name })
			);
			return final;
		}

		const newSavedComps: ComponentWithEditInfo[] = savedComps.map((comp) => {
			const edit = compLibEdits.current.find(
				(edit) => edit.state !== 'removed' && edit.identName === comp.name
			) ?? { state: 'unmodified', identName: comp.name };

			const updated = assign(comp, edit);

			if (
				compLibEdits.current.some(
					(edit) => edit.state === 'removed' && edit.identName === comp.name
				)
			)
				updated.state = 'removed';
			else if (edit) updated.state = 'modified';
			else updated.state = 'unmodified';

			return updated;
		});

		const added: ComponentWithEditInfo[] = $state
			.snapshot(compLibEdits.current)
			.filter((edit) => edit.state === 'added')
			.map((comp) => {
				const final = comp;
				final.state = 'added';
				return final;
			});

		return [...newSavedComps, ...added];
	});
}

// export const comps = new Comps();
