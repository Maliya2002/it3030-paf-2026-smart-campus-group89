const USERS_KEY = 'smart-campus-users';
const TOKEN_KEY = 'smart-campus-token';
const CURRENT_USER_KEY = 'smart-campus-current-user';

function normalizeRole(role) {
  const value = String(role || '').trim().toUpperCase();
  return value === 'ADMIN' ? 'ADMIN' : 'USER';
}

export function setAuthSession(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: normalizeRole(authResponse.role)
    })
  );
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch (error) {
    return null;
  }
}

export function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    return [];
  }
}

export function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(user) {
  const existingUsers = getStoredUsers();
  const normalizedEmail = user.email.trim().toLowerCase();
  const alreadyExists = existingUsers.some(
    (existingUser) => existingUser.email.toLowerCase() === normalizedEmail
  );

  if (alreadyExists) {
    throw new Error('An account with this email already exists.');
  }

  const normalizedRole = normalizeRole(user.role);
  const newUser = {
    fullName: user.fullName.trim(),
    email: normalizedEmail,
    password: user.password,
    role: normalizedRole
  };

  const updatedUsers = [...existingUsers, newUser];
  saveStoredUsers(updatedUsers);
  localStorage.setItem(TOKEN_KEY, `local-demo:${newUser.email}:${newUser.role}`);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return newUser;
}

export function signInUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const matchedUser = getStoredUsers().find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    throw new Error('Invalid email or password.');
  }

  const normalizedRole = normalizeRole(matchedUser.role);
  const normalizedUser = { ...matchedUser, role: normalizedRole };
  localStorage.setItem(TOKEN_KEY, `local-demo:${normalizedUser.email}:${normalizedUser.role}`);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));
  return normalizedUser;
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  if (!user || !user.role) {
    return false;
  }
  return roles.includes(user.role);
}

export function signOutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken() && getCurrentUser());
}
