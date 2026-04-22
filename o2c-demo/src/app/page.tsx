'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, CheckCircle2, Clock, ClipboardCheck, Truck, MessageSquare, MapPin, AlertTriangle, Shield, RotateCcw } from 'lucide-react';
import { getAgentDecision, clearAuditLog } from '../lib/audit';
import { ORDER_DATA, AGENTS } from '../data/synthetic';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardCheck, Truck, MessageSquare, MapPin, AlertTriangle, Shield,
};

const STATUS_COLORS: Record<string, string> = {
  blue: 'border-sky-400 bg-sky-50',
  indigo: 'border-indigo-400 bg-indigo-50',
  violet: 'border-violet-400 bg-violet-50',
  teal: 'border-teal-400 bg-teal-50',
  orange: 'border-orange-400 bg-orange-50',
  green: 'border-emerald-400 bg-emerald-50',
};

const ICON_COLORS: Record<string, string> = {
  blue: 'text-sky-600',
  indigo: 'text-indigo-600',
  violet: 'text-violet-600',
  teal: 'text-teal-600',
  orange: 'text-orange-600',
  green: 'text-emerald-600',
};

export default function Dashboard() {
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const [_ignored, forceUpdate] = useState(0);

  useEffect(() => {
    const completed = new Set<string>();
    AGENTS.forEach((agent) => {
      if (getAgentDecision(agent.key)) completed.add(agent.key);
    });
    setCompletedAgents(completed);
  }, []);

  const handleReset = () => {
    clearAuditLog();
    setCompletedAgents(new Set());
    forceUpdate((n) => n + 1);
  };

  const completedCount = completedAgents.size;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-7 w-7 text-sky-600" />
              <h1 className="text-3xl font-bold text-slate-900">O2C AI Agent Platform</h1>
            </div>
            <p className="text-slate-500 text-lg">Order-to-Cash Healthcare Demo — Clinical Trial Blood Sample</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Active Order</h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
              {ORDER_DATA.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-mono font-semibold text-sky-700">{ORDER_DATA.orderId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Protocol</p>
              <p className="font-semibold text-slate-800">{ORDER_DATA.protocol}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Patient ID</p>
              <p className="font-semibold text-slate-800">{ORDER_DATA.patientId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sample Type</p>
              <p className="font-semibold text-slate-800">{ORDER_DATA.sampleType} × {ORDER_DATA.tubes}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Origin</p>
              <p className="text-slate-700 text-sm">{ORDER_DATA.site}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Destination</p>
              <p className="text-slate-700 text-sm">{ORDER_DATA.lab}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Temperature</p>
              <p className="text-slate-700 text-sm">{ORDER_DATA.temperature}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Window</p>
              <p className="text-slate-700 text-sm">{ORDER_DATA.pickupWindow}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Pipeline Progress</p>
            <p className="text-sm text-slate-500">{completedCount} of {AGENTS.length} agents completed</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-sky-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / AGENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {AGENTS.map((agent, index) => {
            const Icon = ICON_MAP[agent.icon];
            const isCompleted = completedAgents.has(agent.key);
            return (
              <Link
                key={agent.key}
                href={agent.href}
                className={`group block bg-white rounded-xl shadow-sm border-l-4 border border-slate-200 p-5 hover:shadow-md transition-all ${STATUS_COLORS[agent.color]}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm ${ICON_COLORS[agent.color]}`}>
                      {index + 1}
                    </span>
                    <Icon className={`h-5 w-5 ${ICON_COLORS[agent.color]}`} />
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-slate-900">{agent.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{agent.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Start Demo CTA */}
        {completedCount === 0 && (
          <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Start the Demo?</h3>
            <p className="text-sky-100 mb-4">Walk through all 6 AI agents with human-in-the-loop decision points</p>
            <Link
              href="/agents/order-capture"
              className="inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Start Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {completedCount === AGENTS.length && (
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Demo Complete!</h3>
            <p className="text-green-100">All 6 agents processed with HITL approvals. Order ORD-2024-HC-7734 successfully delivered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
