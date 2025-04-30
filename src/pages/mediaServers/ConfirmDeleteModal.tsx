'use client'

import { Modal } from '../../components/ui/CModal'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export function ConfirmModal({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?' }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} modalType="center">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="mb-4">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn second">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} className="btn primary">
          Confirm
        </button>
      </div>
    </Modal>
  )
}
