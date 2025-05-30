/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Loader function for projects
 */

/**
 * Node modules
 */
import { databases, Query } from "@/lib/appwrite";

/**
 * Custom modules
 */
import { getUserId } from "@/lib/utils";

/**
 * Environment variables
 */
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID

/**
 * Types
 */
import type { LoaderFunction } from "react-router";

const getProjects = async (_query: string) => {
  try {
    return await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      '6837f2a1001ee5f32120',
      [
        Query.orderDesc('$createdAt'),
        Query.limit(100),
        Query.equal('userId', getUserId())
      ]
    );
  } catch (err) {
    console.log(err);
    throw new Error('Error getting projects');
  }
}

const projectsLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const projects = await getProjects(query);

  return { projects }
}

export default projectsLoader;