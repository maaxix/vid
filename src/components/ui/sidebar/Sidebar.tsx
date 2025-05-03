import { Link } from 'react-router-dom';

import { getConfigRoute } from '../../../Routes';
import SidebarOverlay from './SidebarOverlay';

import './Sidebar.css';

const onClickItem= () => {
    
}
const Sidebar = () => {
    const rotues = getConfigRoute();
  return (
    <>
        <SidebarOverlay/>

        <aside className="sidebar autoscrollhide" id="sidebar">
        <nav className="sidebar-nav">
            <div className="flex-col">
                {rotues
                .filter(item => item.name)
                .map((item, index) => (
                    <Link key={index} className="vitem" to={item.path||'/'} onClick={onClickItem}>
                        <i className={`icon icon-${item.icon}`}></i>
                        <span className="vlink">{item.name}</span>
                    </Link> 
                ))}            

            </div>
        </nav>
        </aside>
    </>
  );
};

export default Sidebar;