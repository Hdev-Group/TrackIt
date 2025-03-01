import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    const handleChunkError = () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError);
    return () => window.removeEventListener('error', handleChunkError);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;