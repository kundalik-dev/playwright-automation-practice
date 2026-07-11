function setOutput(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

// ── Section 1: getByRole – Buttons ──────────────────────────────────────────
document.getElementById('btn-primary').addEventListener('click', () =>
  setOutput('role-output', 'Primary Action button was clicked'));

document.getElementById('btn-icon').addEventListener('click', () =>
  setOutput('role-output', 'Close dialog (✕) button [aria-label="Close dialog"] was clicked'));

document.getElementById('btn-submit').addEventListener('click', () =>
  setOutput('role-output', 'Submit Order button was clicked'));

document.getElementById('div-btn').addEventListener('click', () =>
  setOutput('role-output', 'Div Button [role="button"] was clicked'));

document.getElementById('dark-mode-toggle').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const isOn = btn.getAttribute('aria-checked') === 'true';
  btn.setAttribute('aria-checked', String(!isOn));
  setOutput('role-output', `Dark Mode [role="switch"] toggled: ${!isOn ? 'ON' : 'OFF'}`);
});

// ── Section 4: getByText – Buttons ──────────────────────────────────────────
document.getElementById('btn-save').addEventListener('click', () =>
  setOutput('text-output', '"Save Changes" button was clicked'));

document.getElementById('btn-cancel').addEventListener('click', () =>
  setOutput('text-output', '"Cancel" button was clicked'));

document.getElementById('btn-delete').addEventListener('click', () =>
  setOutput('text-output', '"Delete Account" button was clicked'));

document.getElementById('btn-export').addEventListener('click', () =>
  setOutput('text-output', '"Export CSV" button was clicked'));

document.getElementById('btn-get-started-free').addEventListener('click', () =>
  setOutput('text-output', '"Get Started Free" button (inside #card-free) was clicked'));

document.getElementById('btn-pro-trial').addEventListener('click', () =>
  setOutput('text-output', '"Start Pro Trial" button (inside #card-pro) was clicked'));

// ── Section 6: getByTitle – Buttons ─────────────────────────────────────────
document.getElementById('btn-save-title').addEventListener('click', () =>
  setOutput('title-output', '💾 Save button [title="Save your work"] was clicked'));

document.getElementById('btn-print-title').addEventListener('click', () =>
  setOutput('title-output', '🖨️ Print button [title="Print this page"] was clicked'));

// ── Section 7: getByTestId – Buttons ─────────────────────────────────────────
document.getElementById('testid-login').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="login-btn"] Login button was clicked'));

document.getElementById('testid-logout').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="logout-btn"] Logout button was clicked'));

document.getElementById('testid-signup').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="signup-btn"] Sign Up button was clicked'));

document.querySelector('[data-testid="edit-profile-btn"]').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="edit-profile-btn"] Edit Profile button was clicked'));

document.querySelector('[data-testid="view-order-1"]').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="view-order-1"] View button for Order #1001 was clicked'));

document.querySelector('[data-testid="view-order-2"]').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="view-order-2"] View button for Order #1002 was clicked'));

document.querySelector('[data-testid="view-order-3"]').addEventListener('click', () =>
  setOutput('testid-output', '[data-testid="view-order-3"] View button for Order #1003 was clicked'));

// ── Section 8: Filtering – item buttons ──────────────────────────────────────
document.querySelectorAll('.item-btn').forEach(btn => {
  btn.addEventListener('click', () =>
    setOutput('filter-output', `"${btn.textContent}" button [data-item="${btn.dataset.item}"] was clicked`));
});

document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.closest('li').querySelector('.name').textContent;
    const price = btn.closest('li').querySelector('.price').textContent;
    setOutput('filter-output', `"Add" button clicked → ${name} (${price}) added to cart`);
  });
});

document.querySelectorAll('.user-card .card-btn').forEach(btn => {
  btn.addEventListener('click', () =>
    setOutput('filter-output', `"${btn.textContent}" button [aria-label="${btn.getAttribute('aria-label')}"] was clicked`));
});

// ── Section 9: Tables ─────────────────────────────────────────────────────────
document.querySelectorAll('#employees-table button').forEach(btn => {
  btn.addEventListener('click', () =>
    setOutput('table-output', `"${btn.textContent}" button [aria-label="${btn.getAttribute('aria-label')}"] was clicked`));
});

// ── Section 15: CSS/XPath attribute buttons ───────────────────────────────────
document.querySelector('[data-action="confirm"]').addEventListener('click', () =>
  setOutput('misc-output', '[data-action="confirm"] Confirm button was clicked'));

document.querySelector('[data-action="cancel"]').addEventListener('click', () =>
  setOutput('misc-output', '[data-action="cancel"] Cancel button was clicked'));

// ── Section 14: Dynamic Elements ─────────────────────────────────────────────
document.getElementById('load-data-btn').addEventListener('click', () => {
  const el = document.getElementById('lazy-content');
  el.style.display = 'none';
  setOutput('dynamic-output', 'Load Data clicked – waiting 1.5s for lazy content to appear...');
  setTimeout(() => {
    el.style.display = 'block';
    setOutput('dynamic-output', 'Lazy content is now visible (toBeVisible assertion should pass)');
  }, 1500);
});

document.getElementById('show-toast-btn').addEventListener('click', () => {
  const t = document.getElementById('toast-msg');
  t.style.display = 'block';
  setOutput('dynamic-output', 'Show Toast clicked – toast visible, will auto-hide in 3s');
  setTimeout(() => {
    t.style.display = 'none';
    setOutput('dynamic-output', 'Toast hidden (toBeHidden assertion should pass now)');
  }, 3000);
});

document.getElementById('submit-order-btn').addEventListener('click', () => {
  const spinner = document.getElementById('spinner');
  const confirmed = document.getElementById('order-confirmed');
  confirmed.style.display = 'none';
  spinner.style.display = 'block';
  setOutput('dynamic-output', 'Place Order clicked – spinner visible, processing for 2s...');
  setTimeout(() => {
    spinner.style.display = 'none';
    confirmed.style.display = 'block';
    setOutput('dynamic-output', 'Order confirmed – spinner hidden, confirmation visible');
  }, 2000);
});

// ── Section 13: Registration Form ────────────────────────────────────────────
document.getElementById('registration-form').addEventListener('submit', (e) => {
  e.preventDefault();
  setOutput('form-output', 'Create Account button clicked – form submitted successfully!');
});

// ── Section 12: File upload preview ──────────────────────────────────────────
['upload-avatar', 'upload-resume', 'upload-docs'].forEach(id => {
  document.getElementById(id).addEventListener('change', (e) => {
    const files = Array.from(e.target.files).map(f => f.name).join(', ');
    document.getElementById('file-preview').textContent = files
      ? `Files selected via [id="${id}"]: ${files}`
      : '';
  });
});
