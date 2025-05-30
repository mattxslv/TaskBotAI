/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Loader function for today's tasks
 */

/**
 * Node modules
 */
import { databases, Query } from "@/lib/appwrite";
import { startOfToday, startOfTomorrow } from "date-fns";

/**
 * Custom modules
 */
import { getUserId } from "@/lib/utils";

/**
 * Types
 */
import type { LoaderFunction } from "react-router";

/**
 * Environment variables
 */
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID

const getTasks = async () => {
  try {
    return await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      '6837f2da00305897d8ea',
      [
        Query.equal('completed', "false"), // Get only uncompleted tasks
        Query.and([
          Query.greaterThanEqual('due_date', startOfToday().toISOString()),
          Query.lessThan('due_date', startOfTomorrow().toISOString())
        ]), // Get tasks due today
        Query.equal('userId', getUserId()) // Get only tasks for the current user
      ]
    )
  } catch (err) {
    console.log(err);
    throw new Error('Error getting inbox tasks');
  }
}

const todayTaskLoader: LoaderFunction = async () => {
  const tasks = await getTasks();

  return { tasks }
}

export default todayTaskLoader;