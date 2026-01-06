import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/ui/PageWrapper';
import { authAPI } from '../../lib/api';
import { showToast } from '../../lib/toast';
import Swal from 'sweetalert2';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: send otp | 2: verify otp | 3: reset password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const Toast =Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
  });

  /* -------------------- STEP 1: SEND OTP -------------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await authAPI.forgotPassword(email);
      console.log("the res",res);
      if(res.status==200){
      Toast.fire({
        icon: 'success',
        title: 'OTP sent to your email!',
      });
      setStep(2);
    }else{
      const message= await res.json()
      Toast.fire({
        icon: 'error',
        title: `Failed to send OTP : ${message.message}`,
      });
    }
    } catch (err) {
     Toast.fire({
        icon: 'error',
        title: 'Failed to send OTP'+ (err.response?.data?.message || ''),
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- STEP 2: VERIFY OTP -------------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    try {
      setLoading(true);
      await authAPI.verifyRestPasswordOtp({ email, resetCode:otp });
     Toast.fire({
        icon: 'success',
        title: 'OTP verified successfully!',
      });
      setStep(3);
    } catch (err) {
      
     Toast.fire({
        icon: 'error',
        title: 'Failed to verify OTP '+ (err.response?.data?.message || ''),
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- STEP 3: RESET PASSWORD -------------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      await authAPI.resetPassword({
        email,
        newPassword:password,
      });
      showToast('Password reset successfully', 'success');
      setStep(1);
      navigate('/login');
      setEmail('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-[80vh] font-poppins items-center justify-center">
      <div className="w-full max-w-md shadow-2xl rounded-3xl bg-white dark:bg-gray-800 p-8 border">
        
        {/* -------------------- HEADER -------------------- */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {step === 1 && t('Forgot Password')}
            {step === 2 && t('Verify OTP')}
            {step === 3 && t('Reset Password')}
          </h2>
        </div>

        {/* -------------------- STEP 1 -------------------- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <Button className="w-full btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {/* -------------------- STEP 2 -------------------- */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <Button className="w-full btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        )}

        {/* -------------------- STEP 3 -------------------- */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <Button className="w-full btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPassword;
