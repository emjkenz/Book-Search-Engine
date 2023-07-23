const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ errors: [{ message: 'Authentication token missing' }] });
    }

    // Token format: "Bearer <tokenvalue>"
    const tokenValue = token.split(' ')[1];

    if (!tokenValue) {
      return res.status(401).json({ errors: [{ message: 'Invalid token format' }] });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(tokenValue, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (error) {
      console.log('Invalid token');
      return res.status(401).json({ errors: [{ message: 'Invalid token' }] });
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
