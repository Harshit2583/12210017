import React, { useState } from 'react';
import UrlShortenerForm from '../components/UrlShortenerForm';
import { 
  Box, Typography, Paper, Divider, Alert, Card, CardContent,
  Chip, Stack, Button, IconButton, Tooltip, Snackbar
} from '@mui/material';
import {
  ContentCopy,
  Link as LinkIcon,
  CalendarToday,
  CheckCircle,
  OpenInNew,
  Delete
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Change to your backend URL/port

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ShortenerPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async (urls) => {
    setError('');
    setResults([]);
    setLoading(true);
    try {
      const responses = await Promise.all(urls.map(data =>
        axios.post(`${API_BASE}/shorturls`, data)
      ));
      const newResults = responses.map(res => res.data);
      setResults(newResults);
      // Store in session for stats page
      const prev = JSON.parse(sessionStorage.getItem('shortenedUrls') || '[]');
      sessionStorage.setItem('shortenedUrls', JSON.stringify([...prev, ...newResults]));
    } catch (err) {
      setError(err.response?.data?.message || 'Error shortening URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDelete = (index) => {
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
    // Also remove from session storage
    const sessionUrls = JSON.parse(sessionStorage.getItem('shortenedUrls') || '[]');
    sessionStorage.setItem('shortenedUrls', JSON.stringify(sessionUrls.filter((_, i) => i !== index)));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 6, px: 2 }}>
      <Card elevation={4} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            URL Shortener
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Create short, trackable links in seconds
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <UrlShortenerForm onShorten={handleShorten} loading={loading} />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {results.length > 0 && (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <LinkIcon color="primary" sx={{ mr: 1 }} />
              Your Shortened Links
            </Typography>
            
            <Stack spacing={2}>
              {results.map((item, idx) => (
                <Paper key={idx} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          display: 'flex', 
                          alignItems: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <a 
                          href={item.shortLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {item.shortLink}
                          <OpenInNew fontSize="small" sx={{ ml: 0.5 }} />
                        </a>
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.url}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip 
                          icon={<CalendarToday fontSize="small" />} 
                          label={`Expires: ${formatDate(item.expiry)}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Stack>
                    </Box>
                    
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Copy link">
                        <IconButton onClick={() => handleCopy(item.shortLink)} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(idx)} size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}