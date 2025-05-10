'use client'

import { useEffect, useRef } from 'react'
import './modal.css'

interface ModalProps {
  onClose: (canNavBack:boolean) => void
  modalType?: 'center' | 'full' | 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
}

export function Modal({ onClose, modalType = 'center', children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    //if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log("Modal handleKeyDown")
        onClose(true)
      }
    }
    const handlePopState = (e: PopStateEvent) => {
      console.log(`Modal handlePopState  ${window.location.hash}`)
      console.log(e.state);
      if(window.location.hash.endsWith("#modal")){
        //navigate(-1);
      }
       
      onClose(false);
    }

    window.addEventListener('popstate', handlePopState)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handlePopState)
      console.log("CModel close")
    }
  }, [])

  //if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose(true)
        }
      }}
    >
      <div
        className={`modal-content box1 p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
// className={`modal-content box1 autoscrollhide   sidebar-center`}
// autoscrollhide  animate-top sidebar-top
/*
        className={`modal-content box1 p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
          getModalPositionClass(modalType, true)
        }`}
*/

function getModalPositionClass(type: ModalProps['modalType'], open: boolean) {
  switch (type) {
    case 'top':
      return `${open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} mt-4`
    case 'bottom':
      return `${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} mb-4`
    case 'left':
      return `${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} ml-4`
    case 'right':
      return `${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} mr-4`
    case 'full':
      return `${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`
    case 'center':
    default:
      return `${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`
  }
}
