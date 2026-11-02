'use strict';

const form = document.getElementById('login-form');
const fields = document.getElementById('login-fields');
const username = document.getElementById('username');
const password = document.getElementById('password');
const feedback = document.getElementById('feedback');
const loginView = document.getElementById('login-view');
const successView = document.getElementById('success-view');
const successHeading = document.getElementById('success-heading');
const unavailableMessage = 'Login service unavailable. Please try again.';
let submitting = false;

fields.disabled = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting) {
    return;
  }

  // Never send credentials from a plaintext copy of the page.
  if (window.location.protocol !== 'https:') {
    password.value = '';
    feedback.textContent = 'Open this demo over trusted local HTTPS to submit.';
    return;
  }

  submitting = true;
  fields.disabled = true;
  form.setAttribute('aria-busy', 'true');
  feedback.textContent = 'Checking credentials…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const request = fetch('/api/login', {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
      signal: controller.signal,
    });
    password.value = '';
    const response = await request;

    if (response.status === 401) {
      feedback.textContent = 'Invalid username or password.';
      return;
    }

    if (response.status !== 200 || (await response.json()).accepted !== true) {
      feedback.textContent = unavailableMessage;
      return;
    }

    form.reset();
    loginView.hidden = true;
    successView.hidden = false;
    feedback.textContent = '';
    successHeading.focus();
  } catch {
    feedback.textContent = unavailableMessage;
  } finally {
    clearTimeout(timeout);
    password.value = '';
    fields.disabled = false;
    form.removeAttribute('aria-busy');
    submitting = false;
  }
});
