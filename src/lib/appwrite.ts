import { Client, Account, Avatars, Databases } from 'appwrite';

const client = new Client();
client.setEndpoint('http://localhost/v1').setProject('almost-tminusdaily');

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

