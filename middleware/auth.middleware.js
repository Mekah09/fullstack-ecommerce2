const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth.model.js");

async function protect(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in",
    });
  }

  const token = authorization.slice(7);
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded.sub !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(decoded.sub)
    ) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  try {
    // Read the current role from the database on every request.
    const user = await Auth.findById(decoded.sub)
      .select("_id role verified isActive");

    if (!user || !user.verified || !user.isActive) {
      return res.status(403).json({
        message: "Account access denied",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not check account access",
    });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    return next();
  };
}

module.exports = { protect, allowRoles };