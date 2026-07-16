// ── 1. Visible / Hidden / Enabled / Disabled / Editable ─────────────────────
const panel = document.getElementById('hidden-panel');
const termsCheckbox = document.getElementById('terms-checkbox');
const submitBtn = document.getElementById('submit-btn');
const notesTextarea = document.getElementById('notes-textarea');
const stateOutput = document.getElementById('state-output');

function refreshStateOutput() {
  const panelState = panel.style.display === 'none' ? 'hidden' : 'visible';
  const termsState = termsCheckbox.checked ? 'checked (Submit enabled)' : 'unchecked (Submit disabled)';
  const editableState = notesTextarea.readOnly ? 'read-only' : 'editable';
  stateOutput.textContent = `State: panel ${panelState} · terms ${termsState} · textarea ${editableState}`;
}

document.getElementById('toggle-panel-btn').addEventListener('click', () => {
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  refreshStateOutput();
});

document.getElementById('terms-toggle-btn').addEventListener('click', () => {
  termsCheckbox.checked = !termsCheckbox.checked;
  submitBtn.disabled = !termsCheckbox.checked;
  refreshStateOutput();
});

termsCheckbox.addEventListener('change', () => {
  submitBtn.disabled = !termsCheckbox.checked;
  refreshStateOutput();
});

document.getElementById('toggle-readonly-btn').addEventListener('click', () => {
  notesTextarea.readOnly = !notesTextarea.readOnly;
  refreshStateOutput();
});

// ── 2. Text Content ──────────────────────────────────────────────────────────
let count = 0;
document.getElementById('increment-btn').addEventListener('click', () => {
  count++;
  document.getElementById('counter-text').textContent = `Count: ${count}`;
});

// ── 3. Input Value ───────────────────────────────────────────────────────────
document.getElementById('fill-username-btn').addEventListener('click', () => {
  document.getElementById('username-input').value = 'qa_engineer';
});
document.getElementById('clear-username-btn').addEventListener('click', () => {
  document.getElementById('username-input').value = '';
});

// ── 5. Class & CSS ───────────────────────────────────────────────────────────
document.getElementById('toggle-status-btn').addEventListener('click', () => {
  const badge = document.getElementById('status-badge');
  const isActive = badge.classList.contains('active');
  badge.classList.toggle('active', !isActive);
  badge.classList.toggle('inactive', isActive);
  badge.textContent = isActive ? 'Inactive' : 'Active';
});

// ── 6. Attribute ─────────────────────────────────────────────────────────────
document.getElementById('switch-user-btn').addEventListener('click', () => {
  const link = document.getElementById('profile-link');
  const isAdmin = link.getAttribute('href') === '/profile/admin';
  link.setAttribute('href', isAdmin ? '/profile/guest' : '/profile/admin');
  link.setAttribute('title', isAdmin ? 'Guest profile' : 'Admin profile');
});

// ── 7. Element Count ─────────────────────────────────────────────────────────
document.getElementById('add-item-btn').addEventListener('click', () => {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.textContent = 'New task';
  document.getElementById('todo-list').appendChild(li);
});
document.getElementById('remove-item-btn').addEventListener('click', () => {
  const list = document.getElementById('todo-list');
  if (list.lastElementChild) list.removeChild(list.lastElementChild);
});

// ── 8. Focus ─────────────────────────────────────────────────────────────────
document.getElementById('focus-input-btn').addEventListener('click', () => {
  document.getElementById('focus-target-input').focus();
});
