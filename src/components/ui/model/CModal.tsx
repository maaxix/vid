'use client'

import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './modal.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  modalType?: 'center' | 'full' | 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
}

export function Modal({ open, onClose, modalType = 'center', children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
        onClose()}
    }

    // Save current location
    const currentPath = location.pathname + location.search

    // Push a dummy modal route (not used, just for history stack)
    navigate(currentPath + '#modal', { replace: false })

    //const handlePopState = (e: PopStateEvent) => {
    const handlePopState = () => {
      //if (e.state?.modalOpen) onClose()
      // Close modal if user hits "back"
      if (window.location.hash !== '#modal') {
        onClose()
      }
    }

    window.addEventListener('popstate', handlePopState)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handlePopState)

      // Clean up hash if still on modal
      if (window.location.hash === '#modal') {
        navigate(currentPath, { replace: true })
      }
    }
  }, [])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          navigate(-1);
          onClose()
        }
      }}
    >
      <div
        className={`modal-content box1 p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
          getModalPositionClass(modalType, open)
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

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
