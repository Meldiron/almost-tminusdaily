<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	import { mediaQuery } from 'svelte-legos';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import type { PageData } from './$types';
	import { stringify } from 'qs';
	import { goto, invalidateAll } from '$app/navigation';
	import { CircleAlert } from 'lucide-svelte';
	import { databases } from '$lib/appwrite';

	export let data: PageData;

	const isDesktop = mediaQuery('(min-width: 768px)');

	let page = data.page;

	let count = data.reminders.total;
	$: perPage = data.limit;
	$: siblingCount = $isDesktop ? 1 : 0;

	let tabValue = data.filter;

	function onFilter(type: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', '1');
		params.set('filter', type);
		const queryString = stringify(Object.fromEntries(params));
		goto(`${window.location.pathname}?${queryString}`);
	}
	function onSort(type: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', '1');
		params.set('sort', type);
		const queryString = stringify(Object.fromEntries(params));
		goto(`${window.location.pathname}?${queryString}`);
	}
	function onPageSet(page: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', page.toString());
		const queryString = stringify(Object.fromEntries(params));
		goto(`${window.location.pathname}?${queryString}`);
	}
	function onPageChange(direction: number) {
		const params = new URLSearchParams(window.location.search);
		const currentPage = +(params.get('page') ?? '1');
		params.set('page', (currentPage + direction).toString());
		const queryString = stringify(Object.fromEntries(params));
		goto(`${window.location.pathname}?${queryString}`);
	}

	async function onDelete(reminderId: string) {
		await databases.deleteDocument('main', 'reminders', reminderId);
		await invalidateAll();
	}
</script>

<Tabs.Root bind:value={tabValue}>
	<div class="flex items-center">
		<Tabs.List>
			<Tabs.Trigger on:click={() => onFilter('all')} value="all">All</Tabs.Trigger>
			<Tabs.Trigger on:click={() => onFilter('daily')} value="daily" class="hidden sm:flex"
				>Daily</Tabs.Trigger
			>
			<Tabs.Trigger on:click={() => onFilter('weekly')} value="weekly" class="hidden sm:flex"
				>Weekly</Tabs.Trigger
			>
			<Tabs.Trigger on:click={() => onFilter('monthly')} value="monthly">Monthly</Tabs.Trigger>
			<Tabs.Trigger on:click={() => onFilter('yearly')} value="yearly" class="hidden sm:flex"
				>Yearly</Tabs.Trigger
			>
			<Tabs.Trigger on:click={() => onFilter('onetime')} value="onetime">One-time</Tabs.Trigger>
		</Tabs.List>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm" class="h-8 gap-1">
						<ListFilter class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Sort</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>Sort by</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.CheckboxItem
						on:click={() => onSort('dateDesc')}
						checked={data.sort === 'dateDesc'}>Most recent</DropdownMenu.CheckboxItem
					>
					<DropdownMenu.CheckboxItem
						on:click={() => onSort('dateAsc')}
						checked={data.sort === 'dateAsc'}>Oldest</DropdownMenu.CheckboxItem
					>
					<DropdownMenu.CheckboxItem
						on:click={() => onSort('nameDesc')}
						checked={data.sort === 'nameDesc'}>Name (A-Z)</DropdownMenu.CheckboxItem
					>
					<DropdownMenu.CheckboxItem
						on:click={() => onSort('nameAsc')}
						checked={data.sort === 'nameAsc'}>Name (Z-A)</DropdownMenu.CheckboxItem
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button size="sm" class="h-8 gap-1">
				<CirclePlus class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Reminder </span>
			</Button>
		</div>
	</div>
	<Tabs.Content value={tabValue} class="mt-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Reminders</Card.Title>
				<Card.Description>Manage your existing reminders used in the mail.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if data.reminders.documents.length > 0}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head align="center" class="w-[100px]">Time left</Table.Head>
								<Table.Head class="w-[100px]">Status</Table.Head>
								<Table.Head class="w-[100px]">
									<span class="sr-only">Actions</span>
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.reminders.documents as reminder}
								<Table.Row>
									<Table.Cell class="font-medium">{reminder.name}</Table.Cell>
									<Table.Cell align="center" class="font-medium">0 days</Table.Cell>
									<Table.Cell>
										<Badge variant="outline">{reminder.type}</Badge>
									</Table.Cell>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger asChild let:builder>
												<Button
													aria-haspopup="true"
													size="icon"
													variant="ghost"
													builders={[builder]}
												>
													<Ellipsis class="h-4 w-4" />
													<span class="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end">
												<DropdownMenu.Label>Actions</DropdownMenu.Label>
												<DropdownMenu.Item on:click={() => onDelete(reminder.$id)}>Delete</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<Alert.Root variant="default">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>No results found</Alert.Title>
						<Alert.Description>
							<Button href="/app/reminders" on:click={() => tabValue = 'all'} class="mt-3" variant="outline">Clear filters</Button>
						</Alert.Description>
					</Alert.Root>
				{/if}
			</Card.Content>
			{#if data.reminders.documents.length > 0}
			{#key data.pageId}
			<Card.Footer>
				<div class="flex flex-col items-center justify-center gap-y-2 w-full">
					<Pagination.Root {count} {perPage} {siblingCount} bind:page={page} let:pages let:currentPage>
						<Pagination.Content>
							<Pagination.Item>
								<Pagination.PrevButton on:click={() => onPageChange(-1)}>
									<ChevronLeft class="h-4 w-4" />
									<span class="hidden sm:block">Previous</span>
								</Pagination.PrevButton>
							</Pagination.Item>
							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
									<Pagination.Item>
										<Pagination.Ellipsis />
									</Pagination.Item>
								{:else}
									<Pagination.Item>
										<Pagination.Link on:click={() => onPageSet(page.value)} {page} isActive={currentPage === page.value}>
											{page.value}
										</Pagination.Link>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<Pagination.NextButton on:click={() => onPageChange(1)}>
									<span class="hidden sm:block">Next</span>
									<ChevronRight class="h-4 w-4" />
								</Pagination.NextButton>
							</Pagination.Item>
						</Pagination.Content>
					</Pagination.Root>
	
	
					<div class="text-xs text-muted-foreground text-center ml-2">
						Showing <strong>{data.reminders.total > 0 ? data.offset + 1 : 0}-{Math.min(data.offset + data.limit, data.reminders.total)}</strong> of
						<strong>{data.reminders.total}</strong> reminders
					</div>
				</div>
			</Card.Footer>
			{/key}
			{/if}
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
