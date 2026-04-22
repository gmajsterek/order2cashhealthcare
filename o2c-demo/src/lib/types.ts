export interface AuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  agentKey: string;
  action: string;
  decision: string;
  data: Record<string, unknown>;
  user: string;
}

export interface AgentState {
  status: 'idle' | 'processing' | 'awaiting_hitl' | 'completed' | 'error';
  processingSteps: string[];
  currentStep: number;
  hitlDecision?: string;
  auditEntries: AuditEntry[];
}

export interface OrderData {
  orderId: string;
  patientId: string;
  protocol: string;
  site: string;
  lab: string;
  sampleType: string;
  tubes: number;
  temperature: string;
  pickupWindow: string;
  handling: string[];
  physicianNPI?: string;
  status: string;
}
