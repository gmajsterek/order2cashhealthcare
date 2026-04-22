'use client';

import { useEffect, useState } from 'react';
import { FileText, Clock, User, Shield } from 'lucide-react';
import { AuditEntry } from '../lib/types';
import { getAuditLog } from '../lib/audit';

interface AuditTrailProps {
  agentKey?: string;
  showAll?: boolean;
}

export default function AuditTrail({ agentKey, showAll }: AuditTrailProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    const log = getAuditLog();
    if (showAll) {
      setEntries([...log].reverse());
    } else if (agentKey) {
      setEntries(log.filter((e) => e.agentKey === agentKey).reverse());
    }
  }, [agentKey, showAll]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No audit entries yet. Complete the HITL gate to generate records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-slate-950 rounded-lg p-4 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-sky-400" />
              <span className="text-sky-400 font-bold">{entry.agent}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="h-3 w-3" />
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-green-400">ACTION: {entry.action}</div>
            <div className="text-amber-400">DECISION: {entry.decision}</div>
            <div className="flex items-center gap-1 text-slate-400">
              <User className="h-3 w-3" />
              <span>OPERATOR: {entry.user}</span>
            </div>
            <div className="text-slate-500 mt-2 border-t border-slate-800 pt-2">
              <div className="text-slate-600 mb-1">DATA PAYLOAD:</div>
              {Object.entries(entry.data).map(([key, val]) => (
                <div key={key} className="pl-2 text-slate-400">
                  <span className="text-slate-500">{key}: </span>
                  <span>{String(val)}</span>
                </div>
              ))}
            </div>
            <div className="text-slate-600 text-xs mt-1">ID: {entry.id}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
