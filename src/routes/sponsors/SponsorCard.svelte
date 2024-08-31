<script>
	import logo from '$lib/images/Logo.png';
	import './Sponsors.css';
	/**
	 * @type {any[]}
	 */
	export let sponsorsList = [];
	export let tier = 0;
</script>

<div class="sponsorContent">
	{#if tier == 0}
		<p>Invalid tier configuration, must use int 1-4</p>
	{:else}
		{#each sponsorsList as sponsor, index}
			<div
				class={tier == 1
					? 'sponsorCard tierOne'
					: tier == 2
						? 'sponsorCard tierTwo'
						: tier == 3
							? 'sponsorCard tierThree'
							: 'sponsorCard tierFour'}
			>
				<div
					class={tier == 1
						? 'sponsorImgTierOne'
						: tier == 2
							? 'sponsorImgTierTwo'
							: tier == 3
								? 'sponsorImgTierThree'
								: 'sponsorImgTierFour'}
				>
					{#if sponsor.logo != undefined && sponsor.logo != ''}
						<img
							src={sponsor.logo}
							alt="sponsor Thumbnail"
							class="sponsorImg"
							style="margin-top: 3px; height: fit-content; max-width: 90%;"
						/>
					{:else}
						<img src={logo} alt="sponsor Thumbnail" class="sponsorImg" />
					{/if}
				</div>
				<div
					class={tier == 1
						? 'sponsorTxtTierOne'
						: tier == 2
							? 'sponsorTxtTierTwo'
							: tier == 3
								? 'sponsorTxtTierThree'
								: 'sponsorTxtTierFour'}
				>
					<h2>{sponsor.name}</h2>
					{#if tier >= 2}
						{#if tier >= 3}
							<hr class="bar" />
						{/if}
						<p><a href={sponsor.link}>Visit the {sponsor.name} page.</a></p>
						{#if tier == 4 && sponsor.description != undefined && sponsor.description != ''}
							<p>{sponsor.description}</p>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
