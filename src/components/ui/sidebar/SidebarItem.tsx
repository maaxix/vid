import { Link } from 'react-router-dom';
import './Sidebar.css';

interface SidebarItemProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarItem = ({ to, children, onClick }: SidebarItemProps) => {
  return (

      <Link 
        to={to} 
        className="sidebar-link"
        onClick={onClick}
      >
        {children}
      </Link>

  );
};

export default SidebarItem;