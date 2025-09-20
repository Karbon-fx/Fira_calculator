import { Client, Databases, Storage, ID } from 'appwrite';

// Create client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('68ce9f2b001760dc8113'); // Your Project ID

// Initialize services
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// Your IDs (the ones you copied)
export const DATABASE_ID = '68cea166003b58231772';
export const COLLECTION_ID = 'documents';
export const BUCKET_ID = '68cea0c3003a140f82d6';
