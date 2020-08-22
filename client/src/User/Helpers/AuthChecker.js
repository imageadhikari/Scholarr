const isAuthenticated = (isLoggedIn) => {
  if (isLoggedIn) return true;
  else return false;
};

module.exports = AuthChecker;
