'use client'

function closeSidebar(){
    document.body.classList.remove("sidebar-popup")
}

export default function SidebarOverlay() {
  return (
    <div className="sidebar-overlay" onClick={closeSidebar}></div>

  )
}

