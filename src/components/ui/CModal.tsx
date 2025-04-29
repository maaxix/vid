'use client'

import { useEffect, useRef, useState } from 'react'


interface ModalProps {
  open: boolean
  onClose: () => void
  modalType?: 'center' | 'full' | 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
}

export function Modal({ open, onClose,  modalType = 'center', children}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setVisible(true)
      document.body.style.overflow = 'hidden'

      // Push a new state into browser history
      window.history.pushState({ modalOpen: true }, '')
    } else {
      const timeout = setTimeout(() => setVisible(false), 300)
      document.body.style.overflow = ''
      return () => clearTimeout(timeout)
    }
  }, [open])
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    //const onPopState = (e: PopStateEvent) => {
    const onPopState = () => {
      onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('popstate', onPopState)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('popstate', onPopState)
    }
  }, [onClose]);
  

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose()
        }
      }}
    >
      <div
        className={`box1 p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
          getModalPositionClass(modalType, open)
        }`}
        style={{ width: getModalWidth(modalType), height: getModalHeight(modalType) }}
      >
        {children}
      </div>
    </div>
  )
}

function getModalWidth(type: ModalProps['modalType']) {
  if (type === 'full') return '100%'
  if (['left', 'right'].includes(type || '')) return '300px'
  return '90%'
}

function getModalHeight(type: ModalProps['modalType']) {
  if (type === 'full') return '100%'
  if (['top', 'bottom'].includes(type || '')) return '300px'
  return 'auto'
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