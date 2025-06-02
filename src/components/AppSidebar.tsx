/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Sidebar component for the app
 */

/**
 * Node modules
 */
import { Link, useLocation, useLoaderData } from 'react-router';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useNavigate } from 'react-router';

/**
 * Components
 */
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarGroupAction,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import TaskFormDialog from '@/components/TaskFormDialog';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import ProjectActionMenu from '@/components/ProjectActionMenu';
import { firebaseApp } from '@/lib/firebase';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

/**
 * Hooks
 */
import { useSidebar } from '@/components/ui/sidebar';
import { useProjects } from '@/contexts/ProjectContext';

/**
 * Constants
 */
import { SIDEBAR_LINKS } from '@/constants';

/**
 * Assets
 */
import {
  CirclePlus,
  Plus,
  ChevronRight,
  Hash,
  MoreHorizontal,
} from 'lucide-react';

/**
 * Types
 */
import type { AppLoaderData } from '@/routes/loaders/appLoader';

// Helper to render profile image or fallback icon
const getProfileImage = (user: FirebaseUser | null) => {
  if (user && user.photoURL) {
    // Google profile image
    return (
      <img
        src={user.photoURL}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  // Fallback: generic person/incognito SVG icon
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-lg text-gray-500">
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path
          d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const projects = useProjects();
  const navigate = useNavigate();

  const { taskCounts } = useLoaderData() as AppLoaderData;

  const { isMobile, setOpenMobile } = useSidebar();

  // Add user state for Firebase Auth
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    navigate('/', { replace: true }); // Redirect to login after logout
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to='/app/inbox'
          className='p-2'
        >
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Task create button */}
              <SidebarMenuItem>
                <TaskFormDialog>
                  <SidebarMenuButton className='!text-primary'>
                    <CirclePlus /> Add task
                  </SidebarMenuButton>
                </TaskFormDialog>
              </SidebarMenuItem>

              {/* Sidebar links */}
              {SIDEBAR_LINKS.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <Link to={item.href}>
                      <item.icon />

                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>

                  {/* Show task count in inbox menu items */}
                  {item.href === '/app/inbox' &&
                    Boolean(taskCounts.inboxTasks) && (
                      <SidebarMenuBadge>
                        {taskCounts.inboxTasks}
                      </SidebarMenuBadge>
                    )}

                  {item.href === '/app/today' &&
                    Boolean(taskCounts.todayTasks) && (
                      <SidebarMenuBadge>
                        {taskCounts.todayTasks}
                      </SidebarMenuBadge>
                    )}

                  {item.href === '/app/upcoming' && Boolean(taskCounts.upcomingTasks) && (
                    <SidebarMenuBadge>
                      {taskCounts.upcomingTasks}
                    </SidebarMenuBadge>
                  )}

                  {item.href === '/app/completed' && Boolean(taskCounts.completedTasks) && (
                    <SidebarMenuBadge>
                      {taskCounts.completedTasks}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* All projects */}
        <Collapsible
          defaultOpen
          className='group/collapsible'
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className='text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            >
              <CollapsibleTrigger>
                <ChevronRight className='me-2 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                Projects
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            {/* Project create button */}
            <Tooltip>
              <ProjectFormDialog method='POST'>
                <TooltipTrigger asChild>
                  <SidebarGroupAction aria-label='Add project'>
                    <Plus />
                  </SidebarGroupAction>
                </TooltipTrigger>
              </ProjectFormDialog>

              <TooltipContent side='right'>Add project</TooltipContent>
            </Tooltip>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects?.documents
                    .slice(0, 5)
                    .map(({ $id, name, color_name, color_hex }) => (
                      <SidebarMenuItem key={$id}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            location.pathname === `/app/projects/${$id}`
                          }
                          onClick={() => {
                            if (isMobile) setOpenMobile(false);
                          }}
                        >
                          <Link to={`/app/projects/${$id}`}>
                            <Hash color={color_hex} />

                            <span>{name}</span>
                          </Link>
                        </SidebarMenuButton>

                        <ProjectActionMenu
                          defaultFormData={{
                            id: $id,
                            name,
                            color_name,
                            color_hex,
                          }}
                          side='right'
                          align='start'
                        >
                          <SidebarMenuAction
                            aria-label='More actions'
                            showOnHover
                            className='bg-sidebar-accent'
                          >
                            <MoreHorizontal />
                          </SidebarMenuAction>
                        </ProjectActionMenu>
                      </SidebarMenuItem>
                    ))}

                  {projects !== null && projects.total > 5 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className='text-muted-foreground'
                        isActive={location.pathname === '/app/projects'}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <Link to='/app/projects'>
                          <MoreHorizontal /> All projects
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {!projects?.total && (
                    <SidebarMenuItem>
                      <p className='text-muted-foreground text-sm p-2'>
                        Click + to add some projects
                      </p>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent transition">
                {getProfileImage(user)}
                <span className="truncate text-left flex-1">
                  {user.displayName || user.email}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;