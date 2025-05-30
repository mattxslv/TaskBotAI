/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Task form dialog component for the app
 */

/**
 * Node modules
 */
import { useState, useEffect } from 'react';
import { useLocation, useFetcher } from 'react-router';
import { startOfToday } from 'date-fns';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';

import { useProjects } from '@/contexts/ProjectContext'; // Add this import if you want to resolve project by route

/**
 * Types
 */
import type { PropsWithChildren } from 'react';

const TaskFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const fetcher = useFetcher();
  const projects = useProjects();

  const [open, setOpen] = useState(false);

  // Try to extract projectId from the URL if on a project page
  let projectId: string | null = null;
  if (location.pathname.startsWith('/app/projects/')) {
    projectId = location.pathname.split('/').pop() || null;
  }

  // Find the project in context if projectId is present
  let projectRef: string | null = null;
  if (projectId && projects?.documents) {
    const found = projects.documents.find((p) => p.$id === projectId);
    projectRef = found ? found.$id : null;
  }

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'q') {
        const target = event.target as HTMLElement;
        if (target.localName === 'textarea') return;

        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='p-0 border-0 !rounded-xl'>
        <TaskForm
          defaultFormData={{
            content: '',
            due_date:
              location.pathname === '/app/today' ? startOfToday() : null,
            project: projectRef, // Use the resolved project ID or null
          }}
          mode='create'
          onCancel={() => setOpen(false)}
          onSubmit={(formData) => {
            fetcher.submit(JSON.stringify(formData), {
              action: '/app/inbox',
              method: 'POST',
              encType: 'application/json',
            });

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
