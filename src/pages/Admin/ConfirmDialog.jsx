import { useEffect } from 'react'

export default function ConfirmDialog({ title, message, confirmText = 'Xác nhận', danger, busy, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onCancel() }}>
      <div className="modal modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title" className="modal-title">{title}</h2>
        <p className="admin-muted">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-ghost-sm" onClick={onCancel} disabled={busy}>Huỷ</button>
          <button type="button" className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
