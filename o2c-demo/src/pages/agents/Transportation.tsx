import { useState, useCallback } from 'react';
import { Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentProcessing from '../../components/AgentProcessing';
import HITLGate from '../../components/HITLGate';
import AuditTrail from '../../components/AuditTrail';
import PipelineProgress from '../../components/PipelineProgress';
import { addAuditEntry, getAgentDecision } from '../../lib/audit';
import { PROCESSING_STEPS, HITL_SCENARIOS } from '../../data/synthetic';

export default function TransportationPage() {
  const existing = getAgentDecision('transportation');
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
    const optionLabels: Record<string, string> = {
      'hub-spoke': 'Hub-and-Spoke via Cincinnati (+2h, +$45)',
      'next-day': 'Next-Day Direct Flight (+24h, $0 extra)',
      'charter': 'Charter Courier (-1h, +$380)',
    };
    addAuditEntry({
      agent: 'Transportation Commit & Backorder Console',
      agentKey: 'transportation',
      action: 'HITL_APPROVAL: Routing Option Selection',
      decision: `Operator approved: ${optionLabels[decision.selectedOption] || decision.selectedOption}`,
      data: { ...decision, orderId: 'ORD-2024-HC-7734', promiseDate: '2024-01-15T17:00:00Z', routingApprovedBy: 'Demo Operator' },
      user: 'Demo Operator',
    });
    setApprovedDecision(decision);
    setPhase('complete');
    setAuditKey((k) => k + 1);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PipelineProgress currentStep="transportation" />
      
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Truck className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent 2: Transportation Commit</h1>
            <p className="text-slate-500">Promise-date calculation, capacity management, and routing optimization</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">🤖 Agent Processing</h2>
          <AgentProcessing
            steps={PROCESSING_STEPS['transportation']}
            onComplete={handleProcessingComplete}
            agentName="TransportCommitAgent v3.1"
          />
        </div>

        {(phase === 'hitl' || phase === 'complete') && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">👤 HITL Gate — Routing Approval</h2>
            <HITLGate
              {...HITL_SCENARIOS['transportation']}
              onApprove={handleApprove}
              isApproved={phase === 'complete'}
              approvedDecision={approvedDecision}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 Proof of Work / Audit Trail</h2>
            <AuditTrail key={auditKey} agentKey="transportation" />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Link to="/agents/order-capture" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Order Capture
        </Link>
        {phase === 'complete' && (
          <Link to="/agents/order-status" className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 font-semibold transition-colors">
            Next: Order Status <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
