import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface DarkModeContextProps {
    isDarkMode?: boolean;
    toggleDarkMode?: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps>({});

interface DarkModeProviderProps {
    children: ReactNode;
}

export const DarkModeProvider: FC<DarkModeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
          {children}
      </DarkModeContext.Provider>
    );
};

export const useDarkMode = (): DarkModeContextProps => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};
