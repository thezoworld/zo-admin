import { toastMessages } from "./toast"
import { uiMessages } from "./ui"
import { validationMessages } from "./validation"

export const messages = {
  ...validationMessages,
  ...toastMessages,
  ...uiMessages,
} as const

export type MessageKey = keyof typeof messages

export function t(key: MessageKey, params?: Record<string, string | number>) {
  const template: string = messages[key]
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in params ? String(params[name]) : `{${name}}`
  )
}

export { toastMessages, uiMessages, validationMessages }
