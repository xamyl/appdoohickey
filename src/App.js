import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AppPage from './components/AppPage';

// Global style for fonts and theme
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    background-color: ${({ theme }) => (theme.darkMode ? '#121212' : '#f4f4f4')};
    color: ${({ theme }) => (theme.darkMode ? '#fff' : '#333')};
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => (theme.darkMode ? '#f4f4f4' : '#5a5a5a')};
  text-align: center;
  margin-bottom: 40px;
`;

const AppCard = styled.div`
  background-color: ${({ theme }) => (theme.darkMode ? '#333' : '#fff')};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px;
  max-width: 400px;
  text-align: center;
  width: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const AppName = styled.h3`
  color: ${({ theme }) => (theme.darkMode ? '#007BFF' : '#007BFF')};
`;

const AppDescription = styled.p`
  color: ${({ theme }) => (theme.darkMode ? '#ccc' : '#666')};
  font-size: 16px;
`;

const InstallButton = styled.button`
  background-color: ${({ theme }) => (theme.darkMode ? '#007BFF' : '#007BFF')};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: ${({ theme }) => (theme.darkMode ? '#0056b3' : '#0056b3')};
  }
`;

const ThemeToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${({ theme }) => (theme.darkMode ? '#444' : '#ddd')};
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#333')};
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const ErrorPopup = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => (theme.darkMode ? '#f44336' : '#ff5722')};
  color: white;
  padding: 15px;
  border-radius: 12px;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
`;

const ErrorCloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const App = () => {
  const [apps, setApps] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/apps.json');
      if (!response.ok) {
        throw new Error('Failed to fetch apps');
      }
      const data = await response.json();
      setApps(data);
    } catch (err) {
      console.error('Error fetching apps:', err);
      setError('Error fetching apps.');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  // Add some default apps as fallback
  const defaultApps = [
    {
      name: "Fallbacker",
      description: "Fell back? We've got you. (Fallback)",
      downloadUrl: ""
    },
    {
      name: "Netflixbus",
      description: "Guten tag! (Fallback)",
      downloadUrl: ""
    }
  ];

  useEffect(() => {
    fetchApps();
    // If no apps loaded after 2 seconds, use defaults
    const timeout = setTimeout(() => {
      setApps(prev => prev.length === 0 ? defaultApps : prev);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleInstall = (appName) => {
    fetch(`/install/${appName}`)
      .then(response => {
        if (response.ok) {
          alert(`Installing ${appName}...`);
        } else {
          throw new Error('Install failed');
        }
      })
      .catch(err => setError(`Error installing ${appName}`));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const HomePage = () => (
    <AppContainer>
      <Title theme={{ darkMode }}>App Doohickey</Title>
      {loading ? (
        <AppCard theme={{ darkMode }}>
          <AppDescription theme={{ darkMode }}>Loading apps...</AppDescription>
        </AppCard>
      ) : apps.length === 0 ? (
        <AppCard theme={{ darkMode }}>
          <AppDescription theme={{ darkMode }}>No apps available.</AppDescription>
        </AppCard>
      ) : (
        apps.map((app) => (
          <StyledLink key={app.name} to={`/app/${encodeURIComponent(app.name)}`}>
            <AppCard theme={{ darkMode }}>
              <AppName theme={{ darkMode }}>{app.name}</AppName>
              <AppDescription theme={{ darkMode }}>{app.description}</AppDescription>
            </AppCard>
          </StyledLink>
        ))
      )}
    </AppContainer>
  );

  return (
    <Router>
      <GlobalStyle theme={{ darkMode }} />
      <ThemeToggleButton theme={{ darkMode }} onClick={toggleTheme}>
        {darkMode ? (
          <svg width="24" height="24" viewBox="-5.5 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.68 21.64c-3.12 0-5.64-2.52-5.64-5.64s2.52-5.64 5.64-5.64 5.64 2.52 5.64 5.64-2.52 5.64-5.64 5.64zM10.68 12.040c-2.2 0-3.96 1.76-3.96 3.96s1.76 3.96 3.96 3.96 3.96-1.76 3.96-3.96-1.76-3.96-3.96-3.96zM10.68 9.040c-0.48 0-0.84-0.36-0.84-0.84v-2.040c0-0.48 0.36-0.84 0.84-0.84s0.84 0.36 0.84 0.84v2.040c0 0.48-0.36 0.84-0.84 0.84zM16.2 11.32c-0.2 0-0.44-0.080-0.6-0.24-0.32-0.32-0.32-0.84 0-1.2l1.44-1.44c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-1.44 1.44c-0.2 0.16-0.4 0.24-0.6 0.24zM18.48 16.84c-0.48 0-0.84-0.36-0.84-0.84s0.36-0.84 0.84-0.84h2.040c0.48 0 0.84 0.36 0.84 0.84s-0.36 0.84-0.84 0.84h-2.040zM17.64 23.8c-0.2 0-0.44-0.080-0.6-0.24l-1.44-1.48c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l1.44 1.44c0.32 0.32 0.32 0.84 0 1.2-0.16 0.2-0.4 0.28-0.6 0.28zM10.68 26.68c-0.48 0-0.84-0.36-0.84-0.84v-2.040c0-0.48 0.36-0.84 0.84-0.84s0.84 0.36 0.84 0.84v2.040c0 0.48-0.36 0.84-0.84 0.84zM3.72 23.8c-0.2 0-0.44-0.080-0.6-0.24-0.32-0.32-0.32-0.84 0-1.2l1.44-1.44c0.32-0.32 0.84-0.32 1.2 0s0.32 0.84 0 1.2l-1.44 1.44c-0.16 0.16-0.4 0.24-0.6 0.24zM0.84 16.84c-0.48 0-0.84-0.36-0.84-0.84s0.36-0.84 0.84-0.84h2.040c0.48 0 0.84 0.36 0.84 0.84s-0.36 0.84-0.84 0.84h-2.040zM5.16 11.32c-0.2 0-0.44-0.080-0.6-0.24l-1.44-1.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l1.44 1.44c0.32 0.32 0.32 0.84 0 1.2-0.16 0.16-0.36 0.24-0.6 0.24z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
              fill="currentColor"
            />
          </svg>
        )}
      </ThemeToggleButton>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app/:appName" element={<AppPage darkMode={darkMode} />} />
      </Routes>

      <ErrorPopup $show={error !== null} theme={{ darkMode }}>
        {error}
        <ErrorCloseButton onClick={() => setError(null)}>
          <FontAwesomeIcon icon={faTimes} />
        </ErrorCloseButton>
      </ErrorPopup>
    </Router>
  );
};

export default App;
