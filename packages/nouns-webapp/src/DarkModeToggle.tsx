import React from 'react';
import { Button } from 'react-bootstrap';
import { useDarkMode } from './DarkModeContext';

const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <Button onClick={toggleDarkMode} variant={isDarkMode ? 'light' : 'dark'}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
    );
};

export default DarkModeToggle;
