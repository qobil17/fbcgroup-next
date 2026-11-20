import { useLayoutEffect, useState } from 'react';

// Cached after the first detection so later page navigations render the right layout immediately
let cachedDevice: 'mobile' | 'desktop' | null = null;

const useDeviceDetect = (): string => {
  const [device, setDevice] = useState<string>(cachedDevice ?? 'desktop');

  // useLayoutEffect runs before paint, so the first page never shows the wrong layout either
  useLayoutEffect(() => {
    if (!cachedDevice) {
      cachedDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'mobile'
        : 'desktop';
    }
    if (device !== cachedDevice) setDevice(cachedDevice);
  }, []);

  return device;
};

export default useDeviceDetect;
