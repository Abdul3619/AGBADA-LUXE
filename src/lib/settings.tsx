import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSettings, type Settings } from './api';

interface SettingsState {
  settings: Settings;
  loaded: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsState>({ settings: {}, loaded: false, refresh: async () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setSettings(await getSettings());
    } catch {
      // The site still works with its built-in defaults if settings cannot be loaded.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <SettingsContext.Provider value={{ settings, loaded, refresh }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
