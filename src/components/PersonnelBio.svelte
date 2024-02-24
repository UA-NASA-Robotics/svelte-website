<script>
	/**
	 * @type {string | any[]}
	 * @description The list of personnel to display.
	 *
	 * Indices can include:
	 * "name"
	 * "image"
	 * "team_title"
	 * "degree"
	 * biography":
	 */
	export let Personnel = [];
</script>

<div class="officerContent">
	{#if Personnel.length <= 0}
		<div class="officerCard"><p>There are no biographies at this time.</p></div>
	{:else}
		{#each Personnel as officer, index}
			<div class={index % 2 == 0 ? 'officerCard' : 'officerCard officerCardReverse'}>
				{#if officer.image && officer.image.length > 0}
					<div class="officerImageDiv">
						<img src={officer.image} alt="officer Thumbnail" class="officerImg" />
					</div>
				{:else}
					<!-- Placeholder -->
					<div class="officerImageDiv">
						<img src="/src/lib/images/Logo.png" alt="officer Thumbnail" class="officerImg" />
					</div>
				{/if}

				<div class="officerText">
					<h2>{officer.name}</h2>
					<hr class="bar" />
					<div class="degreeTokenDiv">
						{#each officer.degree as degree}
							<div class="degreeToken">
								<p class="degreeTokenText">{degree}</p>
							</div>
						{/each}
					</div>
					<h3>{officer.team_title}</h3>
					<p>{officer.biography}</p>
				</div>
			</div>
		{/each}
	{/if}
</div>
