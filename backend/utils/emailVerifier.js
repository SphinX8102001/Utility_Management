// ahnaf start
const dns = require('dns');
const dnsPromises = dns.promises;

// Set default DNS servers to Google's public DNS and Cloudflare's public DNS
// to avoid local Windows/firewall queryMx issues.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('Failed to set public DNS servers, using defaults:', e.message);
}

/**
 * EMAIL VERIFIER UTILITY
 * -------------------------------------------------
 * Supports THREE modes controlled via .env variable:
 *
 *  VERIFIER_MODE=external  ← DEFAULT (recommended, free, no API key needed)
 *    → Calls the free Debounce disposable-email API:
 *        https://disposable.debounce.io/?email=<email>
 *      Combined with a local DNS MX record lookup for domain validation.
 *      Blocks disposable/throwaway emails AND non-existent domains.
 *      Falls back to DNS mode automatically if the API is unreachable.
 *
 *  VERIFIER_MODE=gmass  (original paid mode)
 *    → Calls the real GMass verification endpoint:
 *        https://verify.gmass.co/verify?email=<email>&key=<key>
 *      Requires GMASS_API_KEY to be set. Falls back to DNS mode if key missing.
 *
 *  VERIFIER_MODE=dns  (original free local mode)
 *    → Performs a local DNS MX record lookup on the email domain only.
 *        No external API call required.
 *
 * Possible return statuses:
 *   'Valid'         — Email syntax OK, domain accepts mail, not disposable
 *   'Invalid'       — Email syntax is malformed OR domain is a disposable service
 *   'NoMxRecord'    — Domain exists but has no MX records (likely fake domain)
 *   'ConnectionFail'— DNS or external API could not be reached
 */

// --- STEP 1: BASIC SYNTAX VALIDATION ---
function isValidEmailSyntax(email) {
  const syntaxRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return syntaxRegex.test(email);
}

// --- STEP 2: FREE LOCAL DNS MX LOOKUP (original method — kept intact) ---
async function verifyEmailViaDns(email) {
  const domain = email.split('@')[1];
  try {
    const mxRecords = await dnsPromises.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      return { status: 'Valid', message: 'Email domain has valid MX records.' };
    } else {
      return { status: 'NoMxRecord', message: 'Email domain has no MX records configured.' };
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA' || err.code === 'ESERVFAIL') {
      return { status: 'NoMxRecord', message: 'Email domain could not be found or has no MX records.' };
    }
    return { status: 'ConnectionFail', message: 'DNS lookup connection failed. Please try again.' };
  }
}

// --- STEP 3: LIVE GMASS API VERIFICATION (original method — kept intact) ---
async function verifyEmailViaGmass(email, apiKey) {
  try {
    const url = `https://verify.gmass.co/verify?email=${encodeURIComponent(email)}&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return { status: 'ConnectionFail', message: 'GMass API returned a non-OK response.' };
    }
    const data = await response.json();
    // GMass returns { email, Status } — Status is capitalized
    const gmassStatus = data.Status || data.status || 'Unknown';
    return { status: gmassStatus, message: `GMass verification result: ${gmassStatus}` };
  } catch (err) {
    console.error('GMass API call failed:', err.message);
    return { status: 'ConnectionFail', message: 'Could not reach GMass API. Check your network.' };
  }
}

// --- STEP 4: FREE EXTERNAL API VERIFICATION via Debounce (new default mode) ---
// Uses https://disposable.debounce.io (no API key required, 100% free)
// Combined with DNS MX lookup for full domain + disposable check.
// Automatically falls back to DNS mode if the external API is unreachable.
async function verifyEmailViaExternalApi(email) {
  const domain = email.split('@')[1];

  // 4a. First do a DNS MX check — blocks fake/non-existent domains
  let mxValid = false;
  try {
    const mxRecords = await dnsPromises.resolveMx(domain);
    mxValid = mxRecords && mxRecords.length > 0;
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA' || err.code === 'ESERVFAIL') {
      return { status: 'NoMxRecord', message: 'Email domain does not exist or has no mail server.' };
    }
    // If DNS itself fails (e.g. offline), fall back to external-only check
    console.warn('[EmailVerifier] DNS MX check failed, continuing with disposable check only.');
  }

  if (!mxValid) {
    return { status: 'NoMxRecord', message: 'Email domain has no mail server (MX) records.' };
  }

  // 4b. Call Debounce free API — blocks disposable/throwaway email addresses
  try {
    const url = `https://disposable.debounce.io/?email=${encodeURIComponent(email)}`;
    const response = await fetch(url);

    if (!response.ok) {
      // Debounce API returned non-200 — fall back to DNS-only result (already passed)
      console.warn('[EmailVerifier] Debounce API returned non-OK status. Accepting email based on DNS check only.');
      return { status: 'Valid', message: 'Email domain verified via DNS. (Disposable check skipped)' };
    }

    const data = await response.json();
    const isDisposable = data.disposable === 'true' || data.disposable === true;

    if (isDisposable) {
      return {
        status: 'Invalid',
        message: 'Disposable or temporary email addresses are not allowed. Please use a real email.'
      };
    }

    return { status: 'Valid', message: 'Email verified: domain is active and not a disposable service.' };

  } catch (err) {
    // External API unreachable — fall back gracefully to DNS result (already passed above)
    console.warn('[EmailVerifier] Debounce API unreachable, falling back to DNS-only check:', err.message);
    return { status: 'Valid', message: 'Email domain verified via DNS fallback. (External API unavailable)' };
  }
}

// --- PRIMARY EXPORT: Unified verifier ---
// Mode is controlled by VERIFIER_MODE in backend/.env
//   'external' → Debounce API + DNS MX (default, free, recommended)
//   'gmass'    → GMass paid API (requires GMASS_API_KEY)
//   'dns'      → Local DNS MX lookup only
async function verifyEmail(email) {
  // Step 1: syntax check (always runs first, regardless of mode)
  if (!isValidEmailSyntax(email)) {
    return { status: 'Invalid', message: 'The email address format is invalid.' };
  }

  const mode = (process.env.VERIFIER_MODE || 'external').toLowerCase();

  if (mode === 'gmass') {
    const apiKey = process.env.GMASS_API_KEY;
    if (apiKey && apiKey !== 'mock') {
      console.log('[EmailVerifier] Mode: GMass live API.');
      return await verifyEmailViaGmass(email, apiKey);
    }
    // No API key — fall through to external
    console.warn('[EmailVerifier] GMass mode selected but no GMASS_API_KEY set. Falling back to external API.');
    return await verifyEmailViaExternalApi(email);
  }

  if (mode === 'dns') {
    console.log('[EmailVerifier] Mode: Local DNS MX lookup only.');
    return await verifyEmailViaDns(email);
  }

  // Default: 'external' — Debounce API + DNS MX
  console.log('[EmailVerifier] Mode: External API (Debounce + DNS MX).');
  return await verifyEmailViaExternalApi(email);
}

module.exports = { verifyEmail };
// ahnaf end
