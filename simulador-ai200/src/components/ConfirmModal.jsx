export default function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-panel border border-stroke rounded-xl shadow-2xl p-5">
        <h3 className="font-semibold text-slate-50 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-danger/10 border border-danger/40 text-danger hover:bg-danger hover:text-white text-sm font-medium transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
