const getField = (req, parsedField) => {
  value = req.body[parsedField[0]][parsedField[1]];
  return value;
};

function parseField(field) {
  return field.split(/\[|\]/).filter((s) => s);
}

exports.required = (field) => {
  let parsedField = parseField(field);
  return (req, res, next) => {
    if (getField(req, parsedField)) {
      next();
    } else {
      res.error(`Поле ${parsedField.join(" ")} не заполнено`); //готовит сообщение пользователю
      res.redirect("back");
    }
  };
};

exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      res.error(`Поле ${field.join(" ")} должно быть более 4 знаков`); //готовит сообщение пользователю
      res.redirect("back");
    }
  };
};
