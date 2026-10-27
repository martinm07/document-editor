<script lang="ts">
	import { DocumentEditor, type EditorState } from '#lib';

	const editorState: EditorState = $state({
		mode: 'document',
		resourceName: '1',
		documentRedirect: null
	});
</script>

<DocumentEditor
	{editorState}
	metaPropNames={{}}
	doChangePage={() => undefined}
	doFullSync={() => undefined}
	doPatchSync={() => undefined}
	doMediaUpload={() => ({ cancelUpload: () => undefined, getFilepath: () => '' })}
	doMediaRemove={() => undefined}
	doPublish={() => undefined}
	doCompLibUpdate={() => undefined}
	getDoc={() => ({ id: '1', body: '', stylesheet: '', compLibVer: '' })}
	getLatestCompLibVersion={() => ''}
	getCompLib={() => []}
	getAllUploadedMedia={() => []}
/>
