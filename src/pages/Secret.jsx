import React, { useState } from 'react';
import { useSecretAuth } from '../context/SecretAuthContext';
import { SecretGate } from '../components/SecretGate';
import { SecretLogin } from '../components/SecretLogin';
import { UnlockAnimation } from '../components/UnlockAnimation';
import { SecretDashboard } from '../components/SecretDashboard';

export const Secret = () => {
  const { isAuthenticated } = useSecretAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  if (isAnimating) {
    return <UnlockAnimation onComplete={handleAnimationComplete} />;
  }

  if (isAuthenticated) {
    return <SecretDashboard />;
  }

  return (
    <>
      <SecretGate onOpenUnlockModal={() => setIsLoginOpen(true)} />

      <SecretLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};
