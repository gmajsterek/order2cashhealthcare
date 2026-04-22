import { Link, useLocation } from 'react-router-dom';
import { Activity, ClipboardCheck, Truck, MessageSquare, MapPin, AlertTriangle, Shield, BarChart3, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/agents/order-capture', label: 'Order Capture', icon: ClipboardCheck, step: 1 },
  { href: '/agents/transportation', label: 'Transportation', icon: Truck, step: 2 },
  { href: '/agents/order-status', label: 'Order Status', icon: MessageSquare, step: 3 },
  { href: '/agents/shipment-tracking', label: 'Shipment Tracking', icon: MapPin, step: 4 },
  { href: '/agents/dispute', label: 'Dispute & Recovery', icon: AlertTriangle, step: 5 },
  { href: '/agents/pod-collector', label: 'POD Collector', icon: Shield, step: 6 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-6 w-6 text-sky-400" />
          <span className="font-bold text-lg text-white">O2C Health</span>
        </div>
        <p className="text-slate-400 text-xs">AI Agent Demo Platform</p>
      </div>

      <div className="px-4 py-3 bg-slate-800 mx-3 mt-4 rounded-lg">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Order</p>
        <p className="text-sky-400 font-mono text-sm font-semibold">ORD-2024-HC-7734</p>
        <p className="text-slate-300 text-xs">ONCOTRIAL-2024-B</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.step && (
                <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  isActive ? 'bg-sky-400 text-sky-900' : 'bg-slate-700 text-slate-300'
                }`}>
                  {item.step}
                </span>
              )}
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">System Online</span>
        </div>
      </div>
    </aside>
  );
}
