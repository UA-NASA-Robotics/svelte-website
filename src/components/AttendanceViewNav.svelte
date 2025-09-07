<script lang="ts">
	export let current: 'demographics' | 'members' | 'attendance' = 'demographics';
</script>

<nav class="subnav" aria-label="Attendance admin navigation">
	<a
		href="/attendance/view"
		class:active={current === 'demographics'}
		aria-current={current === 'demographics' ? 'page' : undefined}>Demographics</a
	>
	<a
		href="/attendance/view/members"
		class:active={current === 'members'}
		aria-current={current === 'members' ? 'page' : undefined}>Members</a
	>
	<a
		href="/attendance/view/attendance"
		class:active={current === 'attendance'}
		aria-current={current === 'attendance' ? 'page' : undefined}>Attendance</a
	>
</nav>

<style>
	.subnav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.25rem 0 1rem;
	}
	.subnav a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.7rem;
		border: 1px solid #e5e7eb;
		border-radius: 999px;
		text-decoration: none;
		color: #111827;
		background: #f9fafb;
	}
	.subnav a:hover {
		background: #f3f4f6;
	}
	.subnav a.active {
		background: #eef2ff;
		border-color: #c7d2fe;
		color: #3730a3;
		font-weight: 600;
	}

	:global(body.dark) .subnav a {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .subnav a:hover {
		background: var(--dark-bg-secondary);
	}
	:global(body.dark) .subnav a.active {
		background: #263149;
		border-color: #2e3a59;
		color: #a5b4fc;
	}
</style>
