import { PLACE_STATES } from '@/lib/state';

const styleMap = {
  [PLACE_STATES.VERIFIED]: 'bg-green-100 border-green-500 text-green-800',
  [PLACE_STATES.PENDING]: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  [PLACE_STATES.REJECTED]: 'bg-red-100 border-red-500 text-red-800',
};

export default function PlaceStatusBadge({ state }) {
  return <span className={`px-1 py-0.5 border text-[10px] uppercase ${styleMap[state] || styleMap.pending}`}>{state}</span>;
}
