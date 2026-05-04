# Condo Tenant Billing Demo

Static browser app for generating monthly condo tenant billing statements and saving them as PDF through the browser print dialog.

## Run

Open `index.html` in a browser. No install or build step is required.

## Login

Use the demo credential:

- Username: `admin`
- Password: `admin123`

This login is only a static demo gate. It is not production authentication and does not secure the HTML, JavaScript, `sessionStorage`, or browser-local data against someone with access to the device or browser developer tools. It has no account lockout, audit trail, password reset, server validation, or encrypted storage.

## Basic Flow

1. Add tenants and units in **Tenants and Units**.
2. Add recurring charges in **Charge Templates**.
3. Select a tenant, billing month, due date, and charges in **Generate Billing**.
4. Click **Generate Bill**.
5. Click **Print / Save PDF**, then choose **Save as PDF** in the browser print dialog.

Data is saved in this browser using `localStorage`. Use **Clear Data** to reset the demo.

## Demo Notes

This is a local demo, not a production accounting system. Records are stored only in the browser profile that opened the app, so clearing browser data or using another device will not carry the records across. PDF output uses the browser print dialog; choose **Save as PDF** and review the preview before saving.
