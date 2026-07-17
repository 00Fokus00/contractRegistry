import React from 'react';
import { Button } from '@consta/uikit/Button';

export default function ConfirmModal({ open, title, description, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <Button label="Отмена" view="ghost" onClick={onCancel} disabled={loading} />
          <Button label="Удалить" view="primary" form="round" onClick={onConfirm} loading={loading} />
        </div>
      </div>
    </div>
  );
}
