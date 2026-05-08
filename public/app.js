const STORAGE_KEY = "condoBillingDemo";
const SESSION_KEY = "condoBillingLoggedIn";
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const state = loadState();
let selectedBillId = state.bills[0]?.id || null;

const els = {
  loginScreen: document.querySelector("#loginScreen"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  loginUsername: document.querySelector("#loginUsername"),
  loginPassword: document.querySelector("#loginPassword"),
  loginMessage: document.querySelector("#loginMessage"),
  logoutBtn: document.querySelector("#logoutBtn"),
  tenantForm: document.querySelector("#tenantForm"),
  tenantId: document.querySelector("#tenantId"),
  tenantName: document.querySelector("#tenantName"),
  unitNumber: document.querySelector("#unitNumber"),
  tenantContact: document.querySelector("#tenantContact"),
  monthlyRent: document.querySelector("#monthlyRent"),
  tenantMessage: document.querySelector("#tenantMessage"),
  tenantList: document.querySelector("#tenantList"),
  cancelTenantEdit: document.querySelector("#cancelTenantEdit"),
  chargeForm: document.querySelector("#chargeForm"),
  chargeId: document.querySelector("#chargeId"),
  chargeLabel: document.querySelector("#chargeLabel"),
  chargeCategory: document.querySelector("#chargeCategory"),
  chargeAmount: document.querySelector("#chargeAmount"),
  chargeMessage: document.querySelector("#chargeMessage"),
  chargeList: document.querySelector("#chargeList"),
  cancelChargeEdit: document.querySelector("#cancelChargeEdit"),
  billingForm: document.querySelector("#billingForm"),
  billingTenant: document.querySelector("#billingTenant"),
  billingMonth: document.querySelector("#billingMonth"),
  dueDate: document.querySelector("#dueDate"),
  billNotes: document.querySelector("#billNotes"),
  chargePicker: document.querySelector("#chargePicker"),
  billingMessage: document.querySelector("#billingMessage"),
  billHistory: document.querySelector("#billHistory"),
  billPreview: document.querySelector("#billPreview"),
  printBillBtn: document.querySelector("#printBillBtn"),
  seedDemoBtn: document.querySelector("#seedDemoBtn"),
  clearDataBtn: document.querySelector("#clearDataBtn"),
  tenantCount: document.querySelector("#tenantCount"),
  chargeCount: document.querySelector("#chargeCount"),
  billCount: document.querySelector("#billCount"),
  latestTotal: document.querySelector("#latestTotal"),
};

els.loginForm.addEventListener("submit", handleLogin);
els.logoutBtn.addEventListener("click", handleLogout);
els.tenantForm.addEventListener("submit", saveTenant);
els.chargeForm.addEventListener("submit", saveCharge);
els.billingForm.addEventListener("submit", generateBill);
els.cancelTenantEdit.addEventListener("click", resetTenantForm);
els.cancelChargeEdit.addEventListener("click", resetChargeForm);
els.printBillBtn.addEventListener("click", printSelectedBill);
els.seedDemoBtn.addEventListener("click", loadDemoData);
els.clearDataBtn.addEventListener("click", clearAllData);

setDefaultDates();
syncAuthView();

function loadState() {
  const empty = { tenants: [], charges: [], bills: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeState(saved) || empty;
  } catch {
    return empty;
  }
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function syncAuthView() {
  const authenticated = isLoggedIn();
  els.loginScreen.classList.toggle("is-hidden", authenticated);
  els.appShell.classList.toggle("is-hidden", !authenticated);
  els.loginScreen.setAttribute("aria-hidden", String(authenticated));
  els.appShell.setAttribute("aria-hidden", String(!authenticated));

  if (authenticated) {
    render();
    els.logoutBtn.focus();
  } else {
    els.loginUsername.focus();
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = els.loginUsername.value.trim();
  const password = els.loginPassword.value;

  if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    showMessage(els.loginMessage, "Invalid username or password.");
    return;
  }

  sessionStorage.setItem(SESSION_KEY, "true");
  els.loginForm.reset();
  showMessage(els.loginMessage, "");
  syncAuthView();
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  resetTenantForm();
  resetChargeForm();
  showMessage(els.billingMessage, "");
  syncAuthView();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    showMessage(els.billingMessage, "Unable to save data in this browser. Storage may be blocked or full.");
    return false;
  }
}

function normalizeState(saved) {
  if (!saved || !Array.isArray(saved.tenants) || !Array.isArray(saved.charges) || !Array.isArray(saved.bills)) {
    return null;
  }

  return {
    tenants: saved.tenants
      .filter((tenant) => tenant && tenant.id && tenant.name && tenant.unit)
      .map((tenant) => ({
        id: String(tenant.id),
        name: String(tenant.name),
        unit: String(tenant.unit),
        contact: String(tenant.contact || ""),
        rent: normalizeAmount(tenant.rent),
      })),
    charges: saved.charges
      .filter((charge) => charge && charge.id && charge.label)
      .map((charge) => ({
        id: String(charge.id),
        label: String(charge.label),
        category: String(charge.category || "Other"),
        amount: normalizeAmount(charge.amount),
      })),
    bills: saved.bills
      .filter((bill) => bill && bill.id && bill.billNo)
      .map((bill) => ({
        ...bill,
        id: String(bill.id),
        billNo: String(bill.billNo),
        lineItems: Array.isArray(bill.lineItems) ? bill.lineItems.map(normalizeLineItem) : [],
        total: normalizeAmount(bill.total),
      })),
  };
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function amountValue(input) {
  if (String(input).trim() === "") return NaN;
  const value = Number(input);
  return Number.isFinite(value) ? normalizeAmount(value) : NaN;
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
}

function normalizeLineItem(item) {
  return {
    label: String(item?.label || "Charge"),
    category: String(item?.category || "Other"),
    amount: normalizeAmount(item?.amount),
  };
}

function isValidMonth(value) {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;
  const [year, month] = value.split("-").map(Number);
  return year >= 2000 && month >= 1 && month <= 12;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function showMessage(element, text, isSuccess = false) {
  element.textContent = text;
  element.classList.toggle("success", isSuccess);
}

function saveTenant(event) {
  event.preventDefault();
  const name = els.tenantName.value.trim();
  const unit = els.unitNumber.value.trim();
  const contact = els.tenantContact.value.trim();
  const rent = amountValue(els.monthlyRent.value);

  if (!name || !unit || !Number.isFinite(rent) || rent < 0) {
    showMessage(els.tenantMessage, "Enter tenant name, unit number, and a valid rent amount.");
    return;
  }

  const payload = { name, unit, contact, rent };
  const existingId = els.tenantId.value;
  if (existingId) {
    const tenant = state.tenants.find((item) => item.id === existingId);
    if (!tenant) {
      showMessage(els.tenantMessage, "Tenant no longer exists. Reload or cancel editing.");
      return;
    }
    Object.assign(tenant, payload);
    showMessage(els.tenantMessage, "Tenant updated.", true);
  } else {
    state.tenants.push({ id: uid("tenant"), ...payload });
    showMessage(els.tenantMessage, "Tenant saved.", true);
  }

  if (!persist()) return;
  resetTenantForm(false);
  render();
}

function saveCharge(event) {
  event.preventDefault();
  const label = els.chargeLabel.value.trim();
  const category = els.chargeCategory.value;
  const amount = amountValue(els.chargeAmount.value);

  if (!label || !Number.isFinite(amount) || amount < 0) {
    showMessage(els.chargeMessage, "Enter a charge label and a valid amount.");
    return;
  }

  const payload = { label, category, amount };
  const existingId = els.chargeId.value;
  if (existingId) {
    const charge = state.charges.find((item) => item.id === existingId);
    if (!charge) {
      showMessage(els.chargeMessage, "Charge no longer exists. Reload or cancel editing.");
      return;
    }
    Object.assign(charge, payload);
    showMessage(els.chargeMessage, "Charge updated.", true);
  } else {
    state.charges.push({ id: uid("charge"), ...payload });
    showMessage(els.chargeMessage, "Charge saved.", true);
  }

  if (!persist()) return;
  resetChargeForm(false);
  render();
}

function generateBill(event) {
  event.preventDefault();
  const tenant = state.tenants.find((item) => item.id === els.billingTenant.value);
  const month = els.billingMonth.value;
  const dueDate = els.dueDate.value;
  const selectedChargeIds = Array.from(document.querySelectorAll("[data-charge-check]:checked")).map((item) => item.value);

  if (!tenant || !isValidMonth(month) || !isValidDate(dueDate)) {
    showMessage(els.billingMessage, "Select a tenant, billing month, and valid due date.");
    return;
  }

  if (!selectedChargeIds.length) {
    showMessage(els.billingMessage, "Select at least one charge before generating a bill.");
    return;
  }

  const lineItems = [{ label: "Monthly Rent", category: "Rent", amount: tenant.rent }];
  state.charges
    .filter((charge) => selectedChargeIds.includes(charge.id))
    .forEach((charge) => lineItems.push({ label: charge.label, category: charge.category, amount: charge.amount }));

  const bill = {
    id: uid("bill"),
    billNo: nextBillNumber(),
    createdAt: new Date().toISOString(),
    tenantId: tenant.id,
    tenantName: tenant.name,
    unit: tenant.unit,
    contact: tenant.contact,
    month,
    dueDate,
    notes: els.billNotes.value.trim(),
    lineItems,
    total: normalizeAmount(lineItems.reduce((sum, item) => sum + item.amount, 0)),
  };

  state.bills.unshift(bill);
  selectedBillId = bill.id;
  if (!persist()) return;
  showMessage(els.billingMessage, `Generated ${bill.billNo}.`, true);
  render();
}

function nextBillNumber() {
  const date = new Date();
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `BILL-${yyyymm}-${String(state.bills.length + 1).padStart(4, "0")}`;
}

function resetTenantForm(clearMessage = true) {
  els.tenantForm.reset();
  els.tenantId.value = "";
  if (clearMessage) showMessage(els.tenantMessage, "");
}

function resetChargeForm(clearMessage = true) {
  els.chargeForm.reset();
  els.chargeId.value = "";
  if (clearMessage) showMessage(els.chargeMessage, "");
}

function editTenant(id) {
  const tenant = state.tenants.find((item) => item.id === id);
  if (!tenant) return;
  els.tenantId.value = tenant.id;
  els.tenantName.value = tenant.name;
  els.unitNumber.value = tenant.unit;
  els.tenantContact.value = tenant.contact;
  els.monthlyRent.value = tenant.rent;
  showMessage(els.tenantMessage, "Editing tenant. Save to apply changes.");
}

function deleteTenant(id) {
  const tenant = state.tenants.find((item) => item.id === id);
  if (!tenant || !confirm(`Delete tenant ${tenant.name} from setup? Existing bills stay in history.`)) return;
  state.tenants = state.tenants.filter((item) => item.id !== id);
  if (els.billingTenant.value === id) els.billingTenant.value = "";
  if (!persist()) return;
  render();
}

function editCharge(id) {
  const charge = state.charges.find((item) => item.id === id);
  if (!charge) return;
  els.chargeId.value = charge.id;
  els.chargeLabel.value = charge.label;
  els.chargeCategory.value = charge.category;
  els.chargeAmount.value = charge.amount;
  showMessage(els.chargeMessage, "Editing charge. Save to apply changes.");
}

function deleteCharge(id) {
  const charge = state.charges.find((item) => item.id === id);
  if (!charge || !confirm(`Delete charge ${charge.label}? Existing bills stay unchanged.`)) return;
  state.charges = state.charges.filter((item) => item.id !== id);
  if (!persist()) return;
  render();
}

function viewBill(id) {
  selectedBillId = id;
  renderBillPreview();
  renderBillHistory();
}

function printSelectedBill() {
  if (!selectedBillId) {
    showMessage(els.billingMessage, "Generate or select a bill first.");
    return;
  }
  window.print();
}

function loadDemoData() {
  if (state.tenants.length || state.charges.length || state.bills.length) {
    const ok = confirm("Replace current demo data with sample records?");
    if (!ok) return;
  }

  state.tenants = [
    { id: uid("tenant"), name: "Maria Santos", unit: "18B", contact: "0917 555 0190", rent: 28000 },
    { id: uid("tenant"), name: "Juan Dela Cruz", unit: "22A", contact: "juan@example.com", rent: 32000 },
  ];
  state.charges = [
    { id: uid("charge"), label: "Association Dues", category: "Association Dues", amount: 3500 },
    { id: uid("charge"), label: "Water Utility", category: "Utilities", amount: 850 },
    { id: uid("charge"), label: "Parking Slot", category: "Other", amount: 2500 },
  ];
  state.bills = [];
  selectedBillId = null;
  if (!persist()) return;
  render();
}

function clearAllData() {
  if (!confirm("Clear all tenants, charges, and generated bills from this browser?")) return;
  state.tenants = [];
  state.charges = [];
  state.bills = [];
  selectedBillId = null;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function render() {
  renderSummary();
  renderTenants();
  renderCharges();
  renderBillingControls();
  renderBillHistory();
  renderBillPreview();
}

function renderSummary() {
  els.tenantCount.textContent = state.tenants.length;
  els.chargeCount.textContent = state.charges.length;
  els.billCount.textContent = state.bills.length;
  els.latestTotal.textContent = state.bills[0] ? peso.format(state.bills[0].total) : peso.format(0);
}

function renderTenants() {
  if (!state.tenants.length) {
    els.tenantList.innerHTML = `<div class="empty-state">No tenants yet. Add a tenant and unit to start billing.</div>`;
    return;
  }

  els.tenantList.innerHTML = state.tenants
    .map(
      (tenant) => `
        <div class="list-item">
          <div>
            <strong>${escapeHtml(tenant.name)} &middot; Unit ${escapeHtml(tenant.unit)}</strong>
            <p>${escapeHtml(tenant.contact || "No contact")} &middot; ${peso.format(tenant.rent)} monthly rent</p>
          </div>
          <div class="item-actions">
            <button class="icon-button" type="button" title="Edit tenant" data-edit-tenant="${tenant.id}">Edit</button>
            <button class="icon-button delete" type="button" title="Delete tenant" data-delete-tenant="${tenant.id}">Del</button>
          </div>
        </div>
      `
    )
    .join("");

  els.tenantList.querySelectorAll("[data-edit-tenant]").forEach((button) => {
    button.addEventListener("click", () => editTenant(button.dataset.editTenant));
  });
  els.tenantList.querySelectorAll("[data-delete-tenant]").forEach((button) => {
    button.addEventListener("click", () => deleteTenant(button.dataset.deleteTenant));
  });
}

function renderCharges() {
  if (!state.charges.length) {
    els.chargeList.innerHTML = `<div class="empty-state">No charge templates yet. Add dues, utilities, or other recurring fees.</div>`;
    return;
  }

  els.chargeList.innerHTML = state.charges
    .map(
      (charge) => `
        <div class="list-item">
          <div>
            <strong>${escapeHtml(charge.label)}</strong>
            <p>${escapeHtml(charge.category)} &middot; ${peso.format(charge.amount)}</p>
          </div>
          <div class="item-actions">
            <button class="icon-button" type="button" title="Edit charge" data-edit-charge="${charge.id}">Edit</button>
            <button class="icon-button delete" type="button" title="Delete charge" data-delete-charge="${charge.id}">Del</button>
          </div>
        </div>
      `
    )
    .join("");

  els.chargeList.querySelectorAll("[data-edit-charge]").forEach((button) => {
    button.addEventListener("click", () => editCharge(button.dataset.editCharge));
  });
  els.chargeList.querySelectorAll("[data-delete-charge]").forEach((button) => {
    button.addEventListener("click", () => deleteCharge(button.dataset.deleteCharge));
  });
}

function renderBillingControls() {
  els.billingTenant.innerHTML = state.tenants.length
    ? `<option value="">Select tenant</option>${state.tenants
        .map((tenant) => `<option value="${tenant.id}">${escapeHtml(tenant.name)} - Unit ${escapeHtml(tenant.unit)}</option>`)
        .join("")}`
    : `<option value="">Add a tenant first</option>`;

  els.chargePicker.innerHTML = state.charges.length
    ? state.charges
        .map(
          (charge) => `
            <label class="check-row">
              <input data-charge-check type="checkbox" value="${charge.id}" checked>
              <span>${escapeHtml(charge.label)} &middot; ${peso.format(charge.amount)}</span>
            </label>
          `
        )
        .join("")
    : `<div class="empty-state">Add at least one charge template before generating a bill.</div>`;
}

function renderBillHistory() {
  if (!state.bills.length) {
    els.billHistory.innerHTML = `<div class="empty-state">No generated bills yet.</div>`;
    return;
  }

  els.billHistory.innerHTML = state.bills
    .map(
      (bill) => `
        <button class="history-card ${bill.id === selectedBillId ? "selected" : ""}" type="button" data-view-bill="${bill.id}">
          <strong>${escapeHtml(bill.billNo)}</strong>
          <span>${escapeHtml(bill.tenantName)} &middot; Unit ${escapeHtml(bill.unit)}</span>
          <span>${formatMonth(bill.month)} &middot; ${peso.format(bill.total)}</span>
        </button>
      `
    )
    .join("");

  els.billHistory.querySelectorAll("[data-view-bill]").forEach((button) => {
    button.addEventListener("click", () => viewBill(button.dataset.viewBill));
  });
}

function renderBillPreview() {
  const bill = state.bills.find((item) => item.id === selectedBillId);
  els.printBillBtn.disabled = !bill;

  if (!bill) {
    els.billPreview.className = "bill-preview empty-preview";
    els.billPreview.innerHTML = `<p>Select or generate a bill to preview the statement.</p>`;
    return;
  }

  els.billPreview.className = "bill-preview";
  els.billPreview.innerHTML = `
    <div class="statement-header">
      <div>
        <p class="eyebrow">Billing Statement</p>
        <h2 class="statement-title">Condo Tenant Billing</h2>
        <p>Monthly charges for ${formatMonth(bill.month)}</p>
      </div>
      <div class="statement-meta">
        <strong>${escapeHtml(bill.billNo)}</strong>
        <span>Generated ${formatDate(bill.createdAt)}</span>
        <span>Due ${formatDate(bill.dueDate)}</span>
      </div>
    </div>
    <div class="statement-grid">
      <div class="statement-box">
        <h3>Bill To</h3>
        <p><strong>${escapeHtml(bill.tenantName)}</strong></p>
        <p>Unit ${escapeHtml(bill.unit)}</p>
        <p>${escapeHtml(bill.contact || "No contact on file")}</p>
      </div>
      <div class="statement-box">
        <h3>Payment Summary</h3>
        <p>Billing Period: ${formatMonth(bill.month)}</p>
        <p>Amount Due: <strong>${peso.format(bill.total)}</strong></p>
      </div>
    </div>
    <table class="bill-table">
      <thead>
        <tr>
          <th>Charge</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(Array.isArray(bill.lineItems) ? bill.lineItems : [])
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${peso.format(item.amount)}</td>
              </tr>
            `
          )
          .join("")}
        <tr class="total-row">
          <td colspan="2">Total Due</td>
          <td>${peso.format(bill.total)}</td>
        </tr>
      </tbody>
    </table>
    ${bill.notes ? `<p class="statement-notes"><strong>Notes:</strong> ${escapeHtml(bill.notes)}</p>` : ""}
  `;
}

function setDefaultDates() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const due = new Date(now.getFullYear(), now.getMonth(), 15);
  els.billingMonth.value = month;
  els.dueDate.value = formatInputDate(due);
}

function formatMonth(value) {
  if (!isValidMonth(value)) return "";
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(value) {
  if (!value) return "";
  const date = isValidDate(value) ? parseInputDate(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function parseInputDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
