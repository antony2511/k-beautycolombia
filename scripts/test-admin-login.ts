import bcrypt from 'bcryptjs';

// Simular las variables de entorno
const ADMIN_EMAIL = 'admin@glowseoul.co';
const ADMIN_PASSWORD_HASH = '$2b$10$K04Yuheim2U1LYzsxyJxnO5fiY.kkr20p6P.CnLMWVaPMM6P4P9Fm';
const testPassword = 'Admin2024Secure';

async function test() {
  console.log('Testing admin login...');
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', testPassword);
  console.log('Hash:', ADMIN_PASSWORD_HASH);

  const isValid = await bcrypt.compare(testPassword, ADMIN_PASSWORD_HASH);
  console.log('✅ Password valid:', isValid);

  if (!isValid) {
    console.log('❌ Password verification failed!');
  }
}

test();
