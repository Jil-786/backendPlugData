import { useState, useEffect } from 'react';
//import PremiumModal from './profile/PremiumModal';
import TokensModal from './profile/TokensModal';
import EntityCard from './EntityCard';
import CanvasBoard from './CanvasBoard';
import { FaDatabase, FaMicrochip, FaGlobe, FaUserCircle, FaBolt } from 'react-icons/fa';

export default function AppLayout() {
  const [email, setEmail] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTokensModal, setShowTokensModal] = useState(false);
  const [tokens, setTokens] = useState(1); // default token
  const isPremium = false; // replace with logic if needed
  const maxTokens = isPremium ? 3 : 1;

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    if (storedEmail) setEmail(storedEmail);

    // Optionally use token to fetch user type/tokens from backend later
    // For now, hardcoding 1 token and free user
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-hidden bg-gray-100">
        <header className="relative px-6 py-4 bg-white shadow-md border-b flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              🔌 BackendPlug
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Visually build and connect your Spring Boot architecture
            </p>
          </div>

          <div className="relative">
            <button
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <FaUserCircle size={30} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">User</p>
                  <p className="text-sm text-gray-500">{email || 'Not Logged In'}</p>
                  <p className="mt-1 text-xs text-green-600">
                    {isPremium ? '💎 Premium User' : 'Free User'}
                  </p>
                </div>
                {/* <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  💼 Premium Plan
                </button> */}
                <button
                  onClick={() => setShowTokensModal(true)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  🎟️ Tokens
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-white rounded-tr-xl rounded-br-xl shadow-md p-4 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Components</h2>
            <EntityCard title="Microservice" icon={<FaMicrochip />} description="Spring Boot Service" />
            <EntityCard title="API Gateway" icon={<FaGlobe />} description="Spring Cloud Gateway" options={['None', 'Eureka', 'Consul']} />
            <EntityCard title="Database" icon={<FaDatabase />} description="Choose your DB" options={['MongoDB', 'MySQL', 'PostgreSQL', 'H2']} />
            <EntityCard title="Cache Server" icon={<FaBolt />} description="Choose a caching solution" options={['Redis', 'Caffeine', 'Ehcache', 'Hazelcast']} />
          </div>

          <div className="flex-1 overflow-hidden">
            <CanvasBoard />
          </div>
        </div>
      </div>

      {/* {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />} */}
      {showTokensModal && (
        <TokensModal
          onClose={() => setShowTokensModal(false)}
          tokens={tokens}
          maxTokens={maxTokens}
        />
      )}
    </>
  );
}
