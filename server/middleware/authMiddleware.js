import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;

    // Check if user exists
    let userExists = await User.findOne({ username });
    if (!userExists) {
      return res.status(404).send({
        error: 'Cannot find the user!',
      });
    }

    next();
  } catch (error) {
    return res.status(404).send({
      error: 'Authentication failed: ' + error,
    });
  }
};

export const authorize = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer ...

    // Retrieve logged in user details
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).send({
      error: 'Authorization failed: ' + error,
    });
  }
};

export const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };

  next();
};
