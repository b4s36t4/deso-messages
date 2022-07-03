const assert = require("assert");
const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const axios = require("axios");

function kdf(secret, outputLength) {
  let ctr = 1;
  let written = 0;
  let result = Buffer.from("");
  while (written < outputLength) {
    const ctrs = Buffer.from([ctr >> 24, ctr >> 16, ctr >> 8, ctr]);
    const hashResult = crypto
      .createHash("sha256")
      .update(Buffer.concat([ctrs, secret]))
      .digest();
    result = Buffer.concat([result, hashResult]);
    written += 32;
    ctr += 1;
  }
  return result;
}

//ECDH.
function derive(privateKeyA, publicKeyB) {
  assert(Buffer.isBuffer(privateKeyA), "Bad input");
  assert(Buffer.isBuffer(publicKeyB), "Bad input");
  assert(privateKeyA.length === 32, "Bad private key");
  assert(publicKeyB.length === 65, "Bad public key");
  assert(publicKeyB[0] === 4, "Bad public key");
  const keyA = ec.keyFromPrivate(privateKeyA);
  const keyB = ec.keyFromPublic(publicKeyB);
  const Px = keyA.derive(keyB.getPublic()); // BN instance
  return new Buffer(Px.toArray());
}


function hmacSha256Sign(key, msg) {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

// AES-128-CTR encryption.
function aesCtrEncrypt(counter, key, data) {
  const cipher = crypto.createCipheriv('aes-128-ctr', key, counter);
  const firstChunk = cipher.update(data);
  const secondChunk = cipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
}

// AES-128-CTR decryption.
function aesCtrDecrypt(counter, key, data) {
  const cipher = crypto.createDecipheriv('aes-128-ctr', key, counter);
  const firstChunk = cipher.update(data);
  const secondChunk = cipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
}

// Obtain the public elliptic curve key from a private.
function getPublic(privateKey) {
  assert(privateKey.length === 32, "Bad private key");
  return new Buffer(ec.keyFromPrivate(privateKey).getPublic("arr"));
}


// Sha256 HMAC.
function hmacSha256Sign(key, msg) {
  return crypto.createHmac("sha256", key).update(msg).digest();
}

function aesCtrDecrypt(counter, key, data) {
  const cipher = crypto.createDecipheriv("aes-128-ctr", key, counter);
  const firstChunk = cipher.update(data);
  const secondChunk = cipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
}
function decryptMessage(sharedSecret, encryptedText) {
  const sharedPrivateKey = new Buffer(sharedSecret, "hex");
  const encrypted = new Buffer(encryptedText, "hex");

  const metaLength = 1 + 64 + 16 + 32;
  assert(
    encrypted.length > metaLength,
    "Invalid Ciphertext. Data is too small"
  );
  assert(encrypted[0] >= 2 && encrypted[0] <= 4, "Not valid ciphertext.");

  // deserialize
  const ephemPublicKey = encrypted.slice(0, 65);
  const cipherTextLength = encrypted.length - metaLength;
  const iv = encrypted.slice(65, 65 + 16);
  const cipherAndIv = encrypted.slice(65, 65 + 16 + cipherTextLength);
  const ciphertext = cipherAndIv.slice(16);
  const msgMac = encrypted.slice(65 + 16 + cipherTextLength);

  // check HMAC
  const px = derive(sharedPrivateKey, ephemPublicKey);
  const hash = kdf(px, 32);
  const encryptionKey = hash.slice(0, 16);
  const macKey = crypto.createHash("sha256").update(hash.slice(16)).digest();
  const dataToMac = Buffer.from(cipherAndIv);
  const hmacGood = hmacSha256Sign(macKey, dataToMac);
  assert(hmacGood.equals(msgMac), "Incorrect MAC");

  return aesCtrDecrypt(iv, encryptionKey, ciphertext).toString();
}
