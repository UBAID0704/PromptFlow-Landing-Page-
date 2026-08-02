import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// --- MULTER: IN-MEMORY STORAGE (Vercel filesystem is read-only) ---
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf|docx|txt|csv/;
    const allowedMimeTypes = /jpeg|jpg|png|pdf|plain|csv/;
    const extName = allowedExtensions.test(
      (file.originalname.split('.').pop() || '').toLowerCase()
    );
    const mimeType =
      allowedMimeTypes.test(file.mimetype) ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Only PNG, JPG, JPEG, PDF, DOCX, TXT, and CSV files are allowed.'));
  }
});

// In-Memory "Databases"
// NOTE: On Vercel serverless, these reset between cold starts / can differ
// per instance. Fine for demo purposes, not for real persistence.
const users = [];
let activeSessions = [];
let feedbackSubmissions = [];
let uploadedFiles = [];

let contacts = [
  { id: 1, name: "Sahil", email: "sahil@example.com", message: "Love the dark UI theme!" },
  { id: 2, name: "Alex", email: "alex@example.com", message: "Interested in the Pro subscription plan." }
];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

// --- STANDALONE UPLOAD ENDPOINT ---
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please select a file to upload.' });
    }

    // File lives only in memory for this request — no persistent URL available
    // without external storage (e.g. S3, Cloudinary). We record metadata only.
    const fileRecord = {
      id: Date.now(),
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    uploadedFiles.push(fileRecord);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully!',
      file: fileRecord
    });
  });
});

app.get('/api/uploads', async (req, res) => {
  await delay();
  res.json(uploadedFiles);
});

// --- FEEDBACK ENDPOINTS ---
app.post('/api/feedback', (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'File upload error.',
        fieldErrors: { attachment: err.message }
      });
    }
    next();
  });
}, async (req, res) => {
  await delay(800);

  const { fullName, email, category, rating, experienceDate, comments } = req.body;
  const errors = {};

  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = 'Full Name must be at least 3 characters long.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!category || category === '') {
    errors.category = 'Please select a valid feedback category.';
  }

  const numericRating = Number(rating);
  if (!rating || numericRating < 1 || numericRating > 5) {
    errors.rating = 'Rating must be between 1 and 5 stars.';
  }

  if (experienceDate && new Date(experienceDate) > new Date()) {
    errors.experienceDate = 'Experience date cannot be set in the future.';
  }

  if (!comments || comments.trim().length < 10) {
    errors.comments = 'Feedback comments must be at least 10 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Server-side validation failed.',
      fieldErrors: errors
    });
  }

  const newFeedback = {
    id: Date.now(),
    fullName,
    email,
    category,
    rating: numericRating,
    experienceDate: experienceDate || new Date().toISOString().split('T')[0],
    comments,
    fileName: req.file ? req.file.originalname : null,
    submittedAt: new Date().toISOString()
  };

  feedbackSubmissions.push(newFeedback);

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully!',
    data: newFeedback
  });
});

app.get('/api/feedback', async (req, res) => {
  await delay();
  res.json(feedbackSubmissions);
});

app.put('/api/feedback/:id', verifyToken, async (req, res) => {
  await delay();
  const id = Number(req.params.id);
  const index = feedbackSubmissions.findIndex(f => Number(f.id) === id);
  if (index === -1) return res.status(404).json({ error: "Feedback entry not found." });

  const { fullName, email, category, rating, comments } = req.body;
  feedbackSubmissions[index] = {
    ...feedbackSubmissions[index],
    ...(fullName && { fullName }),
    ...(email && { email }),
    ...(category && { category }),
    ...(rating && { rating: Number(rating) }),
    ...(comments && { comments })
  };

  res.json(feedbackSubmissions[index]);
});

app.delete('/api/feedback/:id', verifyToken, async (req, res) => {
  await delay();
  const id = Number(req.params.id);
  const initialLength = feedbackSubmissions.length;
  feedbackSubmissions = feedbackSubmissions.filter(f => Number(f.id) !== id);

  if (feedbackSubmissions.length === initialLength) {
    return res.status(404).json({ error: "Feedback entry not found." });
  }

  res.json({ message: "Feedback deleted successfully" });
});

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
  await delay();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const existingUser = users.find(u => u.email === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email: email.toLowerCase(), password: hashedPassword };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '2h' });

  activeSessions = activeSessions.filter(s => s.userId !== newUser.id);
  activeSessions.push({ userId: newUser.id, name: newUser.name, email: newUser.email, loggedInAt: new Date().toISOString() });

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

