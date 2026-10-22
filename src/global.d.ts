interface IncomingDocTag {
	name: string;
	description: string;
	accent: string;
	documentTitles: string[];
}

interface IncomingDoc {
	id: number;
	title: string;
	description: string;
	tags: [{ name: string; accent: string; description: string }];
	accent: string;
	thumbnail: string;
	date_created: string;
	date_updated: string;
	hearts: number;
	status: 'featured' | 'public' | 'unlisted' | 'private';
}
