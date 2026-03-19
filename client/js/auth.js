import { api, setToken } from './api.js';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const messageElement = document.getElementById('auth-message');

function showMessage(message) {
  messageElement.textContent = message;
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(registerForm).entries());

  try {
    const response = await api.register(payload);
    setToken(response.token);
    showMessage('Registration successful. You are now logged in.');
    registerForm.reset();
  } catch (error) {
    showMessage(error.message);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(loginForm).entries());

  try {
    const response = await api.login(payload);
    setToken(response.token);
    showMessage('Login successful. Open the dashboard to manage posts.');
    loginForm.reset();
  } catch (error) {
    showMessage(error.message);
  }
});

