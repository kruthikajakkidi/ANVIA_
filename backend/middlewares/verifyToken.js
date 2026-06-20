import jwt from "jsonwebtoken";

function verifyToken(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message: "token missing"
        });
      }

      const token =
        authHeader.split(" ")[1];

      const decodedToken =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      req.user = decodedToken;

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
          decodedToken.role
        )
      ) {
        return res.status(403).json({
          message: "access denied"
        });
      }

      next();
    } catch (err) {
      res.status(401).json({
        message: "invalid token"
      });
    }
  };
}

export default verifyToken;