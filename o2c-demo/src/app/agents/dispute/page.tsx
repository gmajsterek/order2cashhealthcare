'use client';

import { useState, useCallback } from 'react';
import { AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AgentProcessing from '../../../components/AgentProcessing';
import HITLGate from '../../../components/HITLGate';
import AuditTrail from '../../../components/AuditTrail';
import PipelineProgress from '../../../components/PipelineProgress';
import { addAuditEntry, getAgentDecision } from '../../../lib/audit';
import { PROCESSING_STEPS, HITL_SCENARIOS } from '../../../data/synthetic';

export default function DisputePage() {
  const existing = getAgentDecision('dispute');
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
    const actions: Record<string, string> = {
      reship: 'Reship Protocol Initiated - New collection scheduled at Memorial Cancer Center',
      wait: 'Wait Decision - Monitoring for 30 additional minutes',
      escalate: 'Carrier Executive Escalation - VP of Operations contacted',
    };
    addAuditEntry({
      agent: 'Dispute & Recovery Orchestrator',
      agentKey: 'dispute',
      action: 'HITL_APPROVAL: Reship Authorization',
      decision: actions[decision.selectedOption] || decision.selectedOption,
      data: { ...decision, caseId: 'DSP-2024-7734-001', slaStatus: 'BREACHED', carrierResponse: 'NO_RESPONSE', authorizedAt: new Date().toISOString() },
      user: 'Demo Operator',
    });
    setApprovedDecision(decision);
    setPhase('complete');
    setAuditKey((k) => k + 1);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PipelineProgress currentStep="dispute" />
      
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent 5: Dispute & Recovery Orchestrator</h1>
            <p className="text-slate-500">Automatic case creation, severity classification, and recovery orchestration</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">🤖 Agent Processing</h2>
          <AgentProcessing
            steps={PROCESSING_STEPS['dispute']}
            onComplete={handleProcessingComplete}
            agentName="DisputeRecoveryAgent v2.0"
          />
        </div>

        {(phase === 'hitl' || phase === 'complete') && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">👤 HITL Gate — Reship Authorization</h2>
            <HITLGate
              {...HITL_SCENARIOS['dispute']}
              onApprove={handleApprove}
              isApproved={phase === 'complete'}
              approvedDecision={approvedDecision}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 Proof of Work / Audit Trail</h2>
            <AuditTrail key={auditKey} agentKey="dispute" />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/agents/shipment-tracking" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Shipment Tracking
        </Link>
        {phase === 'complete' && (
          <Link href="/agents/pod-collector" className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 font-semibold transition-colors">
            Next: POD Collector <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
