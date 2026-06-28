import { useState, useCallback, useMemo } from 'react';
import { LoadingContext } from './loading-context-helper';

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const value = useMemo(
    () => ({ isLoading, loadingMessage, startLoading, stopLoading }),
    [isLoading, loadingMessage, startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="loading-spinner-inner" />
            {loadingMessage && <p className="loading-message">{loadingMessage}</p>}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
