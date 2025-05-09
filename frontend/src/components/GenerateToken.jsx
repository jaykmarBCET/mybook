import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/user/User.api';

function GenerateToken() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createRegisterVerify } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await createRegisterVerify(email);

      if (res === 'ok') {
        navigate('/email/verify');
      } else {
        setError(res || 'Invalid email. Please try again.');
        setEmail(''); // Clear email input
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.');
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Generate Token</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !email}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default GenerateToken;
