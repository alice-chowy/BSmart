export interface Model {
  id: string
  name: string
  desc: string
}

export interface Mode {
  key: string
  number: number
  label: string
}

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
}

export interface QuickAction {
  id: string
  label: string
  icon: string
}
