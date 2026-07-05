// ============================================================
// RADEN X AJAY GUEST GENERATOR — VERCEL SERVERLESS
// ============================================================

const HEX_KEY = '2ee44819e9b4598845141067b281621874d0d5d7af9d8f7e00c1e54715b7d1e3';
const PASSWORD_SUFFIX = 'BY_SulavXAjay';

const REGISTER_URL = 'https://sulavxnewxregister-api.vercel.app/guest/register';
const TOKEN_URL = 'https://100067.connect.garena.com/api/v2/oauth/guest/token:grant';

// ============ UTILITY ============
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generatePassword(prefix) {
  const random = generateRandomString(8);
  return `${prefix}_${PASSWORD_SUFFIX}_${random}`;
}

function generateName(base) {
  const symbols = ['ツ', '★', '☆', '🔥', '⚡', '✨', '♥️', '👑', '💎'];
  const suffix = symbols[Math.floor(Math.random() * symbols.length)];
  const num = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `${base}${suffix}${num}`;
}

function checkRarity(accountId) {
  let score = 0;
  if (/(\d)\1{3,}/.test(accountId)) score += 3;
  if (/(12345|23456|34567|45678|56789|67890|76543|65432|54321|43210)/.test(accountId)) score += 4;
  if (accountId.length >= 4 && accountId === accountId.split('').reverse().join('')) score += 5;
  if (new Set(accountId).size === 1 && accountId.length >= 4) score += 5;
  if (accountId.length <= 8 && /^\d+$/.test(accountId) && parseInt(accountId) < 1000000) score += 3;
  if (/(000|111|222|333|444|555|666|777|888|999)/.test(accountId)) score += 2;
  return { isRare: score >= 10, score };
}

// ============ HMAC SHA256 (Node.js) ============
const crypto = require('crypto');

function hmacSha256(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest('hex');
}

// ============ API CALLS ============
async function guestRegister(password) {
  const payload = { app_id: 100067, client_type: 2, password, source: 2 };
  const body = JSON.stringify(payload);
  const signature = hmacSha256(HEX_KEY, body);
  
  const resp = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Signature ${signature}`,
      'User-Agent': 'GarenaMSDK/4.0.39(SM-A325M ;Android 13;en;HK;)'
    },
    body: body
  });
  
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  if (data.code !== 0) throw new Error(data.message || 'Register failed');
  return String(data.data.uid);
}

async function getAccessToken(uid, password) {
  const payload = {
    client_id: 100067,
    client_secret: HEX_KEY,
    client_type: 2,
    password: password,
    response_type: 'token',
    uid: uid
  };
  const body = JSON.stringify(payload);
  const signature = hmacSha256(HEX_KEY, body);
  
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Signature ${signature}`,
      'User-Agent': 'GarenaMSDK/4.0.39(SM-A325M ;Android 13;en;HK;)'
    },
    body: body
  });
  
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  if (data.code !== 0) throw new Error(data.message || 'Token failed');
  return {
    access_token: data.data.access_token,
    open_id: String(data.data.open_id)
  };
}

// ============ GENERATE ACCOUNT ============
async function generateAccount(prefix, passPrefix) {
  const password = generatePassword(passPrefix);
  const uid = await guestRegister(password);
  const tokenData = await getAccessToken(uid, password);
  const name = generateName(prefix);
  const accountId = String(Math.floor(Math.random() * 90000000) + 10000000);
  const rarity = checkRarity(accountId);
  const accountType = rarity.score >= 14 ? 'premium' : rarity.isRare ? 'rare' : 'normal';
  
  return {
    uid,
    password,
    name,
    accountId,
    accountType,
    rarityScore: rarity.score,
    accessToken: tokenData.access_token.slice(0, 30) + '...'
  };
}

// ============ VERCEL HANDLER ============
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prefix = 'Raden', passPrefix = 'kipas', count = 1 } = req.body;
    const maxCount = Math.min(count, 10);
    const results = [];
    
    for (let i = 0; i < maxCount; i++) {
      const account = await generateAccount(prefix, passPrefix);
      results.push(account);
    }
    
    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
