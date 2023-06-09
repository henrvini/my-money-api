const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./user");

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

const login = (req, res, next) => {
  const email = req.body.email || "";
  const password = req.body.password || "";

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, process.env.AUTH_SECRET, {
        expiresIn: "1 day",
      });
      const { name, email } = user;
      res.json({ name, email, token });
    } else {
      return res.status(400).send({ errors: ["Usuário/Senha inválidos"] });
    }
  });
};

const validateToken = (req, res, next) => {
  const token = req.body.token || "";

  jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
    return res.status(200).send({ valid: !err });
  });
};

const signup = (req, res, next) => {
  const name = req.body.name || "";
  const email = req.body.email || "";
  const password = req.body.password || "";
  const confirmPassword = req.body.confirm_password || "";
  const ErrorMsg =
    "Senha precisa ter: letra maiáscula, letra mináscula, número, caractere especial(@#$%) e tamanho entre 6-20.";

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ["o e-mail informado é inválido"] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [ErrorMsg],
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ["Senhas não conferem."] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).send({ errors: ["Usuário já cadastrado."] });
    } else {
      const newUser = new User({ name, email, password: passwordHash });
      newUser.save((err) => {
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      });
    }
  });
};

module.exports = { login, signup, validateToken };
