
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

import './Layout.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header/>  
      <div className="main-container">
        <Sidebar/>
        <div className="main-content">
          <main className="main">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

export function toggleSidebar() {
  const CLASS_OPENED = "sidebar-opened";
  const CLASS_POPUP = "sidebar-popup";
  const CONFIG_SIDEBAR = "app_sidebar";

  const classList = document.body.classList;
  if (window.innerWidth <= 769) {
    // mobile width Resolution is 1024x768 or above
    classList.toggle(CLASS_POPUP);
    return;
  }
  if (classList.contains(CLASS_OPENED)) {
    classList.remove(CLASS_OPENED);
    localStorage.setItem(CONFIG_SIDEBAR, "0");
  } else {
    classList.add(CLASS_OPENED);
    localStorage.setItem(CONFIG_SIDEBAR, "1");
  }
  //document.documentElement.classList.toggle("sidebar-opened");
}

export function toggleTheme() {
  const CLASS_DARK = "dark";
  const CONFIG_THEME = "app_theme";

  const classList = document.documentElement.classList;
  if (classList.contains(CLASS_DARK)) {
    classList.remove(CLASS_DARK);
    localStorage.setItem(CONFIG_THEME, "");
  } else {
    classList.add(CLASS_DARK);
    localStorage.setItem(CONFIG_THEME, CLASS_DARK);
  }
}