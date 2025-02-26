import { useEffect, useState } from 'react';
import SHA256 from 'crypto-js/sha256';

const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    const generateFingerprint = () => {
      const userAgent = navigator.userAgent;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      const data = `${userAgent}-${timeZone}-${screenResolution}-${colorScheme}`;
      const hash = SHA256(data).toString();
      setFingerprint(hash);
    };

    generateFingerprint();
  }, []);

  return fingerprint;
};

export default useFingerprint;
