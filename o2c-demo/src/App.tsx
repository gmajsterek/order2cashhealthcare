import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrderCapturePage from './pages/agents/OrderCapture';
import TransportationPage from './pages/agents/Transportation';
import OrderStatusPage from './pages/agents/OrderStatus';
import ShipmentTrackingPage from './pages/agents/ShipmentTracking';
import DisputePage from './pages/agents/Dispute';
import PodCollectorPage from './pages/agents/PodCollector';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents/order-capture" element={<OrderCapturePage />} />
            <Route path="/agents/transportation" element={<TransportationPage />} />
            <Route path="/agents/order-status" element={<OrderStatusPage />} />
            <Route path="/agents/shipment-tracking" element={<ShipmentTrackingPage />} />
            <Route path="/agents/dispute" element={<DisputePage />} />
            <Route path="/agents/pod-collector" element={<PodCollectorPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
