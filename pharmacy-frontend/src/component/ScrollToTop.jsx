import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route change. If a hash is present, scrolls to that element.
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // wait a tick for the route component to render
    const t = setTimeout(() => {
      const { hash } = location;
      const path = location.pathname;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      // No hash: if visiting contact page, jump to the contact form by default
      if (path === '/contact') {
        const form = document.getElementById('contact-form');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 0);

    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  return null;
}
