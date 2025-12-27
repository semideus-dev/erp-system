const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const env = {
  databaseUrl: getEnvVar('DATABASE_URL'),
  baseUrl: getEnvVar('BETTER_AUTH_URL'),
  arcjetApiKey: getEnvVar('ARCJET_API_KEY'),
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
  googleSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
};

export default env;
