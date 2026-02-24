const bcrypt = require('bcryptjs');

const hash = '$2b$10$K04Yuheim2U1LYzsxyJxnO5fiY.kkr20p6P.CnLMWVaPMM6P4P9Fm';
const password = 'Admin2024Secure';

bcrypt.compare(password, hash).then(result => {
  console.log('Hash:', hash);
  console.log('Password:', password);
  console.log('Result:', result);
});
