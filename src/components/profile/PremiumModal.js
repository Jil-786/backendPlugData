// components/PremiumModal.js
export default function PremiumModal({ onClose }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[90%] max-w-3xl p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Choose a Plan</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">×</button>
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            {/* Free Plan Card */}
            <div className="border rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-700">🚀 Free Plan</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>✅ 1 Microservice per day</li>
                <li>❌ No PDF Export</li>
                <li>❌ No API Deployment</li>
              </ul>
            </div>
  
            {/* Premium Plan Card */}
            <div className="border-2 border-yellow-400 rounded-lg p-4 flex-1 bg-yellow-50">
              <h3 className="text-lg font-semibold text-yellow-800">💎 Premium Plan</h3>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>✅ 5 Microservice per day</li>
                <li>✅ PDF Export</li>
                <li>✅ API Deployment Tools</li>
              </ul>
              <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  