import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
    const data = await parent();

    if(data.user === null) {
		redirect(307, '/auth/sign-in');
    } else {
		redirect(307, '/app');
    }
};