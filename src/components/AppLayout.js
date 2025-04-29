import EntityCard from './EntityCard';
import CanvasBoard from './CanvasBoard';
import { FaDatabase, FaMicrochip, FaGlobe } from 'react-icons/fa';

export default function AppLayout() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* 💡 Cool App Header */}
      <header className="px-6 py-4 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          🔌 BackendPlug
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Visually build and connect your Spring Boot architecture
        </p>
      </header>

      {/* 🔧 Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Scrollable Entity Cards */}
        <div className="w-64 bg-white rounded-tr-xl rounded-br-xl shadow-md p-4 space-y-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Components</h2>
          <EntityCard
            title="Microservice"
            icon={<FaMicrochip />}
            description="Spring Boot Service"
          />
          <EntityCard
          title="API Gateway"
          icon={<FaGlobe />}
          description=" Spring Cloud Gateway"
          options={['None', 'Eureka', 'Consul']}
          />
          <EntityCard
            title="Database"
            icon={<FaDatabase />}
            description="Choose your DB"
            options={['MongoDB', 'MySQL', 'PostgreSQL', 'H2','Redis']}
            onOptionSelect={(db) => console.log('Selected DB:', db)}
          />
          {/* You can add more EntityCards here and scroll will appear if needed */}
        </div>

        {/* Right Panel - Full Canvas */}
        <div className="flex-1 overflow-hidden">
          <CanvasBoard />
        </div>
      </div>
    </div>
  );
}
