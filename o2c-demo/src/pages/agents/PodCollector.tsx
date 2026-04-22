import { useState, useCallback } from 'react';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentProcessing from '../../components/AgentProcessing';
import HITLGate from '../../components/HITLGate';
import AuditTrail from '../../components/AuditTrail';
import PipelineProgress from '../../components/PipelineProgress';
import { addAuditEntry, getAgentDecision } from '../../lib/audit';
import { PROCESSING_STEPS, HITL_SCENARIOS } from '../../data/synthetic';

export default function PODCollectorPage() {
  const existing = getAgentDecision('pod-collector');
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
    const determinations: Record<string, string> = {
      accept: 'Samples ACCEPTED - Within ONCOTRIAL-2024-B protocol tolerance (23 min excursion < 30 min limit)',
      reject: 'Samples REJECTED - Recollection protocol initiated',
      'lab-review': 'Escalated to BioCore Lab Director for final determination',
    };
    addAuditEntry({
      agent: 'Proof-of-Delivery Collector',
      agentKey: 'pod-collector',
      action: 'HITL_APPROVAL: Sample Acceptability Determination',
      decision: determinations[decision.selectedOption] || decision.selectedOption,
      data: {
        ...decision,
        peakTemperature: '7.8°C',
        excursionDuration: '23 minutes',
        protocolLimit: '30 minutes at <8°C',
        evidenceScore: '94/100',
        chainOfCustody: 'COMPLETE',
        vaultedAt: new Date().toISOString(),
      },
      user: 'Demo Operator',
    });
    setApprovedDecision(decision);
    setPhase('complete');
    setAuditKey((k) => k + 1);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PipelineProgress currentStep="pod-collector" />
      
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent 6: Proof-of-Delivery Collector</h1>
            <p className="text-slate-500">POD capture, chain-of-custody validation, temperature log verification, and evidence vaulting</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">🤖 Agent Processing</h2>
          <AgentProcessing
            steps={PROCESSING_STEPS['pod-collector']}
            onComplete={handleProcessingComplete}
            agentName="PODCollectorAgent v3.5"
          />
        </div>

        {(phase === 'hitl' || phase === 'complete') && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">👤 HITL Gate — Sample Acceptability Review</h2>
            <HITLGate
              {...HITL_SCENARIOS['pod-collector']}
              onApprove={handleApprove}
              isApproved={phase === 'complete'}
              approvedDecision={approvedDecision}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 Proof of Work / Audit Trail</h2>
            <AuditTrail key={auditKey} agentKey="pod-collector" />
            
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-800 font-semibold text-sm">🎉 Order ORD-2024-HC-7734 Complete</p>
              <p className="text-emerald-600 text-sm mt-1">All 6 agents have processed this order. Return to the dashboard to view the full pipeline summary.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Link to="/agents/dispute" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Dispute & Recovery
        </Link>
        {phase === 'complete' && (
          <Link to="/" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-semibold transition-colors">
            <Home className="h-4 w-4" /> Return to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
