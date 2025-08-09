const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Minimal server is running!' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'test-token-123',
        admin: {
          id: '1',
          username: 'admin',
          email: 'admin@motorrepairshop.com',
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({
      error: 'Invalid credentials',
      message: 'Username or password is incorrect'
    });
  }
});

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/health`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
