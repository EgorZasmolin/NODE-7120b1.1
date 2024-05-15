function emailValidation(email) {
  const emailValidation = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/g;
  return emailValidation.test(email);
}

function passValidation(password) {
  // минимум 8 символов и одна заглавная буква
  const passwordValidation = /^(?=.*[A-Z]).{8,}$/;
  return passwordValidation.test(password);
}

module.exports = {
  emailValidation,
  passValidation,
};
