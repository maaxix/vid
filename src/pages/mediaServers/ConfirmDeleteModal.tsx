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
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded">
          Confirm
        </button>
      </div>
    </Modal>
  )
}
