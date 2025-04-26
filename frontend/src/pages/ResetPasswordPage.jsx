import React, { useState } from 'react';
import useUserStore from '../../store/user/User.api';

function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const { verifyPassword, resetPassword, isLoading } = useUserStore();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStep(2); 
    setMessage('Sending OTP...');
    try {
      await resetPassword({ email });
      setMessage('OTP sent to your email');
    } catch (error) {
      setMessage('Failed to send OTP, but you can still try verifying.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage('Resetting password...');

    const success = await verifyPassword({ email, otp, password: newPassword });
    if (success) {
      setMessage('✅ Password reset successful');
    } else {
      setMessage(' Failed to reset password. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={step === 1 ? handleEmailSubmit : handleResetSubmit}
        className="bg-white p-4 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">Reset Password</h2>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Enter your email"
          required
          disabled={step === 2}
        />

        {step === 2 && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="Enter OTP"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="New password"
              required
            />
          </>
        )}

        <button
          type="submit"
          className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {step === 1 ? 'Send OTP' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
