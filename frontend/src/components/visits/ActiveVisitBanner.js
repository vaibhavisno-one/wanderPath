'use client';

import Link from 'next/link';
import useVisitStore from '@/store/visitStore';

export default function ActiveVisitBanner() {
  const activeVisit = useVisitStore((s) => s.activeVisit);
  if (!activeVisit) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-400 text-xs p-2">
      <div className="max-w-6xl mx-auto flex gap-2 items-center">
        <span>Active check-in: {activeVisit.place?.name || activeVisit.place || activeVisit._id}</span>
        <Link href={`/place/${activeVisit.place?._id || activeVisit.place}`} className="underline">open place detail</Link>
        <Link href="/visits" className="underline">go to visits (check-out)</Link>
      </div>
    </div>
  );
}
