'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { getAgentDecision } from '../lib/audit';

const STEPS = [
  { key: 'order-capture', label: 'Order Capture', short: 'Capture' },
  { key: 'transportation', label: 'Transportation', short: 'Transport' },
  { key: 'order-status', label: 'Order Status', short: 'Status' },
  { key: 'shipment-tracking', label: 'Shipment Tracking', short: 'Tracking' },
  { key: 'dispute', label: 'Dispute & Recovery', short: 'Dispute' },
  { key: 'pod-collector', label: 'POD Collector', short: 'POD' },
];

interface PipelineProgressProps {
  currentStep?: string;
}

export default function PipelineProgress({ currentStep }: PipelineProgressProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = new Set<string>();
    STEPS.forEach((step) => {
      const decision = getAgentDecision(step.key);
      if (decision) completed.add(step.key);
    });
    setCompletedSteps(completed);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.key);
          const isCurrent = currentStep === step.key;
          return (
            <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/agents/${step.key}`} className="flex flex-col items-center gap-1 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-sky-500 text-white ring-4 ring-sky-100'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  isCurrent ? 'text-sky-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {step.short}
                </span>
              </Link>
              {index < STEPS.length - 1 && (
                <ArrowRight className={`h-4 w-4 flex-shrink-0 ${
                  isCompleted ? 'text-green-400' : 'text-slate-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
