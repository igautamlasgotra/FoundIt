import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const ConfigContext = createContext(null);

// Loads public app config (Cloudinary settings, category/location lists) once
// from GET /api/config, so the client has a single server-driven source of
// truth and no build-time env vars.
export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api('/config')
      .then(setConfig)
      .catch(() =>
        // Fall back to empty lists so the app still renders if config fails.
        setConfig({
          cloudinary: { enabled: false },
          categories: [],
          locations: [],
          types: ['lost', 'found'],
        })
      );
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export const useConfig = () => useContext(ConfigContext);
