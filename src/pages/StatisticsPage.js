import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, 
  Card, CardContent, Alert, Divider, Chip, Stack, Grid 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import {
  AccessTime,
  CalendarToday,
  Link as LinkIcon,
  Cached,
  Public,
  TrendingUp,
  Schedule
} from '@mui/icons-material';

const API_BASE = 'http://localhost:5000'; // Change to your backend URL/port

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
};

export default function StatisticsPage() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setError('');
      const urls = JSON.parse(sessionStorage.getItem('shortenedUrls') || '[]');
      if (!urls.length) return;
      try {
        const responses = await Promise.all(
          urls.map(item =>
            axios.get(`${API_BASE}/shorturls/${item.shortLink.split('/').pop()}`)
          )
        );
        setStats(responses.map(res => res.data));
      } catch (err) {
        setError('Failed to fetch statistics.');
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 6, mb: 6, maxWidth: '1200px' }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1 }}>
            URL Statistics
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
            View analytics for your shortened links below.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {error && <Alert severity="error" sx={{ mb: 3, fontSize: 16 }}>{error}</Alert>}
          
          {stats.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ mt: 4, mb: 2 }}>
              No shortened URLs found in this session.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {stats.map((item, idx) => (
                <Card key={idx} elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinkIcon color="primary" sx={{ mr: 1 }} />
                          <a href={item.shortLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.shortLink}
                          </a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}>
                          {item.url}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip 
                            icon={<TrendingUp />} 
                            label={`${item.clickCount} clicks`} 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Chip 
                            icon={<CalendarToday />} 
                            label={`Created: ${formatDate(item.createdAt)}`} 
                            variant="outlined" 
                          />
                          <Chip 
                            icon={<Schedule />} 
                            label={`Expires: ${item.expiry ? formatDate(item.expiry) : 'Never'}`} 
                            variant="outlined" 
                          />
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ mr: 1, fontSize: '1rem' }} /> Last Click
                          </Typography>
                          <Typography variant="body2">
                            {item.clicks.length > 0 ? 
                              formatDate(item.clicks[item.clicks.length - 1].timestamp) : 
                              'No clicks yet'}
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                            <Public sx={{ mr: 1, fontSize: '1rem' }} /> Top Location
                          </Typography>
                          <Typography variant="body2">
                            {item.clicks.length > 0 ? 
                              (item.clicks[0].geo || 'Unknown') : 
                              'N/A'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Accordion sx={{ mt: 2, boxShadow: 'none' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Cached sx={{ mr: 1, fontSize: '1rem' }} /> Click Details ({item.clicks.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {item.clicks.length === 0 ? (
                          <Typography color="text.secondary" align="center">No clicks recorded yet.</Typography>
                        ) : (
                          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                            {item.clicks.map((click, cidx) => (
                              <Paper key={cidx} elevation={0} sx={{ p: 2, mb: 1, backgroundColor: 'grey.50' }}>
                                <Typography variant="subtitle2">
                                  {formatDate(click.timestamp)}
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Referrer:</strong> {click.referrer || 'Direct'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Location:</strong> {click.geo || 'Unknown'}
                                  </Typography>
                                </Stack>
                              </Paper>
                            ))}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}