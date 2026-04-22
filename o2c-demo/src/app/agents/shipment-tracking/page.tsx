'use client';

import { useState, useCallback } from 'react';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AgentProcessing from '../../../components/AgentProcessing';
import HITLGate from '../../../components/HITLGate';
import AuditTrail from '../../../components/AuditTrail';
import PipelineProgress from '../../../components/PipelineProgress';
import { addAuditEntry, getAgentDecision } from '../../../lib/audit';
import { PROCESSING_STEPS, HITL_SCENARIOS } from '../../../data/synthetic';

export default function ShipmentTrackingPage() {
  const existing = getAgentDecision('shipment-tracking');
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
    const interventions: Record<string, string> = {
      expedite: 'Expedite Delivery - Driver contacted, priority routing active',
      reroute: 'Reroute to Penn Medicine Lab - Protocol deviation filed',
      hold: 'Hold and Re-ice at Carrier Depot',
    };
    addAuditEntry({
      agent: 'Shipment Tracking & ETA Predictor',
      agentKey: 'shipment-tracking',
      action: 'HITL_APPROVAL: Temperature Risk Intervention',
      decision: interventions[decision.selectedOption] || decision.selectedOption,
      data: { ...decision, alertType: 'TEMPERATURE_EXCURSION_RISK', currentTemp: '7.8°C', specLimit: '8.0°C', interventionTime: new Date().toISOString() },
      user: 'Demo Operator',
    });
    setApprovedDecision(decision);
    setPhase('complete');
    setAuditKey((k) => k + 1);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PipelineProgress currentStep="shipment-tracking" />
      
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <MapPin className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent 4: Shipment Tracking & ETA Predictor</h1>
            <p className="text-slate-500">Real-time milestone aggregation, predictive ETA, and anomaly detection</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">🤖 Agent Processing</h2>
          <AgentProcessing
            steps={PROCESSING_STEPS['shipment-tracking']}
            onComplete={handleProcessingComplete}
            agentName="ShipmentTrackingAgent v4.2"
          />
        </div>

        {(phase === 'hitl' || phase === 'complete') && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">👤 HITL Gate — Intervention Decision</h2>
            <HITLGate
              {...HITL_SCENARIOS['shipment-tracking']}
              onApprove={handleApprove}
              isApproved={phase === 'complete'}
              approvedDecision={approvedDecision}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 Proof of Work / Audit Trail</h2>
            <AuditTrail key={auditKey} agentKey="shipment-tracking" />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/agents/order-status" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Order Status
        </Link>
        {phase === 'complete' && (
          <Link href="/agents/dispute" className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 font-semibold transition-colors">
            Next: Dispute & Recovery <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
