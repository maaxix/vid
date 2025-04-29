"use client";

import { Modal } from '../../components/ui/CModal'
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: { name: string; url: string; apiKey: string };
  onSave: (data: { name: string; url: string; apiKey: string }) => void;
}

export function AddOrEditServerModal({
  open,
  onClose,
  initial,
  onSave,
}: Props) {
  const [form, setForm] = useState({ name: "", url: "", apiKey: "" });

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm({ name: "", url: "", apiKey: "" });
    }
  }, [initial]);

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} modalType="bottom">
      <h2 className="text-lg font-bold mb-4">
        {initial ? "Edit Server" : "Add Server"}
      </h2>

      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={!!initial}
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="URL"
        value={form.url}
        onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
      />
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="API Key"
        value={form.apiKey}
        onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
      />

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
