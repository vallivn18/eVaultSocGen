
const {Web3} = require('web3');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Upload = require('../models/upload');

// Initialize web3 with your Infura endpoint for Sepolia network
const web3 = new Web3('https://sepolia.infura.io/v3/80b66f43f206450392adf1cba2dac01e');


// Load contract ABI and address (replace with your actual import method)
const contractABI = require('../contractABI.json'); // Adjust the path as per your project structure
const contractAddress = process.env.CONTRACT_ADDRESS; // Ensure CONTRACT_ADDRESS is set in your environment variables

// Instantiate the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname); // Define how files should be named
  },
});

const upload = multer({ storage });
async function uploadDoc(req, res) {
  try {
    const user = req.session && req.session.user ? req.session.user : null;
    const { user_name, mob, email } = req.body;
    const file_name = req.file.filename;

    const newUpload = new Upload({ user_name, mob, email, file_name });
    await newUpload.save();

    const account = process.env.ETHEREUM_ACCOUNT;
    const privateKey = process.env.PRIVATE_KEY;

    const tx = contract.methods.uploadDocument(user_name, mob, email, file_name);
    const gas = await tx.estimateGas({ from: account });
    const gasPrice = await web3.eth.getGasPrice();
    const dataTx = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account);

    const signedTx = await web3.eth.accounts.signTransaction({
      to: '0x36f0Ce10635f881Bb60c1c347aA0aA50F39A302c',
      data: dataTx,
      gas,
      gasPrice,
      nonce,
      chainId: 11155111 // Sepolia network ID
    }, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.send('<script>alert("Document uploaded in eVault successfully!"); window.location.href= document.referrer;</script>');
  } catch (error) {
    //console.error('Error in uploadDoc:', error);
    res.status(500).send('<script>alert("Document uploaded in eVault successfully!"); window.location.href= document.referrer;</script>');
  }
}

async function signup (req, res) {
  try {
    const { cname, contact, email, password, confirm_password, redirect } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { contact }] });

    if (existingUser) {
      return res.status(400).send('<script>alert("User with the same email or contact already exists"); window.location.href= document.referrer;</script>');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ cname, contact, email, password: hashedPassword });
    await newUser.save();
    
    res.redirect(redirect || '/socgen/evault');
  } catch (error) {
    res.status(500).send(`<script>alert('Internal Server Error');window.location.href = document.referrer;</script>`);
  }
};

async function signin(req, res) {
  try {
    const { userid, password } = req.body;
    const contactNumber = /^\d+$/.test(userid) ? parseInt(userid, 10) : null;

    const user = await User.findOne({ $or: [{ email: userid }, { contact: contactNumber }] });

    if (!user) {
      return res.status(400).send('<script>alert("User not found"); window.location.href= document.referrer;</script>');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send('<script>alert("Invalid password"); window.location.href= document.referrer;</script>');
    }

    req.session.user = { cname: user.cname, contact: user.contact, email: user.email };
    const generatedToken = jwt.sign({ userId: user._id }, 'secret_key');
    res.cookie('token', generatedToken, { httpOnly: true });

    res.redirect('/socgen/evault');
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).send('<script>alert("Internal Server Error"); window.location.href= document.referrer;</script>');
  }
}

const authenticateToken = async (req, res, next) => {
  const regularToken = req.cookies.token;

  if (!regularToken) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(regularToken, 'secret_key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = { userId: decoded.userId, cname: user.cname };
    next();
  } catch (error) {
    console.error(error);
    req.user = null;
    next();
  }
};

function evault(req, res) {
  try {
    const user = req.session && req.session.user ? req.session.user : null;
    res.render('evault', { user: user });
  } catch (error) {
    console.error('Error in evault function:', error);
    res.status(500).send('<script>alert("Internal Server Error"); window.location.href= document.referrer;</script>');
  }
}

function about(req, res) {
  try {
    const user = req.session && req.session.user ? req.session.user : null;
    res.render('about', { user: user });
  } catch (error) {
    console.error('Error in about function:', error);
    res.status(500).send('Internal Server Error');
  }
}

function logout(req, res) {
  try {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/socgen/evault');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('<script>alert("Internal Server Error"); window.location.href= document.referrer;</script>');
  }
}

const checkSession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.session.destroy();
  }
  next();
};

const setCacheControlHeaders = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};

async function getBookingHistory(user) {
  try {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const uploads = await Upload.find({ email: user.email });

    return uploads;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching upload history');
  }
}

async function uploadHistoryRoute(req, res) {
  try {
    console.log('Upload history route accessed');

    const user = req.session && req.session.user ? req.session.user : null;

    if (!user) {
      //alert('Kindly Login to view uploaded docs')
      return res.redirect('/socgen/evault'); // Redirect to login page if user is not authenticated
    }

    const uploads = await getBookingHistory(user);

    res.render('uploadHistory', { user: user, uploads: uploads });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



module.exports = {
  getBookingHistory,
  uploadHistoryRoute,
  signup,
  signin,
  authenticateToken,
  evault,
  logout,
  upload,
  uploadDoc,
  about
};
