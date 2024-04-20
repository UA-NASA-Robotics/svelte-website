<script>
	import './SideBySide.css';
	/**
	 * @type {string | any[]}
	 * @description The list of items to display.
	 *
	 * Indices can include:
	 * "name"
	 * "image url"
	 * "description":
	 */
	export let Items = [];
</script>

<div class="cardContent">
	{#if Items.length <= 0}
		<div class="itemCard"><p>There are no items at this time.</p></div>
	{:else}
		{#each Items as item, index}
			<div class={index % 2 == 0 ? 'itemCard' : 'itemCard itemCardReverse'}>
				{#if item.image && item.image.length > 0}
					<div class="itemImageDiv">
						<img src={item.image} alt="item Thumbnail" class="itemImg" />
					</div>
				{:else}
					<!-- Placeholder -->
					<div class="itemImageDiv">
						<img src="/src/lib/images/Logo.png" alt="item Thumbnail" class="itemImg" />
					</div>
				{/if}

				<div class="itemText">
					<h2>{item.name}</h2>
					<hr class="bar" />
					<p>{item.description}</p>
				</div>
			</div>
		{/each}
	{/if}
</div>
