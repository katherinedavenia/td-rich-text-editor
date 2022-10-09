import useMediaQuery from '@mui/material/useMediaQuery';

const useResponsive = () => {
  const isMobile = useMediaQuery(
    'only screen and (min-device-width: 0px) and (max-device-width: 639px)',
  );

  const isMobileLandscape = useMediaQuery(
    'only screen and (min-device-width: 0px) and (max-device-width: 639px) and (orientation: landscape)',
  );

  const isTablet = useMediaQuery(
    'only screen and (min-device-width: 640px) and (max-device-width: 1365px)',
  );

  const isTabletLandscape = useMediaQuery(
    'only screen and (min-device-width: 640px) and (max-device-width: 1365px) and (orientation: landscape)',
  );

  const isDesktop = useMediaQuery('only screen and (min-device-width: 1366px)');

  const isDesktopStandard = useMediaQuery(
    'only screen and (min-device-width: 1366px) and (max-device-width: 1919px)',
  );

  const isDesktopLarge = useMediaQuery(
    'only screen and (min-device-width: 1920px)',
  );

  const isDesktopSmallUp = useMediaQuery('(min-width: 960px)');

  return {
    isMobile,
    isMobileLandscape,
    isTablet,
    isTabletLandscape,
    isDesktop,
    isDesktopStandard,
    isDesktopLarge,
    isDesktopSmallUp,
  };
};

export default useResponsive;
