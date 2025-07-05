export interface IField {
	name: [string, string];
	value: [string, null] | number;
	type: 'string' | 'integer';
	access: string[];
}
