import { useLayoutEffect, useState } from 'react';

const useDeviceDetect = (): string => {
  const [device, setDevice] = useState('desktop');

  // useLayoutEffect (not useEffect) runs synchronously before paint,
  // so we never render the wrong layout for one frame.
  // Empty dependency [] — only needs to run once on mount.
  useLayoutEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setDevice(isMobile ? 'mobile' : 'desktop');
  }, []);

  return device;
};

export default useDeviceDetect;
