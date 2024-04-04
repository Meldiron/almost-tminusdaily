<script lang="ts">
	import { cn } from '$lib/utils.js';
	import SvelteOtp from '@k4ung/svelte-otp';

	export let code = '';
</script>

<SvelteOtp
	separatorClass={cn('text-zinc-500')}
	inputClass={cn('!py-6 !w-full text-red-500 rounded-md text-zinc-900 !border-zinc-300 text-xl dark:bg-black dark:!border-zinc-700 dark:text-zinc-200')}
	bind:value={code}
	numberOnly
	numOfInputs={6}
	separator="-"
	onlyShowMiddleSeparator={true}
	disableDefaultStyle={false}
/>
