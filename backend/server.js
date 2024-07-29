const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const autoIncrement = require('mongoose-sequence')(mongoose);
const path = require('path');  // Ensure you import path module
const fs = require('fs');  // Ensure you import fs module
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connections
const registerDetailsURI = 'mongodb+srv://arunbalsen27:arun1230909@cluster1.eq2hjb6.mongodb.net/register_details';
const employeeDetailsURI = 'mongodb+srv://arunbalsen27:arun1230909@cluster1.eq2hjb6.mongodb.net/employee_details';

// Connection to MongoDB
mongoose.connect(registerDetailsURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model (register_details database)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Connection to employee_details
const employeeConnection = mongoose.createConnection(employeeDetailsURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Employee Schema and Model (employee_details database)
const employeeSchema = new mongoose.Schema({
  f_Id: { type: Number, unique: true },
  f_Image: { type: String, required: true },
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  f_Mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  f_Designation: { type: String, required: true },
  f_Gender: { type: String, required: true },
  f_Course: { type: [String], required: true },
  f_CreateDate: { type: Date, default: Date.now }
});

// Apply auto-increment plugin to employeeSchema
employeeSchema.plugin(autoIncrement, { inc_field: 'f_Id' });

const Employee = employeeConnection.model('Employee', employeeSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add employee route
app.post('/employees', upload.single('f_Image'), async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;
    const f_Image = req.file ? req.file.filename : null;

    if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course || !f_Image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (f_Mobile.length !== 10) {
      return res.status(400).json({ error: 'Mobile number must be 10 digits' });
    }

    const existingEmail = await Employee.findOne({ f_Email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newEmployee = new Employee({
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: Array.isArray(f_Course) ? f_Course : [f_Course]
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employees route
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: error.message });
  }
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
