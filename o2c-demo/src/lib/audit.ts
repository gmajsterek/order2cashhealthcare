import { AuditEntry } from './types';

const STORAGE_KEY = 'o2c_audit_log';

export function getAuditLog(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
  const newEntry: AuditEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  const log = getAuditLog();
  log.push(newEntry);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }
  
  return newEntry;
}

export function clearAuditLog(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAgentDecision(agentKey: string): AuditEntry | undefined {
  const log = getAuditLog();
  return log.filter(e => e.agentKey === agentKey).pop();
}
