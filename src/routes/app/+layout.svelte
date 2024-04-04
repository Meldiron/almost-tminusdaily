<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Home from 'lucide-svelte/icons/home';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import { page } from '$app/stores';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { resetMode, setMode } from 'mode-watcher';
	import type { PageData } from './$types';
	import { account, avatars } from '$lib/appwrite';
	import { Calendar, Hourglass } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';

	export let data: PageData;

	const userImage =
		data.user === null
			? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
			: avatars.getInitials(data.user.email, 128, 128).toString();

	async function onLogout() {
		await account.deleteSession('current');
		await invalidateAll();
		goto('/');
	}

	const links = [
		{
			name: 'Dashboard',
			link: '/app',
			icon: Home
		},
		{
			name: 'Reminders',
			link: '/app/reminders',
			icon: Calendar
		}
	];

	let isOpen = false;

    function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="/"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
			>
				<Hourglass class="h-4 w-4 transition-all group-hover:scale-110" />
				<span class="sr-only">Almost T-Minus Daily</span>
			</a>
			{#each links as link}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href={link.link}
							class={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors transition-colors hover:text-foreground md:h-8 md:w-8 ${$page.route.id === link.link ? 'bg-accent text-accent-foreground' : 'hover:text-foreground'}`}
							use:builder.action
							{...builder}
						>
							<svelte:component this={link.icon} class="h-5 w-5" />

							<span class="sr-only">{link.name}</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">{link.name}</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</nav>
		<!-- <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="##"
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<Settings class="h-5 w-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav> -->
	</aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Sheet.Root bind:open={isOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="/"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<Hourglass class="h-5 w-5 transition-all group-hover:scale-110" />
							<span class="sr-only">Almost T-Minus Daily</span>
						</a>
						{#each links as link}
							<a
								on:click={() => (isOpen = false)}
								href={link.link}
								class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							>
								<svelte:component this={link.icon} class="h-5 w-5" />
								{link.name}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/app">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>

                    {#if $page.route.id?.split('/')[2]}
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{capitalizeFirstLetter($page.route.id?.split('/')[2])}</Breadcrumb.Page>
					</Breadcrumb.Item>
                    {/if}
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="relative ml-auto flex-1 md:grow-0"></div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						size="icon"
						class="overflow-hidden rounded-full"
					>
						<img src={userImage} width={40} height={40} alt="Avatar" class="overflow-hidden" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<a href="/app/settings"><DropdownMenu.Item>Settings</DropdownMenu.Item></a>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={onLogout}>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<slot />
		</main>
	</div>
</div>
