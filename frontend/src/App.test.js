import { getCurrentUser, registerUser, signInUser, signOutUser } from './utils/auth';

test('registers and signs in a user with local auth storage', () => {
  window.localStorage.clear();

  registerUser({
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'secret123'
  });

  signOutUser();
  signInUser('test@example.com', 'secret123');

  expect(getCurrentUser()).toMatchObject({
    fullName: 'Test User',
    email: 'test@example.com'
  });
});
