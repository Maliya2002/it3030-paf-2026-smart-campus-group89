const USERS_KEY = 'smart-campus-users';
const CURRENT_USER_KEY = 'smart-campus-current-user';

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

  const newUser = {
    fullName: user.fullName.trim(),
    email: normalizedEmail,
    password: user.password,
    role: 'Campus User'
  };

  const updatedUsers = [...existingUsers, newUser];
  saveStoredUsers(updatedUsers);
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

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
  return matchedUser;
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch (error) {
    return null;
  }
}

export function signOutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}
