import { useState, useCallback } from 'react';
import { ClipboardCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentProcessing from '../../components/AgentProcessing';
import HITLGate from '../../components/HITLGate';
import AuditTrail from '../../components/AuditTrail';
import PipelineProgress from '../../components/PipelineProgress';
import { addAuditEntry, getAgentDecision } from '../../lib/audit';
import { PROCESSING_STEPS, HITL_SCENARIOS } from '../../data/synthetic';

export default function OrderCapturePage() {
  const existing = getAgentDecision('order-capture');
  const [phase, setPhase] = useState<'processing' | 'hitl' | 'complete'>(
    existing ? 'complete' : 'processing'
  );
  const [auditKey, setAuditKey] = useState(0);
  const [approvedDecision, setApprovedDecision] = useState<Record<string, string> | undefined>(
    existing?.data as Record<string, string> | undefined
  );

  const handleProcessingComplete = useCallback(() => {
    if (!existing) setPhase('hitl');
  }, [existing]);

  const handleApprove = (decision: Record<string, string>) => {
    addAuditEntry({
      agent: 'Order Capture & Validation Agent',
      agentKey: 'order-capture',
      action: 'HITL_APPROVAL: Physician NPI Entry & Order Validation Override',
      decision: `NPI ${decision.physicianNPI} entered by operator. Override: ${decision.overrideReason || 'Standard Entry'}`,
      data: { ...decision, orderId: 'ORD-2024-HC-7734', protocol: 'ONCOTRIAL-2024-B', billabilityProfile: 'CLINICAL_TRIAL_STANDARD' },
      user: 'Demo Operator',
    });
    setApprovedDecision(decision);
    setPhase('complete');
    setAuditKey((k) => k + 1);
  };

  const scenario = HITL_SCENARIOS['order-capture'];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PipelineProgress currentStep="order-capture" />
      
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent 1: Order Capture & Validation</h1>
            <p className="text-slate-500">Protocol/specimen validation, billability assignment, and HITL exception resolution</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">🤖 Agent Processing</h2>
          <AgentProcessing
            steps={PROCESSING_STEPS['order-capture']}
            onComplete={handleProcessingComplete}
            agentName="OrderCaptureAgent v2.4"
          />
        </div>

        {(phase === 'hitl' || phase === 'complete') && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">👤 HITL Gate — Human Review Required</h2>
            <HITLGate
              {...scenario}
              onApprove={handleApprove}
              isApproved={phase === 'complete'}
              approvedDecision={approvedDecision}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 Proof of Work / Audit Trail</h2>
            <AuditTrail key={auditKey} agentKey="order-capture" />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        {phase === 'complete' && (
          <Link to="/agents/transportation" className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 font-semibold transition-colors">
            Next: Transportation <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
