const crypto = require("crypto");

const algorithm = "aes-256-gcm";
const secretKey = process.env.EXCHANGE_ENCRYPTION_KEY; // 32 bytes
const ivLength = 16;

/**
 * Encrypt sensitive text
 */
exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag: authTag,
  };
};

/**
 * Decrypt sensitive text
 */
exports.decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(hash.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(hash.tag, "hex"));

  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
