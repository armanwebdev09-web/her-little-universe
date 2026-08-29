import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/': 'Her Little Universe',
  '/our-story': 'Our Story | Her Little Universe',
  '/little-things': 'The Little Things | Her Little Universe',
  '/surprise': "Today's Surprise | Her Little Universe",
  '/surprise/archive': 'Unlocked Surprises | Her Little Universe',
  '/memories': 'Our Memories | Her Little Universe',
  '/songs': "Today's Song | Her Little Universe",
  '/letters': 'Love Letter Vault | Her Little Universe',
  '/our-universe': 'Her World | Her Little Universe',
  '/secret': 'Secret Space 🔐 | Her Little Universe',
  '/birthday': 'Birthday Experience 🎂 | Her Little Universe',
};

export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = ROUTE_TITLES[pathname] || (pathname.startsWith('/admin') ? 'Admin Panel | Her Little Universe' : 'Her Little Universe');
    document.title = title;
  }, [pathname]);
}
