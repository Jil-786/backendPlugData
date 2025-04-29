// components/TokensModal.js
export default function TokensModal({ onClose, tokens = 1, maxTokens = 5 }) {
    const isPremium = maxTokens > 1;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎟️ Token Info</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">×</button>
          </div>
  
          <div className="space-y-3 text-gray-700">
            <p><strong>Plan:</strong> {isPremium ? '💎 Premium' : '🚀 Free'}</p>
            <p><strong>Tokens Today:</strong> {tokens} / {maxTokens}</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className={`h-3 rounded ${tokens > 0 ? 'bg-green-500' : 'bg-red-400'}`}
                style={{ width: `${(tokens / maxTokens) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tokens reset every 24 hours. Upgrade to Premium for more usage.
            </p>
          </div>
        </div>
      </div>
    );
  }
  