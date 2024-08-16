<script>
	// @ts-nocheck

	/**
	 * @type {string | any[]}
	 * @description The markdown to parse.
	 */
	export let markDown = '';
	export let imageModules = {};
</script>

<div class="markdown">
	{#each markDown.split('\n') as line}
		{#if line.startsWith('# ')}
			<h1 class="md-h1">{line.replace('# ', '')}</h1>
		{:else if line.startsWith('## ')}
			<h2 class="md-h2">{line.replace('## ', '')}</h2>
		{:else if line.startsWith('### ')}
			<h3 class="md-h3">{line.replace('### ', '')}</h3>
		{:else if line.startsWith('#### ')}
			<h4 class="md-h4">{line.replace('#### ', '')}</h4>
		{:else if line.startsWith('!')}
			{#each Object.entries(imageModules) as [_path, module]}
				{#if _path.split('lib').pop() === line.split('(')[1].split(')')[0].replace('$lib', '')}
					<img src={module.default} alt={line.replace('![', '').split(']')[0]} class="md-img" />
				{/if}
			{/each}
		{:else if line.startsWith('[')}
			<a href={line.split('(')[1].replace(')', '')} class="md-a"
				>{line.replace('[', '').split(']')[0]}</a
			>
		{:else}
			<p class="md-p">{line}</p>
		{/if}
	{/each}
</div>
