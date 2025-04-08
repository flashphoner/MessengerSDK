export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return keyPair;
}

export async function exportPrivateKeyToBase64(privateKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
  return window.btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function importPrivateKeyFromBase64(privateKeyBase64: string): Promise<CryptoKey> {
  const binaryKey = Uint8Array.from(atob(privateKeyBase64), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'pkcs8',
    binaryKey.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt'],
  );
}

export async function exportPublicKeyToBase64(publicKey: CryptoKey): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey('spki', publicKey);
  return window.btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

export async function importPublicKeyFromBase64(publicKeyBase64: string): Promise<CryptoKey> {
  const binaryKey = Uint8Array.from(atob(publicKeyBase64), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'spki',
    binaryKey.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt'],
  );
}

export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptPrivateKeyWithSeparateIvSalt(
  privateKey: string,
  password: string,
  useSaltAndIv: boolean
): Promise<{ encryptedPrivateKey: string; iv: string; salt: string }> {
  const iv = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(12)) : new Uint8Array(12).fill(0);
  const salt = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(16).fill(0);

  const key = await deriveKeyFromPassword(password, salt);
  const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(privateKey));

  return {
    encryptedPrivateKey: arrayToBase64(new Uint8Array(encryptedData)),
    iv: arrayToBase64(iv),
    salt: arrayToBase64(salt)
  };
}


export async function encryptPrivateKeyWithEmbeddedIvSalt(
  privateKey: string,
  password: string,
  useSaltAndIv: boolean
): Promise<string> {
  const iv = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(12)) : new Uint8Array(12).fill(0);
  const salt = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(16).fill(0);

  const key = await deriveKeyFromPassword(password, salt);
  const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(privateKey));

  const encryptedObject = {
    iv: arrayToBase64(iv),
    salt: arrayToBase64(salt),
    data: arrayToBase64(new Uint8Array(encryptedData))
  };

  return btoa(JSON.stringify(encryptedObject));
}

export async function decryptPrivateKey(
  encryptedPrivateKey: string,
  password: string,
  ivBase64?: string,
  saltBase64?: string
): Promise<string> {
  let iv: Uint8Array;
  let salt: Uint8Array;
  let encryptedData: ArrayBuffer;

  try {
    const encryptedObject = JSON.parse(atob(encryptedPrivateKey));

    if (encryptedObject.iv && encryptedObject.salt && encryptedObject.data) {
      iv = base64ToArray(encryptedObject.iv);
      salt = base64ToArray(encryptedObject.salt);
      encryptedData = base64ToArray(encryptedObject.data).buffer;
    } else {
      throw new Error("Invalid chat encryption format");
    }
  } catch (error) {
    if (!ivBase64 || !saltBase64) throw new Error("Missing IV or salt for decryption");
    iv = base64ToArray(ivBase64);
    salt = base64ToArray(saltBase64);
    encryptedData = base64ToArray(encryptedPrivateKey).buffer;
  }

  const key = await deriveKeyFromPassword(password, salt);
  const decryptedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);

  return new TextDecoder().decode(decryptedData);
}

export async function encryptMessageWithPublicKey(publicKey: CryptoKey, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encodedMessage,
  );

  return window.btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
}

export async function decryptMessageWithPrivateKey(privateKey: CryptoKey, encryptedMessage: string): Promise<string> {
  const encryptedData = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0)).buffer;

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedData,
  );

  return new TextDecoder().decode(decryptedData);
}

export async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateAESKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function exportAESKeyToString(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exportedKey);
}

function arrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

function base64ToArray(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
}

