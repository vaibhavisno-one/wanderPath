'use client';

import ApproveRejectButtons from '@/components/admin/ApproveRejectButtons';

function QueueRow({ item, onDone }) {
  const target = item.targetId || {};
  return (
    <tr className="border-b align-top">
      <td className="p-1">{item.type}</td>
      <td className="p-1">{item.status}</td>
      <td className="p-1 text-[11px]">
        {item.targetModel === 'Place' && <div>{target.name} · {target.city}</div>}
        {item.targetModel === 'Review' && <div>{target.rating}/5 · {target.comment}</div>}
        {item.targetModel === 'Visit' && <div>{target._id}</div>}
      </td>
      <td className="p-1"><ApproveRejectButtons adminId={item._id} onDone={onDone} /></td>
    </tr>
  );
}

export default function QueueTable({ items, onDone }) {
  if (!items?.length) return <p className="text-xs">No pending items.</p>;
  return (
    <table className="w-full text-xs border">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="text-left p-1">type</th>
          <th className="text-left p-1">status</th>
          <th className="text-left p-1">target</th>
          <th className="text-left p-1">action</th>
        </tr>
      </thead>
      <tbody>{items.map((item) => <QueueRow key={item._id} item={item} onDone={onDone} />)}</tbody>
    </table>
  );
}
