module.exports = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: `Все поля должны быть заполнены` });
  }

  if (!isValidPassword(password)) {
    res.status(400).json({
      error: `Ваш пароль должен быть не менее 8 символов, содержать хотя бы одну цифру, одну заглавную и одну строчную букву`,
    });
    return res.redirect(`/login`);
  }
  if (!validateEmail(email)) {
    res.status(400).json({ error: "Введите правильную почту" });
    return res.redirect(`/login`);
  }
  next();
};

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}
function isValidPassword(pass) {
  const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passPattern.test(pass);
}
