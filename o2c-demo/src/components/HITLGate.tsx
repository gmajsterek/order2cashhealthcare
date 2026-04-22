'use client';

import { useState } from 'react';
import { UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HITLOption {
  id: string;
  label: string;
  detail: string;
  recommended?: boolean;
}

interface HITLField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface HITLGateProps {
  title: string;
  description: string;
  requiredAction: string;
  fields?: HITLField[];
  options?: HITLOption[];
  draftResponse?: string;
  temperatureData?: Array<{ time: string; temp: string; status: string }>;
  approveLabel: string;
  onApprove: (decision: Record<string, string>) => void;
  isApproved?: boolean;
  approvedDecision?: Record<string, string>;
}

export default function HITLGate({
  title,
  description,
  requiredAction,
  fields,
  options,
  draftResponse,
  temperatureData,
  approveLabel,
  onApprove,
  isApproved,
  approvedDecision,
}: HITLGateProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editedResponse, setEditedResponse] = useState(draftResponse || '');

  if (isApproved && approvedDecision) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">HITL Gate Approved</h3>
            <p className="text-green-600 text-sm">Human decision recorded and validated</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-green-200">
          {Object.entries(approvedDecision).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-sm py-1">
              <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const decision: Record<string, string> = {};
    if (selectedOption) decision.selectedOption = selectedOption;
    if (editedResponse !== draftResponse) decision.modifiedResponse = editedResponse;
    else if (draftResponse) decision.approvedResponse = 'Original draft approved';
    Object.entries(formData).forEach(([k, v]) => { decision[k] = v; });
    onApprove(decision);
  };

  const canSubmit = (() => {
    if (options && options.length > 0) return selectedOption !== '';
    if (fields && fields.length > 0) {
      return fields.filter(f => f.required).every(f => formData[f.name]?.trim());
    }
    return true;
  })();

  return (
    <div className="border-2 border-violet-200 bg-violet-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Human Review Required
        </span>
        <UserCheck className="h-5 w-5 text-violet-600" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">{description}</p>
      </div>

      <p className="text-sm font-medium text-violet-700 mb-3">{requiredAction}</p>

      {temperatureData && (
        <div className="mb-4 bg-white rounded-lg border border-violet-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 text-slate-600">Time</th>
                <th className="text-left px-3 py-2 text-slate-600">Temperature</th>
                <th className="text-left px-3 py-2 text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {temperatureData.map((row, i) => (
                <tr key={i} className={row.status === 'WARNING' ? 'bg-amber-50' : ''}>
                  <td className="px-3 py-1.5 text-slate-600">{row.time}</td>
                  <td className={`px-3 py-1.5 font-mono font-semibold ${row.status === 'WARNING' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {row.temp}
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.status === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {draftResponse && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Draft Response (editable):</label>
          <textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="w-full border border-violet-200 rounded-lg p-3 text-sm text-slate-700 h-32 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none bg-white"
          />
        </div>
      )}

      {fields && (
        <div className="space-y-3 mb-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full border border-violet-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-300 outline-none bg-white"
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full border border-violet-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-300 outline-none bg-white"
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {options && (
        <div className="space-y-2 mb-4">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-violet-500 bg-violet-100'
                  : 'border-slate-200 bg-white hover:border-violet-300'
              }`}
            >
              <input
                type="radio"
                name="hitl-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="mt-1 accent-violet-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800 text-sm">{option.label}</span>
                  {option.recommended && (
                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{option.detail}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
          canSubmit
            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {approveLabel}
      </button>
    </div>
  );
}