app.post('/api/auth/login', async (req, res) => {
  await delay();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

  activeSessions = activeSessions.filter(s => s.userId !== user.id);
  activeSessions.push({ userId: user.id, name: user.name, email: user.email, loggedInAt: new Date().toISOString() });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.post('/api/auth/logout', verifyToken, (req, res) => {
  if (req.user && req.user.id) {
    activeSessions = activeSessions.filter(s => s.userId !== req.user.id);
  }
  res.json({ message: 'Logged out successfully.' });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin/active-users', (req, res) => {
  res.json({
    totalActiveUsers: activeSessions.length,
    sessions: activeSessions
  });
});

// --- CONTACTS / INQUIRIES ROUTES ---
app.get('/api/contacts', async (req, res) => {
  await delay();
  res.json(contacts);
});

app.post('/api/contacts', async (req, res) => {
  await delay();
  const { name, email, message } = req.body;
  if (!name || !message || !email) {
    return res.status(400).json({ error: "Name, email, and message fields are required." });
  }
  const newContact = { id: Date.now(), name, email, message };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.post('/api/admin/verify', async (req, res) => {
  await delay();
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
    return res.status(200).json({ success: true, authenticated: true });
  }
  return res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/admin/login', async (req, res) => {
  await delay();
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
    const token = jwt.sign({ role: 'admin', name: 'Admin Console' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: "Invalid admin password." });
});

app.put('/api/contacts/:id', verifyToken, async (req, res) => {
  await delay();
  const id = Number(req.params.id);
  const { name, email, message } = req.body;
  const index = contacts.findIndex(c => Number(c.id) === id);
  if (index === -1) return res.status(404).json({ error: "Record not found." });

  contacts[index] = {
    ...contacts[index],
    name: name || contacts[index].name,
    email: email || contacts[index].email,
    message: message || contacts[index].message
  };
  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', verifyToken, async (req, res) => {
  await delay();
  const id = Number(req.params.id);
  contacts = contacts.filter(c => Number(c.id) !== id);
  res.json({ message: "Deleted successfully" });
});

// --- DASHBOARD ANALYTICS ENDPOINT ---
app.get('/api/analytics', async (req, res) => {
  await delay(300);
  const { category = 'all' } = req.query;

  const monthlyData = [
    { month: 'Jan', revenue: 4200, users: 120, storageMB: 350 },
    { month: 'Feb', revenue: 5800, users: 210, storageMB: 520 },
    { month: 'Mar', revenue: 8400, users: 340, storageMB: 780 },
    { month: 'Apr', revenue: 7100, users: 290, storageMB: 640 },
    { month: 'May', revenue: 9600, users: 480, storageMB: 910 },
    { month: 'Jun', revenue: 11200, users: 610, storageMB: 1200 }
  ];

  const categoryDistribution = [
    { name: 'Document Summaries', value: 45, color: '#6366f1' },
    { name: 'Code Analysis', value: 30, color: '#3b82f6' },
    { name: 'Feedback Posts', value: 15, color: '#10b981' },
    { name: 'Other Media', value: 10, color: '#f59e0b' }
  ];

  const recentActivity = [
    { id: 1, action: 'File Uploaded', detail: 'Project_Doc.pdf', time: '10 mins ago' },
    { id: 2, action: 'New User Signup', detail: 'alex@example.com', time: '25 mins ago' },
    { id: 3, action: 'Feedback Received', detail: '5 Stars Rating', time: '1 hour ago' },
    { id: 4, action: 'API Request', detail: 'Code Analysis executed', time: '2 hours ago' }
  ];

  let filteredMonthly = monthlyData;
  if (category === 'revenue') {
    filteredMonthly = monthlyData.map(d => ({ month: d.month, revenue: d.revenue }));
  } else if (category === 'users') {
    filteredMonthly = monthlyData.map(d => ({ month: d.month, users: d.users }));
  } else if (category === 'usage') {
    filteredMonthly = monthlyData.map(d => ({ month: d.month, storageMB: d.storageMB }));
  }

  res.json({
    summaryCards: {
      totalRevenue: '$46,300',
      activeUsers: users.length + 205,
      totalUploads: uploadedFiles.length + 84,
      systemHealth: '99.9%'
    },
    monthlyTrends: filteredMonthly,
    categoryDistribution,
    recentActivity
  });
});

// Local dev only — Vercel invokes the exported app directly, it never calls listen()
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
