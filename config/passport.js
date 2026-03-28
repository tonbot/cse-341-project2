const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');
const { ObjectId } = require('mongodb');

const mongodb = require('../data/database');

const REQUIRED_AUTH_ENV_VARS = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'SESSION_SECRET'];

const isUnsetConfigValue = (value) => {
  if (!value) {
    return true;
  }

  const normalizedValue = value.trim().toLowerCase();

  return (
    normalizedValue.length === 0 ||
    normalizedValue.includes('replace-with') ||
    normalizedValue.includes('your-github') ||
    normalizedValue.includes('<')
  );
};

const getMissingAuthConfig = () =>
  REQUIRED_AUTH_ENV_VARS.filter((variableName) => isUnsetConfigValue(process.env[variableName]));

const isAuthConfigured = () => getMissingAuthConfig().length === 0;

const getBaseUrl = () => {
  const port = process.env.PORT || 3000;
  const configuredBaseUrl =
    process.env.BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.NODE_ENV === 'production' ? process.env.PUBLIC_API_URL : null) ||
    `http://localhost:${port}`;

  return configuredBaseUrl.replace(/\/$/, '');
};

const getUsersCollection = () =>
  mongodb.getDb().db(process.env.DB_NAME).collection('users');

const mapGithubProfileToUser = (profile) => {
  const primaryEmail =
    profile.emails?.find((email) => email.verified)?.value || profile.emails?.[0]?.value || null;

  return {
    githubId: profile.id,
    username: profile.username || profile._json?.login || null,
    displayName: profile.displayName || profile.username || 'GitHub User',
    email: primaryEmail,
    avatarUrl: profile.photos?.[0]?.value || profile._json?.avatar_url || null,
    profileUrl: profile.profileUrl || profile._json?.html_url || null,
    provider: 'github',
    updatedAt: new Date()
  };
};

const syncGithubUser = async (profile) => {
  const usersCollection = getUsersCollection();
  const userPayload = mapGithubProfileToUser(profile);

  await usersCollection.updateOne(
    { githubId: profile.id },
    {
      $set: userPayload,
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  return usersCollection.findOne({ githubId: profile.id });
};

let passportConfigured = false;

const configurePassport = () => {
  if (passportConfigured || !isAuthConfigured()) {
    return;
  }

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (!ObjectId.isValid(id)) {
        return done(null, false);
      }

      const user = await getUsersCollection().findOne({ _id: new ObjectId(id) });
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${getBaseUrl()}/auth/github/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await syncGithubUser(profile);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passportConfigured = true;
};

module.exports = {
  passport,
  configurePassport,
  getBaseUrl,
  getMissingAuthConfig,
  isAuthConfigured
};
