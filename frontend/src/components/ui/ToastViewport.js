'use client';

import useToastStore from '@/store/toastStore';

export default function ToastViewport() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed bottom-2 right-2 z-50 space-y-1">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => remove(t.id)}
          className={`block px-3 py-2 text-xs border ${t.kind === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
