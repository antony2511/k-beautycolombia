import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'Admin2024!Secure';
const hash = bcrypt.hashSync(password, 10);

console.log('='.repeat(60));
console.log('ADMIN PASSWORD HASH GENERATED');
console.log('='.repeat(60));
console.log(`\nPassword: ${password}`);
console.log(`\nHash: ${hash}`);
console.log('\nAdd this to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('\n' + '='.repeat(60));
