'use client'

import { Modal } from './CModal'
import { useNavigate } from 'react-router-dom'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export function ConfirmModal({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?' }: ConfirmModalProps) {
  const navigate = useNavigate()

  if (!open) return null;

  const handleConfirm = () =>{
    onConfirm(); 
    navigate(-1);
    onClose(); 
  }
  const handleClose = () =>{
    navigate(-1);
    onClose(); 
  }
  return (
    <Modal open={open} onClose={onClose} modalType="center">
      <div className="card-title mb-4">{title}</div>
      <p className="mb-8">{message}</p>
      <div className="flex gap-3">
        <button onClick={handleClose} className="btn second">Cancel </button>
        <button onClick={handleConfirm} className="btn primary">Confirm</button>
      </div>
    </Modal>
  )
}
