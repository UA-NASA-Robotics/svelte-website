<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import MarkdownParser from '../../../components/MarkdownParser.svelte';
	import '/src/components/markDown.css';

	const imageModules = import.meta.glob(
		'$lib/images/robots/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
		{
			eager: true,
			query: {
				enhanced: true
			}
		}
	);

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<MarkdownParser markDown={data.props?.robotContent} {imageModules} />
