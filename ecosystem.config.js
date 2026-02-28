module.exports = {
  apps: [
    {
      name: 'kbeauty',
      script: 'npm',
      args: 'start -- -p 3001',
      cwd: '/root/k-beautycolombia',
      env: {
        NODE_ENV: 'production',
        ADMIN_EMAIL: 'deymer.gamba11@gmail.com',
        ADMIN_PASSWORD_HASH: '$2b$12$jNYnR40qqEZWUrckqp9oHONUIIHZTTuRBh467ApKFgFj6fDNsCm9y',
        ADMIN_SECRET_KEY: '3xZ3Lla8XBOV+0zZCsTtEKESP+tIXxdk3fXfFjErQcdWVzobnIYEIGRSr2TPiZ0Q',
      },
    },
  ],
};
