import React from 'react';
import AuthForm from '../AuthForm';

const LoginSignupPage = () => {
  const handleAuth = async (formData, isSignup) => {
    const endpoint = isSignup
      ? 'http://localhost:9500/api/users/signup'
      : 'http://localhost:9500/api/users/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.message?.includes('Invalid') || data.message?.includes('exists')) {
        alert(data.message || 'Something went wrong');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('email', formData.email); // ✅ This line saves the email

      alert('✅ Success! Token saved.');
      window.location.href = '/'; // redirect to homepage or dashboard
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  );
};

export default LoginSignupPage;
