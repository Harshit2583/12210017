import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';

const initialUrlState = { url: '', validity: '', shortcode: '', error: '' };

export default function UrlShortenerForm({ onShorten }) {
  const [urls, setUrls] = useState([
    { ...initialUrlState },
  ]);

  const handleChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    newUrls[idx].error = '';
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) setUrls([...urls, { ...initialUrlState }]);
  };

  const removeUrlField = (idx) => {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== idx));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    let valid = true;
    const newUrls = urls.map((item) => {
      let error = '';
      if (!item.url || !validateUrl(item.url)) error = 'Invalid URL';
      else if (item.validity && (!/^[0-9]+$/.test(item.validity) || parseInt(item.validity) <= 0)) error = 'Validity must be a positive integer';
      else if (item.shortcode && (!/^[a-zA-Z0-9]{1,16}$/.test(item.shortcode))) error = 'Shortcode must be alphanumeric (max 16 chars)';
      if (error) valid = false;
      return { ...item, error };
    });
    setUrls(newUrls);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onShorten(urls.map(({ url, validity, shortcode }) => ({ url, validity, shortcode })));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {urls.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  label="Long URL"
                  value={item.url}
                  onChange={e => handleChange(idx, 'url', e.target.value)}
                  required
                  fullWidth
                  error={!!item.error}
                  helperText={item.error}
                />
                <TextField
                  label="Validity (min)"
                  value={item.validity}
                  onChange={e => handleChange(idx, 'validity', e.target.value)}
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Shortcode (optional)"
                  value={item.shortcode}
                  onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                  sx={{ width: 160 }}
                />
                {urls.length > 1 && (
                  <Button color="error" onClick={() => removeUrlField(idx)}>-</Button>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" onClick={addUrlField} disabled={urls.length >= 5}>Add URL</Button>
          <Button variant="contained" color="primary" type="submit">Shorten</Button>
        </Box>
      </form>
    </Paper>
  );
} 