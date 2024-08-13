export default () => ({
  port: parseInt(process.env.PORT, 10) || 5050,
  jwtSecret: process.env.JWT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  mongodbUri: process.env.MONGODB_URI,
});
