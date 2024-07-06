import User from '../models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

/* ####################################
            BASIC USER ROUTES
#################################### */

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // Check if user exists
    const usernameExists = new Promise((resolve, reject) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ error: 'User with this username already exists.' });
        resolve();
      });
    });

    const emailExists = new Promise((resolve, reject) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ error: 'User with this email already exists.' });
        resolve();
      });
    });

    // Hashing Password & Creating new user
    Promise.all([usernameExists, emailExists])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const newUser = new User({
                username: username,
                password: hashedPassword,
                profile: profile || '',
                email: email,
              });

              newUser
                .save()
                .then((result) =>
                  res.status(201).send({
                    message: 'User registered successfully!',
                    user: result,
                  })
                )
                .catch((error) => {
                  res.status(500).send({
                    error:
                      'Something went wrong while creating the user: ' + error,
                  });
                });
            })
            .catch((error) => {
              return res.status(500).send({
                error: 'Password hashing went wrong: ' + error,
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error: 'User already exists: ' + error });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while registering the user: ' + error,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    User.findOne({ username: username })
      .then((user) => {
        // Comparing Passwords
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({
                error: 'Password does not match',
              });
            }

            // Creating JWT
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              {
                expiresIn: '24h',
              }
            );

            return res.status(200).send({
              message: `${user.username} logged in successfully!`,
              username: user.username,
              token: token,
            });
          })
          .catch((error) => {
            return res.status(400).send({
              error: 'Password does not match: ' + error,
            });
          });
      })
      .catch((error) => {
        return res.status(404).send({
          error: 'User not found: ' + error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while logging in the user: ' + error,
    });
  }
};

// GET /api/auth/user
export const getUsers = async (req, res) => {
  try {
    User.find((err, users) => {
      if (err) {
        return res.status(500).send({
          error: 'Something went wrong while fetching users: ' + err,
        });
      }

      if (!users) {
        return res.status(501).send({
          error: 'Could not find users',
        });
      }

      return res.status(200).send(users);
    });
  } catch (error) {
    return res.status(404).send({
      error: 'Users not found: ' + error,
    });
  }
};

// GET /api/auth/user/:username
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(501).send({
        error: 'Invalid username',
      });
    }

    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return res.status(500).send({
          error: 'Something went wrong while fetching the user: ' + err,
        });
      }

      if (!user) {
        return res.status(501).send({
          error: 'Could not find the user',
        });
      }

      const { password, ...rest } = user;

      return res.status(200).send(rest._doc);
    });
  } catch (error) {
    return res.status(404).send({
      error: 'User not found: ' + error,
    });
  }
};

// PUT /api/auth/updateUser/:id
export const updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const { userId } = req.user;

    if (userId) {
      const body = req.body;
      User.updateOne({ _id: userId }, body, (err, data) => {
        if (err) throw err;

        return res.status(201).send({
          message: 'User information updated',
          user: data,
        });
      });
    } else {
      return res.status(401).send({
        error: 'No ID provided: ' + error,
      });
    }
  } catch (error) {
    return res.status(401).send({
      error: 'Something went wrong while updating user data: ' + error,
    });
  }
};

/* ####################################
        RESET PASSWORD ROUTES
#################################### */

// GET /api/auth/generateOTP
export const generateOTP = async (req, res) => {
  const code = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  req.app.locals.OTP = code;

  res.status(201).send({ code: code });
};

// GET /api/auth/verifyOTP
export const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;

    return res.status(201).send({ message: 'OTP Verified Successfully' });
  }

  return res.status(400).send({
    error: 'Invalid OTP',
  });
};

// GET /api/auth/createResetSession
export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({
      flag: req.app.locals.resetSession,
    });
  }

  return res.status(440).send({
    message: 'Session Expired.',
  });
};

// PUT /api/auth/resetPassword
export const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({
        message: 'Session Expired.',
      });
    }

    const { username, password } = req.body;

    try {
      User.findOne({ username: username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              User.updateOne(
                { username: user.username },
                { password: hashedPassword },
                (error, data) => {
                  if (error) throw error;
                  req.app.locals.resetSession = false;
                  return res.status(201).send({
                    message: 'Password Updated',
                    data: data,
                  });
                }
              );
            })
            .catch((error) => {
              return res.status(500).send({
                error: 'Something went wrong while hashing password: ' + error,
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({
            error: 'User not found: ' + error,
          });
        });
    } catch (error) {
      return res.status(500).send({
        error: 'Something went wrong while resetting the password: ' + error,
      });
    }
  } catch (error) {
    return res.status(401).send({
      error: 'Something went wrong: ' + error,
    });
  }
};

/* ####################################
              MAILER
#################################### */

let gmailConfig = {
  service: 'gmail',
  auth: {
    user: ENV.GMAIL_EMAIL,
    pass: ENV.GMAIL_PASS,
  },
};

let etherealConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.ETHEREAL_EMAIL,
    pass: ENV.ETHEREAL_PASS,
  },
};

let transporter = nodemailer.createTransport(gmailConfig);

let MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js',
  },
});

// POST /api/auth/registerMail
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // Email Body
  let email = {
    body: {
      name: username || 'AttendanceSystem',
      intro:
        text ||
        'Welcome to AttendanceSystem! We are very excited to have you on board.',
      outro:
        'Need help? Just reply to this email and we will come back to you as soon as possible!',
    },
  };

  let emailBody = MailGenerator.generate(email);
  let message = {
    from: ENV.ETHEREAL_EMAIL,
    to: userEmail,
    subject: subject || 'AttendanceSystem',
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).send({
        message: 'You should receive an email.',
      });
    })
    .catch((error) => {
      return res.status(500).send({
        error: 'Something went wrong while sending an email: ' + error,
      });
    });
};

// POST /api/auth/icsMail
export const icsMail = async (req, res) => {
  const {
    username,
    userEmail,
    text,
    subject,
    attachmentName,
    attachmentContent,
  } = req.body;

  // Email Body
  let email = {
    body: {
      name: username || 'AttendanceSystem',
      intro:
        text ||
        'You added new event to your AttendanceSystem. If you want to add it to your mobile phone calendar open the attchment!',
      outro:
        'Need help? Just reply to this email and we will come back to you as soon as possible!',
    },
  };

  let emailBody = MailGenerator.generate(email);
  let message = {
    from: ENV.ETHEREAL_EMAIL,
    to: userEmail,
    subject: subject || 'AttendanceSystem',
    html: emailBody,
    attachments: [
      {
        filename: attachmentName || 'congrats.txt',
        content: attachmentContent || 'Welcome to AttendanceSystem',
      },
    ],
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).send({
        message: 'You should receive an email.',
      });
    })
    .catch((error) => {
      return res.status(500).send({
        error: 'Something went wrong while sending an email: ' + error,
      });
    });
};
