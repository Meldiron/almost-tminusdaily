<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { account } from '$lib/appwrite';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { OTP } from '$lib/components/ui/otp';
	import { ID, type Models } from 'appwrite';

	enum Steps {
		SIGN_IN,
		OTP
	}

	let step = Steps.SIGN_IN;

	// Step: Sign-in
	let email = '';

	// Step: OTP
	let phrase: null | string = null;
	let userId: null | string = null;
	let code = '';

	// Global
	let submitting = false;

	async function submitEmail() {
		if (submitting) {
			return;
		}

		submitting = true;

		try {
			const token = await account.createEmailToken(ID.unique(), email, true);

			userId = token.userId;
			phrase = token.phrase;
			email = '';
			step = Steps.OTP;
		} catch (err: any) {
			alert(err.message.toString());
		} finally {
			submitting = false;
		}
	}

	async function submitOtp() {
		if (submitting) {
			return;
		}

		submitting = true;

		try {
			await account.createSession(userId ?? '', code);
			await invalidateAll();
			goto('/');
		} catch (err: any) {
			submitting = false;
			alert(err.message.toString());
		}
	}
</script>

<div class="h-full min-h-screen w-full lg:grid lg:grid-cols-2">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Authenticate</h1>
				<p class="text-balance text-muted-foreground">
					{step === Steps.SIGN_IN
						? 'Enter your email below to access your account'
						: 'Check your email inbox for one-time password'}
				</p>
			</div>

			{#if step === Steps.SIGN_IN}
				<form on:submit|preventDefault={submitEmail} class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">E-mail</Label>
						<Input
							bind:value={email}
							id="email"
							type="email"
							placeholder="me@example.com"
							required
						/>
					</div>
					<Button disabled={submitting} type="submit" class="w-full">Sign in</Button>
				</form>

				<div class="mt-4 text-center text-sm">
					You can register a new account too, by entering your email.
				</div>
			{/if}

			{#if step === Steps.OTP}
				<form on:submit|preventDefault={submitOtp} class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">One-time password</Label>
						<OTP bind:code={code} />
					</div>
					<Button disabled={submitting} type="submit" class="w-full">Login</Button>
				</form>

				<p>Your security phrase is <code
					class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				  >{phrase}</code>. Ensure same phrase is in your authentication email.</p>

				<div class="mt-4 text-center text-sm">
					Entered wrong email?
					<button on:click={() => (step = Steps.SIGN_IN)} class="underline"> Use different </button>
				</div>
			{/if}
		</div>
	</div>
	<div class="hidden bg-muted lg:block"></div>
</div>
