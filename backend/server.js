const express = require('express');
const cors = require('cors');
const loggingMiddleware = require('./middleware/logging');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use('/shorturls', require('./routes/shorturls'));
app.use('/log', require('./routes/log'));

// Redirect route (handled separately)
app.get('/:shortcode', require('./routes/redirect'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 