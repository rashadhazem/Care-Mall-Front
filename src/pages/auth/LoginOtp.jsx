import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/ui/PageWrapper';
import { authAPI } from '../../lib/api';
import { showToast } from '../../lib/toast';
import Swal from 'sweetalert2';
const VerifyPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
 

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
  });

  const validateOtp = () => {
    if (!otp.trim()) return "OTP is required";
    if (!/^\d{4}$/.test(otp)) return "OTP must be 4 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, otp };
    const error = validateOtp();
    if (error) {
      Toast.fire({
        icon: 'error',
        title: error,
      });
      setMessage(error);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/verifyOtp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("result", result);

      if (response.ok) {
        Toast.fire({
          icon: 'success',
          title: 'OTP verified successfully!',
        });
        setMessage('OTP verified successfully!');
      } else {
        Toast.fire({
          icon: 'error',
          title: result.message || 'OTP verification failed.',
        });
        setMessage(result.message || 'OTP verification failed.');
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Server error. Try again later.',
      });
      console.error('Error sending data:', error);
      setMessage('Server error. Try again later.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Toast.fire({
        icon: 'warning',
        title: 'Email is required',
      });
      return;
    }

    try {
      setLoading(true);
      console.log("email", email);
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/resendOtp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      console.log("result", result);
      if (response.ok) {
        Toast.fire({
          icon: 'success',
          title: 'OTP resent successfully!',
        });
        setMessage('OTP resent successfully!');
      } else {
        setMessage(result.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setMessage('Server error. Try again later.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-[80vh] font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800">

        {/* Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 dark:bg-gray-700/30 p-8">
          <img
            src="/Otp.png"
            alt="OTP"
            className="w-full max-w-sm object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
          <div className="w-full max-w-sm space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Verify Your Account
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Enter the OTP sent to your email</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium
                           text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg
                           border border-gray-300 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-700
                           text-gray-900 dark:text-white
                           placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* OTP */}
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-1 font-medium
                           text-gray-700 dark:text-gray-300"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 rounded-lg
                           border border-gray-300 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-700
                           text-gray-900 dark:text-white
                           placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transform transition-all active:scale-95">
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </form>

            {/* Message */}
            

            {/* Resend OTP */}
            <p className="mt-4 text-center text-sm
                        text-gray-600 dark:text-gray-300">
              Didn't get OTP?{' '}
              <span
                onClick={handleResendOtp}
                className="text-blue-600 dark:text-blue-400
                         cursor-pointer hover:underline"
              >
                Resend OTP
              </span>
            </p>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VerifyPage;
