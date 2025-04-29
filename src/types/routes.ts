import { ComponentType, LazyExoticComponent } from "react";

export interface RouteConfig {
  path: string;
  exact?: boolean;
  component: LazyExoticComponent<ComponentType<unknown>>;
  name: string;
  children?: RouteConfig[];
}