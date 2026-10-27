export type MaybePromise<T extends unknown> = T | Promise<T>;

///////////////////////

type ComponentType = 'element' | 'style' | 'color' | 'svelte' | 'media';

interface ComponentMeta {
	name: string;
	type: ComponentType;
	description?: string;
	tags?: string[];
}

export interface ComponentWithParts extends ComponentMeta {
	type: Exclude<ComponentType, 'svelte'>;
	content: string;
	parts: string[];
}

export interface ComponentWithoutParts extends ComponentMeta {
	type: Extract<ComponentType, 'svelte'>;
	content: string;
}

export type Component = ComponentWithParts | ComponentWithoutParts;

///

export type CompLibUnmodifiedEdit = { identName: string; state: 'unmodified' };
export type CompLibRemoveEdit = { identName: string; state: 'removed' };
export type CompLibModifiedEdit = Partial<Component & { parts?: string[] }> & {
	identName: string;
	state: 'modified';
};
export type CompLibAddedEdit = Component & { identName: string; state: 'added' };

export type CompLibEdit =
	CompLibUnmodifiedEdit | CompLibRemoveEdit | CompLibModifiedEdit | CompLibAddedEdit;

export type ComponentWithEditInfo = Component & {
	identName: string;
	state: 'unmodified' | 'modified' | 'added' | 'removed';
};

export type ComponentWithOptionalEditInfo = Component & {
	identName?: string;
	state?: 'unmodified' | 'modified' | 'added' | 'removed';
};

export interface CompLibUpgrade {
	message: string;
	description?: string;
	edits: CompLibEdit[];
}

//////////////////

export interface EditorDocument<Meta extends { [key: string]: any }> extends Meta {
	id: string;
	body: string;
	stylesheet: string;
	compLibVer: string;
}

export type DocumentMetaUpdate<Meta extends { [key: string]: any }> = Partial<Meta> & {
	id?: string;
	stylesheet?: string;
	compLibVer?: string;
};

export interface DocumentPatch {
	index: number;
	length: number;
	value: string;
}
