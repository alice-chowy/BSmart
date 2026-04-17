export interface Model {
  id: string
  name: string
  desc: string
}

export interface Mode {
  key: string
  number: number
  label: string
  icon?: string
  iconSize?: string
}

export interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  messageCount?: number
  lastTimestamp?: string
  model?: string
}

export interface QuickAction {
  id: string
  label: string
  icon: string
}
