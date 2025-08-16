const bcrypt = require('bcryptjs');

const hash = '$2a$12$jWBj6lkPex6.0OaCgV8jCuxxEri/9vSeDSP/kh30MbdQwCwnXB9uG';

// Попробуем разные пароли
const passwords = ['password', 'admin123', 'admin', '123456', 'qwerty', 'test'];

for (const password of passwords) {
  const isValid = bcrypt.compareSync(password, hash);
  console.log(`Password "${password}": ${isValid ? 'VALID' : 'invalid'}`);
}
