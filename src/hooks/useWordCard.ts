import { useState, useCallback, useEffect, useRef } from "react"
import { type Word, categories, getRandomWord } from "@/data/words"

/**
 * Pre-warm speech synthesis engine to eliminate cold-start delay.
 */
let speechWarmedUp = false
let voicesLogged = false

function warmupSpeech() {
  if (speechWarmedUp || typeof window === "undefined") return
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.getVoices()
  const warmup = new SpeechSynthesisUtterance("")
  warmup.volume = 0
  warmup.rate = 1
  warmup.lang = "en-US"
  window.speechSynthesis.speak(warmup)
  speechWarmedUp = true
}

function getEnglishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  // Log available voices for debugging (first time only)
  // Log available voices for debugging (first time only)
  if (!voicesLogged) {
    voicesLogged = true
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`))
  }
  // Priority: online/natural neural voices → Zira → David → Google → any English
  return (
    voices.find((v) => v.name.includes("Online (Natural)")) ||
    voices.find((v) => v.name.includes("Natural")) ||
    voices.find((v) => v.name.includes("Zira")) ||
    voices.find((v) => v.name.includes("David")) ||
    voices.find((v) => v.name.includes("Google US English")) ||
    voices.find((v) => v.name.includes("Google UK")) ||
    voices.find((v) => v.name.includes("English") && v.lang.startsWith("en")) ||
    voices.find((v) => v.lang.startsWith("en"))
  )
}

/**
 * In-memory phonetics cache: word → phonetic string
 */
const phoneticCache = new Map<string, string>()

async function fetchPhonetic(word: string): Promise<string> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) return ""
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return ""
    const entry = data[0]
    const phonetic = entry.phonetic || ""
    if (phonetic) return phonetic
    // Try to get from phonetics array
    if (entry.phonetics && entry.phonetics.length > 0) {
      for (const p of entry.phonetics) {
        if (p.text) return p.text
      }
    }
    return ""
  } catch {
    return ""
  }
}

export function useWordCard() {
  const [activeCategory, setActiveCategory] = useState<string>("basic")
  const [currentWord, setCurrentWord] = useState<Word>(() => getRandomWord("basic"))
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [wordCount, setWordCount] = useState(1)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const mountedRef = useRef(false)

  // Warm up speech engine on mount
  useEffect(() => {
    warmupSpeech()
    const tryGetVoice = () => {
      const v = getEnglishVoice()
      if (v) voiceRef.current = v
    }
    tryGetVoice()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = tryGetVoice
    }
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Lazy phonetic fetch: when currentWord has no phonetic, fetch it
  useEffect(() => {
    if (!currentWord.phonetic && currentWord.word) {
      const cached = phoneticCache.get(currentWord.word)
      if (cached) {
        setCurrentWord((prev) => ({ ...prev, phonetic: cached }))
      } else {
        fetchPhonetic(currentWord.word).then((phonetic) => {
          if (phonetic && mountedRef.current) {
            phoneticCache.set(currentWord.word, phonetic)
            setCurrentWord((prev) => ({ ...prev, phonetic }))
          }
        })
      }
    }
  }, [currentWord.word]) // eslint-disable-line react-hooks/exhaustive-deps

/**
 * Slight random pitch variation (±0.05) to avoid sounding monotone.
 * Stays within a narrow band — noticeable only as "more natural", not robotic.
 */
let pitchOffset = 0
function nextPitch(): number {
  pitchOffset = pitchOffset === 0 ? 0.05 : -0.05
  return 1 + pitchOffset
}

const speakWord = useCallback((wordText: string) => {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(wordText)
  utterance.lang = "en-US"
  utterance.rate = 0.82
  utterance.pitch = nextPitch()
  utterance.volume = 1
  if (voiceRef.current) utterance.voice = voiceRef.current
  utterance.onstart = () => { if (mountedRef.current) setIsSpeaking(true) }
  utterance.onend = () => { if (mountedRef.current) setIsSpeaking(false) }
  utterance.onerror = () => { if (mountedRef.current) setIsSpeaking(false) }
  window.speechSynthesis.speak(utterance)
}, [])

  const nextWord = useCallback(() => {
    const word = getRandomWord(activeCategory)
    setCurrentWord(word)
    setWordCount((c) => c + 1)
    speakWord(word.word)
  }, [activeCategory, speakWord])

  const switchCategory = useCallback((categoryId: string) => {
    if (categoryId === activeCategory) return
    setActiveCategory(categoryId)
    setWordCount(1)
    const word = getRandomWord(categoryId)
    setCurrentWord(word)
    speakWord(word.word)
  }, [activeCategory, speakWord])

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        nextWord()
      }
      if (e.key >= "1" && e.key <= "3") {
        const idx = parseInt(e.key) - 1
        if (idx < categories.length) {
          switchCategory(categories[idx].id)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextWord, switchCategory])

  // Speak on mount
  useEffect(() => {
    speakWord(currentWord.word)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentWord,
    activeCategory,
    isSpeaking,
    wordCount,
    categoryTotal: categories.find((c) => c.id === activeCategory)?.words.length ?? 0,
    categories,
    nextWord,
    switchCategory,
    speakWord,
  }
}
