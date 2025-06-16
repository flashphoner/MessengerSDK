/**
 * Generate a 2048-bit RSA-OAEP key pair.
 * @returns Promise<CryptoKeyPair>
 *
 *  keyPair: {
 *   publicKey,
 *   privateKey
 * }
 */
export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  /**
   * @param modulusLength RSA modulus length in bits. Default = 2048.
   * @param publicExponent Public exponent. Default = new Uint8Array([1, 0, 1]).
   * @param hash Hash algorithm identifier for OAEP padding. Default = 'SHA-256'.
   * @returns Promise that resolves to a `CryptoKeyPair` with `publicKey` and `privateKey`.
   */
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
/**
 * Export an RSA private `CryptoKey` to a Base64-encoded PKCS#8 string.
 *
 * @param privateKey – RSA private key to export.
 * @returns Promise that resolves to the Base64 representation of the DER-encoded PKCS-8 key.
 *
 * @remarks
 * The conversion happens in two explicit steps:
 *
 * 1. **Key export** – {@link SubtleCrypto.exportKey | `crypto.subtle.exportKey('pkcs8', …)`}
 *    returns an `ArrayBuffer` containing the raw PKCS-8 structure in **DER**.
 * 2. **Binary → Base64** – the buffer is turned into a binary string and then Base64-encoded
 *    with {@link Window.btoa | `btoa`}.
 *
 * @see https://developer.mozilla.org/docs/Web/API/SubtleCrypto/exportKey
 * @see https://developer.mozilla.org/docs/Web/API/btoa
 *
 * */
export async function exportPrivateKeyToBase64(privateKey: CryptoKey): Promise<string> {
  // 1. Export to DER-encoded PKCS-8 (ArrayBuffer)
  const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
  // 2. Convert ArrayBuffer → binary string → Base64
  return window.btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Export an RSA public `CryptoKey` to a Base64-encoded SPKI string.
 *
 * @param publicKey – RSA public key to export.
 * @returns Promise that resolves to a Base64 representation of the DER-encoded SPKI key.
 *
 * @remarks
 * 1. **Key export** – `crypto.subtle.exportKey('spki', …)` returns an `ArrayBuffer`
 *    with the key in **SubjectPublicKeyInfo (SPKI)**, DER-encoded.
 * 2. **Binary → Base64** – the buffer is converted to a binary string and then
 *    Base64-encoded via `btoa`.
 *
 * @see https://developer.mozilla.org/docs/Web/API/SubtleCrypto/exportKey
 * @see https://developer.mozilla.org/docs/Web/API/btoa
 */
export async function exportPublicKeyToBase64(
  publicKey: CryptoKey,
): Promise<string> {
  // 1. Export the key as DER-encoded SPKI
  const exported = await crypto.subtle.exportKey('spki', publicKey);

  // 2. Convert ArrayBuffer → binary string → Base64
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
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

/**
 * Import Base64 SPKI public key.
 * @param publicKeyBase64 string
 * @returns Promise<CryptoKey>
 */
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
/**
 * Derive 256-bit AES-GCM key from password and salt (PBKDF2-SHA-256).
 * @param password string
 * @param salt Uint8Array
 * @returns Promise<CryptoKey>
 */
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
/**
 * @param privateKey Base64-encoded PKCS-8 string to encrypt.
 * @param password   Master password used to derive the AES-GCM key.
 * @param useSaltAndIv If `true`, random salt and IV are generated; otherwise they are zero-filled.
 *
 * @returns Promise resolving to an object with Base64-encoded
 *
 * encryptedPrivateKey`, `iv`, and `salt`.
 *
 */

export async function encryptPrivateKeyWithSeparateIvSalt(
  privateKey: string,
  password: string,
  useSaltAndIv: boolean
): Promise<{ encryptedPrivateKey: string; iv: string; salt: string }> {
  // 1. IV: 96-bit (12 bytes) — random when `useSaltAndIv` is true, otherwise zero-filled
  const iv = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(12)) : new Uint8Array(12).fill(0);
  // 2. Salt: 128-bit (16 bytes) — random when `useSaltAndIv` is true, otherwise zero-filled
  const salt = useSaltAndIv ? window.crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(16).fill(0);

  // 3. Derive an AES-GCM key from the password + salt (PBKDF2 inside `deriveKeyFromPassword`)
  const key = await deriveKeyFromPassword(password, salt);
  // 4. Encrypt the PKCS-8 string with AES-GCM
  const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(privateKey));

  return {
    encryptedPrivateKey: arrayToBase64(new Uint8Array(encryptedData)),
    iv: arrayToBase64(iv),
    salt: arrayToBase64(salt)
  };
}

/**
 * Encrypt PKCS-8 private key; IV & salt embedded in result.
 * @param privateKey string
 * @param password string
 * @param useSaltAndIv boolean
 * @returns Promise<string>
 */
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
/**
 * Decrypt private key produced by either wrapper.
 * @param encryptedPrivateKey string
 * @param password string
 * @param ivBase64 string | undefined
 * @param saltBase64 string | undefined
 * @returns Promise<string>
 */
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
// ───────────────  RSA message helpers  ───────────────
/**
 * Encrypt message with RSA-OAEP public key.
 * @param publicKey CryptoKey
 * @param message string
 * @returns Promise<string>
 */
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
/**
 * Decrypt RSA-OAEP ciphertext.
 * @param privateKey CryptoKey
 * @param encryptedMessage string
 * @returns Promise<string>
 */
export async function decryptMessageWithPrivateKey(privateKey: CryptoKey, encryptedMessage: string): Promise<string> {
  const encryptedData = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0)).buffer;

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedData,
  );

  return new TextDecoder().decode(decryptedData);
}
// ───────────────  Misc utilities  ───────────────
/**
 * Compute SHA-256 hash of string (hex).
 * @param data string
 * @returns Promise<string>
 */
export async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
/**
 * Generate 256-bit AES-GCM key.
 * @returns Promise<CryptoKey>
 */
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
/**
 * Export AES key to JWK JSON string.
 * @param key CryptoKey
 * @returns Promise<string>
 */
export async function exportAESKeyToString(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exportedKey);
}
// ───────────────  Base64 helpers  ───────────────

/** Convert Uint8Array → Base64 string. */
function arrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

function base64ToArray(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
}

