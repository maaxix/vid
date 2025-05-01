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
      <div className="card-title mb-4">
        {initial ? "Edit Server" : "Add Server"}
      </div>

      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        disabled={!!initial}
      />
      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        placeholder="URL"
        value={form.url}
        onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
      />
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="API Key"
        value={form.apiKey}
        onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
      />

      <div className="flex gap-3">
        <button onClick={onClose} className="btn second">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="btn primary"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
