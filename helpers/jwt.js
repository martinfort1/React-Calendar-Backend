const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid, name }, 
      process.env.SECRET_JWT_SEED, 
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
