/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Loader function for project detail
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
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Types
 */
import type { LoaderFunction } from "react-router";

const getProject = async (projectId: string) => {
  try {
    const project = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      '6837f2a1001ee5f32120',
      projectId
    );

    if (project.userId !== getUserId()) {
      throw new Error('Unauthorized');
    }

    return project;
  } catch (err) {
    console.log('Error getting project: ', err);

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error('Error getting project');
  }
}

const getProjectTasks = async (projectId: string) => {
  return await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    '6837f2da00305897d8ea',
    [
      Query.equal('project', projectId),
      Query.equal('userId', getUserId()),
      Query.orderAsc('due_date'),
    ]
  );
};

const projectDetailLoader: LoaderFunction = async ({ params }) => {
  const { projectId } = params as { projectId: string }
  console.log('Requested projectId:', projectId);

  const project = await getProject(projectId);
  const tasks = await getProjectTasks(projectId);

  return { project, tasks }
}

export default projectDetailLoader;