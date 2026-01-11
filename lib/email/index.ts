// 이메일 모듈 export

// 발송 유틸리티
export {
  sendEmail,
  isEmailServiceConfigured,
  type SendEmailParams,
  type SendEmailResult,
  type EmailAttachment,
} from "./sender"

// 템플릿
export {
  generateQuoteEmailHtml,
  generateQuoteEmailText,
  generateQuoteEmailSubject,
  type QuoteEmailData,
  type EmailTemplateOptions,
} from "./templates"
