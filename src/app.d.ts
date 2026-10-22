// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type CaretPosition = {
		offsetNode: Node;
		offset: number;
	};

	interface Document {
		caretPositionFromPoint?(x: number, y: number): CaretPosition;
		caretRangeFromPoint?(x: number, y: number): Range | null;
	}
}

export {};
