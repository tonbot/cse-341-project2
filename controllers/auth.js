const buildUserResponse = (user) => ({
  _id: user._id,
  githubId: user.githubId,
  username: user.username,
  displayName: user.displayName,
  email: user.email,
  avatarUrl: user.avatarUrl,
  profileUrl: user.profileUrl,
  provider: user.provider,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const getStatus = (req, res) => {
  res.status(200).json({
    isAuthenticated: Boolean(req.user),
    user: req.user ? buildUserResponse(req.user) : null
  });
};

const getCurrentUser = (req, res) => {
  res.status(200).json({
    user: buildUserResponse(req.user)
  });
};

const getProtectedContent = (req, res) => {
  res.status(200).json({
    message: 'This members-only library content is available only after login.',
    user: buildUserResponse(req.user),
    membersOnlyContent: [
      'You can create, update, and delete authors.',
      'You can create, update, and delete books.',
      'You can access your authenticated profile details.'
    ]
  });
};

const handleGithubCallback = (req, res) => {
  res.redirect('/api-docs');
};

const handleLoginFailure = (req, res) => {
  res.status(401).json({
    error: 'GitHub login failed'
  });
};

const logout = (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    if (!req.session) {
      return res.status(200).json({ message: 'Logged out successfully' });
    }

    return req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

module.exports = {
  getStatus,
  getCurrentUser,
  getProtectedContent,
  handleGithubCallback,
  handleLoginFailure,
  logout
};
