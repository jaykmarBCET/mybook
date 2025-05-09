import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/user/User.api';

function EmailVerify() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const { emailTokenVerify } = useUserStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchedToken = searchParams.get('token');
    if (searchedToken) {
      setToken(searchedToken);
    } else {
      setStatus('error');
      setMessage('No token found in URL.');
    }
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      try {
        const res = await emailTokenVerify(token);
        if (res === 'ok') {
          setStatus('success');
          setMessage('Your email is verified successfully.');
        } else {
          setStatus('error');
          setMessage(res || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        const errorMsg =
          err?.response?.data?.message || err?.message || 'Verification failed.';
        setMessage(errorMsg);
      }
    };

    verifyEmail();
  }, [token, emailTokenVerify]);

  return (
    <div className="text-center mt-10">
      {status === 'loading' && <p>Please wait...</p>}
      {status === 'success' && <p className="text-green-600">{message}</p>}
      {status === 'error' && <p className="text-red-600">{message}</p>}
    </div>
  );
}

export default EmailVerify;
