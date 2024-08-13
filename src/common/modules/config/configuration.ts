export default () => ({
  port: parseInt(process.env.PORT, 10),
  bcrypt_salt: Number(process.env.BCRYPT_SALT),
  jwt: {
    secret: process.env.TOKEN_SECRET,
    access_time: process.env.ACCESS_TOKEN,
    refresh_time: process.env.REFRESH_TOKEN,
  },
  mail: {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
  },
});
