// middleware.js
const jwt = require('jsonwebtoken');
// Middleware xác thực quyền truy cập dựa trên vai trò
exports.authorizeRole = (role) => {
  return (req, res, next) => {
    try {
      if (req.session.user && req.session.user.role === role) {
        next();
      } else {
        res.status(403).json({ message: "Access forbidden: Insufficient rights" });
      }
    } catch (error) {
      console.error("Error in authorizeRole middleware:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

// Middleware xác thực token
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    // console.log(req.headers); //undefined
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        error: 'Token not provided'
      });
    }

    // Tách phần "Bearer " ra để chỉ lấy token
    const token = authHeader.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        code: 401,
        error: 'Invalid token format'
      });
    }

    // Xác minh token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          code: 403,
          error: 'Invalid or expired token'
        });
      }

      // Lưu thông tin đã giải mã vào `req` để sử dụng ở các middleware/controller sau
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Middleware kiểm tra đăng nhập
// exports.loginRequired = (req, res, next) => {
//   if (req.session && req.session.user) {
//     return next();
//   } else {
//     return res.status(401).json({ message: "Login required" });
//   }
// };
