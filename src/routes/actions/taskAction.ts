import { databases } from "@/lib/appwrite";
import { generateID, getUserId } from "@/lib/utils";
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TASKS_COLLECTION_ID = '6837f2da00305897d8ea';

export const taskAction = async ({ request }: { request: Request }) => {
  const data = await request.json();
  if (request.method === 'POST') {
    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      TASKS_COLLECTION_ID,
      generateID(),
      {
        ...data,
        userId: getUserId(),
      }
    );
    // Redirect back to the project page
    return null;
  }
  throw new Error('Invalid method');
};
export default taskAction;