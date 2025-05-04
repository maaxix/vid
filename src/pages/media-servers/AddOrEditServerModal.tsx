"use client";
import { useNavigate } from 'react-router-dom'

import { Modal } from '@/components/ui/model/CModal'
import { useState, useEffect } from "react";

import mediaServersService ,{ ServerEntry} from './MediaServersService';


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
  const navigate = useNavigate()
  const [form, setForm] = useState<ServerEntry>({ name: "", url: "", apiKey: "" });
  const [errors, setErrors] = useState<Record<string, string>>({name: "", url: "", apiKey: ""});

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm({ name: "", url: "", apiKey: "" });
    }
  }, [initial]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error if exists when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    const validateResult = mediaServersService.validateForm(form)
    if (!validateResult._error) {
      mediaServersService.saveServer(form);
      navigate(-1);
      onSave(form);
    }
    else {
      setErrors(validateResult);
    }
  };

  const handleClose = () =>{
    navigate(-1);
    onClose();
  }
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} modalType="bottom">
      <div className="card-title mb-4">{initial ? "Edit Server" : "Add Server"}</div>

      <div className="w-full min-w-500">
        <div className="fld">
          <input
            type="text"
            name="name"
            className={`fld-input ${errors.name ? "border-red-500" : ""}`}
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            disabled={!!initial}
          />
          {errors.name && <div className="fld-error text-red-500 text-sm mb-2">{errors.name}</div>}
        </div>
        <div className="fld">
          <input
            type="text"
            name="url"
            className={`fld-input border p-2 rounded w-full mb-1 ${errors.url ? "border-red-500" : ""}`}
            placeholder="URL"
            value={form.url}
            onChange={handleChange}
          />
          {errors.url && <div className="fld-error text-red-500 text-sm mb-2">{errors.url}</div>}
        </div>
        <div className="fld">
          <input
            type="text"
            name="apiKey"
            className={`fld-input border p-2 rounded w-full mb-1 ${errors.apiKey ? "border-red-500" : ""}`}
            placeholder="API Key"
            value={form.apiKey}
            onChange={handleChange}
          />
          {errors.apiKey && <div className="fld-error text-red-500 text-sm mb-2">{errors.apiKey}</div>}
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <button onClick={handleClose} className="btn second">Cancel</button>
          <button onClick={handleSave} className="btn primary">Save</button>
        </div>
      </div>


    </Modal>
  );
}
