// 암호화/복호화 유틸리티
// 노션 API 키 등 민감한 데이터 암호화에 사용

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

// 암호화 알고리즘
const ALGORITHM = "aes-256-gcm"

// 키 길이 (32바이트 = 256비트)
const KEY_LENGTH = 32

// IV 길이 (12바이트 = 96비트, GCM 권장)
const IV_LENGTH = 12

// 인증 태그 길이 (16바이트 = 128비트)
const AUTH_TAG_LENGTH = 16

/**
 * 환경 변수에서 암호화 키 가져오기
 * @returns 32바이트 암호화 키
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error("ENCRYPTION_KEY 환경 변수가 설정되지 않았습니다.")
  }

  // Base64 디코딩 시도
  try {
    const decoded = Buffer.from(key, "base64")
    if (decoded.length >= KEY_LENGTH) {
      return decoded.subarray(0, KEY_LENGTH)
    }
  } catch {
    // Base64 실패 시 scrypt로 키 파생
  }

  // 키 길이가 부족하면 scrypt로 키 파생
  return scryptSync(key, "salt", KEY_LENGTH)
}

/**
 * 문자열 암호화
 * @param plaintext - 암호화할 평문
 * @returns 암호화된 문자열 (base64 인코딩, iv:authTag:ciphertext 형식)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // IV + 인증 태그 + 암호문을 연결하여 base64 인코딩
  const combined = Buffer.concat([iv, authTag, encrypted])
  return combined.toString("base64")
}

/**
 * 암호화된 문자열 복호화
 * @param ciphertext - 암호화된 문자열 (base64 인코딩)
 * @returns 복호화된 평문
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey()
  const combined = Buffer.from(ciphertext, "base64")

  // IV, 인증 태그, 암호문 분리
  const iv = combined.subarray(0, IV_LENGTH)
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ])

  return decrypted.toString("utf8")
}

/**
 * 암호화 키 유효성 검사
 * @returns 키가 유효하면 true
 */
export function isEncryptionConfigured(): boolean {
  try {
    getEncryptionKey()
    return true
  } catch {
    return false
  }
}
