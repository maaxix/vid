import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import routesConfig from './data/routes.json';

import NotFound from './pages/NotFound';
import ErrorBoundary from './pages/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Define a fallback component for undefined components
const FallbackComponent = () => <div>Component not found</div>;

// Function to safely get component with fallback
const getSafeComponent = (componentName: keyof typeof pageComponents) => {
  return pageComponents[componentName] || FallbackComponent;
};

// Lazy-load page components
const pageComponents = {
  //NotFound: lazy(() => import('./pages/NotFound')),
  NotFound: NotFound,
  Home:                   lazy(() => import('./pages/Home')),
  About:                  lazy(() => import('./pages/About')),
  Contact:                lazy(() => import('./pages/Contact')),
  ProductList:            lazy(() => import('./pages/Products/ProductList')),
  ProductDetail:          lazy(() => import('./pages/Products/ProductDetail')),
  MediaServersPage:       lazy(() => import('./pages/media-servers/MediaServersPage')),
  MediaSearchPage:        lazy(() => import('./pages/media-servers/id/MediaSearchPage')),
  MediaServerSettingsPage:lazy(() => import('./pages/media-servers/id/settings/MediaServerSettingsPage')),
};

// Define route type (matching your JSON)
export type AppRoute = {
  path?: string;
  component: keyof typeof pageComponents;
  name?: string;
  icon:string;
  exact?: boolean;
  children?: AppRoute[];
};

// Function to recursively map JSON routes to RouteObject
const mapRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map(route => {
    const Component = getSafeComponent(route.component);
    
    // Validate required fields
    if (!route.path && !route.children) {
      console.error(`Route is missing path and has no children: ${route.component}`);
      return {
        path: '*',
        element: <NotFound />,
      };
    }

    return {
      path: route.path || undefined,
      element: (
        <ErrorBoundary fallback={<div>Error loading {route.name || route.component}</div>}>
          <Suspense fallback={<LoadingSpinner />}>
            <Component />
          </Suspense>
        </ErrorBoundary>
      ),
      ...(route.children ? { children: mapRoutes(route.children) } : {})
    };
  });
};

export const routes: RouteObject[] = mapRoutes(routesConfig as AppRoute[]);

export const getConfigRoute  = () => routesConfig as AppRoute[];
export const getRoutes = () => routes;
