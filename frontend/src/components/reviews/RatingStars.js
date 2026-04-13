'use client';

export default function RatingStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className={`text-sm ${n <= value ? 'font-bold' : 'text-gray-400'}`}>
          ★
        </button>
      ))}
    </div>
  );
}
