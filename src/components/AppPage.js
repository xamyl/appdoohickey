import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';

const AppPageContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledBackLink = styled(Link)`
  color: ${({ theme }) => (theme.darkMode ? '#007BFF' : '#0056b3')};
  text-decoration: none;
  display: inline-block;
  margin-bottom: 20px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AppHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => (theme.darkMode ? '#444' : '#eee')};
  padding-bottom: 30px;
  margin-bottom: 30px;
`;

const AppTitle = styled.h1`
  color: ${({ theme }) => (theme.darkMode ? '#f4f4f4' : '#5a5a5a')};
  margin: 0 0 10px 0;
`;

const AppMeta = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 30px;
`;

const AppDescription = styled.div`
  color: ${({ theme }) => (theme.darkMode ? '#ccc' : '#666')};
  font-size: 16px;
  line-height: 1.6;
`;

const AppSidebar = styled.div`
  background-color: ${({ theme }) => (theme.darkMode ? '#333' : '#f8f9fa')};
  padding: 20px;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.a`
  display: inline-block;
  background-color: ${props => props.$primary ? '#007BFF' : '#6c757d'};
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  transition: background-color 0.3s;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 15px;

  &:hover {
    background-color: ${props => props.$primary ? '#0056b3' : '#5a6268'};
    color: white;
  }
`;

const MetaItem = styled.div`
  margin: 15px 0;
  color: ${({ theme }) => (theme.darkMode ? '#ccc' : '#666')};
`;

const MetaLabel = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#333')};
`;

const MetaValue = styled.span`
  color: ${({ theme }) => (theme.darkMode ? '#ccc' : '#666')};
`;

const DeveloperInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${({ theme }) => (theme.darkMode ? '#2a2a2a' : '#f8f9fa')};
  border-radius: 8px;
`;

const DeveloperAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const DeveloperName = styled.a`
  color: ${({ theme }) => (theme.darkMode ? '#007BFF' : '#0056b3')};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DeveloperLabel = styled.span`
  display: block;
  font-size: 0.9em;
  color: ${({ theme }) => (theme.darkMode ? '#999' : '#666')};
  margin-bottom: 4px;
`;

const AppPage = ({ darkMode }) => {
  const { appName } = useParams();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        const response = await fetch('/apps.json');
        const apps = await response.json();
        const foundApp = apps.find(a => a.name === decodeURIComponent(appName));
        if (foundApp) {
          setApp(foundApp);
        } else {
          setError('App not found');
        }
      } catch (err) {
        setError('Error loading app details');
      }
    };

    fetchAppDetails();
  }, [appName]);

  if (error) {
    return (
      <AppPageContainer>
        <StyledBackLink to="/" theme={{ darkMode }}>← Back to Apps</StyledBackLink>
        <AppTitle theme={{ darkMode }}>{error}</AppTitle>
      </AppPageContainer>
    );
  }

  if (!app) {
    return (
      <AppPageContainer>
        <StyledBackLink to="/" theme={{ darkMode }}>← Back to Apps</StyledBackLink>
        <AppTitle theme={{ darkMode }}>Loading...</AppTitle>
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <StyledBackLink to="/" theme={{ darkMode }}>← Back to Apps</StyledBackLink>
      
      <AppHeader>
        <AppTitle theme={{ darkMode }}>{app.name}</AppTitle>
        {app.developer && (
          <DeveloperInfo theme={{ darkMode }}>
            {app.developer.avatar && (
              <DeveloperAvatar 
                src={app.developer.avatar} 
                alt={`${app.developer.name}'s avatar`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40'; // Fallback image
                }}
              />
            )}
            <div>
              <DeveloperLabel theme={{ darkMode }}>Developer</DeveloperLabel>
              <DeveloperName 
                href={app.developer.url} 
                target="_blank" 
                rel="noopener noreferrer"
                theme={{ darkMode }}
              >
                {app.developer.name}
              </DeveloperName>
            </div>
          </DeveloperInfo>
        )}
        <AppDescription theme={{ darkMode }}>{app.description}</AppDescription>
      </AppHeader>

      <AppMeta>
        <div>
          {app.longDescription && (
            <AppDescription theme={{ darkMode }}>
              <h2>About</h2>
              {app.longDescription}
            </AppDescription>
          )}
          
          {app.features && (
            <AppDescription theme={{ darkMode }}>
              <h2>Features</h2>
              <ul>
                {app.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </AppDescription>
          )}
        </div>

        <AppSidebar theme={{ darkMode }}>
          <ButtonGroup>
            <ActionButton 
              href={app.downloadUrl} 
              download 
              $primary 
              $fullWidth
            >
              Download {app.name}
            </ActionButton>
            {app.sourceUrl && (
              <ActionButton 
                href={app.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                $fullWidth
              >
                Source Code
              </ActionButton>
            )}
          </ButtonGroup>

          {app.version && (
            <MetaItem theme={{ darkMode }}>
              <MetaLabel theme={{ darkMode }}>Version</MetaLabel>
              <MetaValue theme={{ darkMode }}>{app.version}</MetaValue>
            </MetaItem>
          )}

          {app.releaseDate && (
            <MetaItem theme={{ darkMode }}>
              <MetaLabel theme={{ darkMode }}>Release Date</MetaLabel>
              <MetaValue theme={{ darkMode }}>{app.releaseDate}</MetaValue>
            </MetaItem>
          )}

          {app.size && (
            <MetaItem theme={{ darkMode }}>
              <MetaLabel theme={{ darkMode }}>Size</MetaLabel>
              <MetaValue theme={{ darkMode }}>{app.size}</MetaValue>
            </MetaItem>
          )}

          {app.requirements && (
            <MetaItem theme={{ darkMode }}>
              <MetaLabel theme={{ darkMode }}>System Requirements</MetaLabel>
              <MetaValue theme={{ darkMode }}>{app.requirements}</MetaValue>
            </MetaItem>
          )}
        </AppSidebar>
      </AppMeta>
    </AppPageContainer>
  );
};

export default AppPage;