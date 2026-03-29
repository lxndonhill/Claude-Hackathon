'use client'

import { useRef, useState } from 'react'
import { LearningPlan } from '@/types/plan'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send, ChevronDown, ChevronUp, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  plan: LearningPlan
}

function buildPlanContext(plan: LearningPlan): string {
  const lines: string[] = [
    `Plan Title: ${plan.title}`,
    `Focus Area: ${plan.focusArea}`,
    '',
    'Goals:',
    ...plan.goals.map((g, i) => `${i + 1}. ${g.description} (${g.timeframe}) — ${g.rationale ?? ''}`),
    '',
    'Strategies:',
    ...plan.strategies.map((s) => `- ${s.title}: ${s.description} (${s.frequency}) — ${s.rationale ?? ''}`),
    '',
    'Accommodations:',
    ...plan.accommodations.map((a) => `- ${a}`),
  ]
  return lines.join('\n')
}

export function LumenChatPanel({ plan }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const planContext = buildPlanContext(plan).slice(0, 12000)

  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')
    scrollToBottom()

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages,
        planContext,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      setError("Lumen couldn't respond. Please try again.")
      return
    }

    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    scrollToBottom()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="no-print">
      <CardHeader
        className="cursor-pointer pb-3 select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            Ask Lumen about this plan
          </span>
          <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            {messages.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-semibold">
                {messages.length} messages
              </span>
            )}
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          {/* Message thread */}
          <div className="mb-3 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-1.5">
                  <Bot className="h-4 w-4" />
                  Hi! I&apos;m Lumen
                </p>
                <p className="text-sm text-muted-foreground">
                  I know all about this learning plan. Ask me anything — why a goal was chosen,
                  how to implement a strategy at home, or what progress might look like.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-2.5',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  )}>
                    {msg.role === 'user'
                      ? <User className="h-3.5 w-3.5" />
                      : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-foreground border'
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Bot className="h-3.5 w-3.5 text-secondary-foreground" />
                </div>
                <div className="rounded-xl border bg-secondary/50 px-3 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about goals, strategies, how to help at home…"
              rows={2}
              className="flex-1 resize-none text-sm"
              disabled={loading}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="h-auto self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
        </CardContent>
      )}
    </Card>
  )
}
