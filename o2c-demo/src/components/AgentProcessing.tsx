import { useEffect, useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';

interface AgentProcessingProps {
  steps: string[];
  onComplete: () => void;
  agentName: string;
}

export default function AgentProcessing({ steps, onComplete, agentName }: AgentProcessingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, steps[currentStepIndex]]);
        setCurrentStepIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      setTimeout(onComplete, 500);
    }
  }, [currentStepIndex, steps, onComplete, isComplete]);

  return (
    <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-sky-400" />
          <span className="text-sky-400 font-semibold">{agentName}</span>
        </div>
        {!isComplete && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs uppercase tracking-wider">LIVE</span>
          </div>
        )}
        {isComplete && (
          <span className="text-green-400 text-xs uppercase tracking-wider">PROCESSING COMPLETE</span>
        )}
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {visibleSteps.map((step, i) => (
          <div key={i} className={`flex items-start gap-2 ${
            step.includes('⚠') || step.includes('ALERT') ? 'text-amber-400' :
            step.includes('✓') ? 'text-green-400' :
            step.includes('Flagging') || step.includes('requesting') ? 'text-purple-400' :
            'text-slate-300'
          }`}>
            <span className="text-slate-600 flex-shrink-0 text-xs mt-0.5">{'>'}</span>
            <span>{step}</span>
          </div>
        ))}
        {!isComplete && (
          <div className="flex items-center gap-2 text-sky-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="animate-pulse">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
