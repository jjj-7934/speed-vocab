import { useState, useCallback } from "react"
import { useWordCard } from "@/hooks/useWordCard"
import "./App.css"

function App() {
  const {
    currentWord,
    activeCategory,
    isSpeaking,
    wordCount,
    categoryTotal,
    categories,
    nextWord,
    switchCategory,
    speakWord,
  } = useWordCard()

  const [animClass, setAnimClass] = useState("entering")
  const currentCategory = categories.find((c) => c.id === activeCategory)

  const handleNextWord = useCallback(() => {
    setAnimClass("slide-up")
    setTimeout(() => {
      nextWord()
      setAnimClass("entering")
    }, 150)
  }, [nextWord])

  const handleSpeak = useCallback(() => {
    speakWord(currentWord.word)
  }, [speakWord, currentWord.word])

  const handleCategorySwitch = useCallback(
    (categoryId: string) => {
      setAnimClass("slide-up")
      setTimeout(() => {
        switchCategory(categoryId)
        setAnimClass("entering")
      }, 200)
    },
    [switchCategory]
  )

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>速过单词</h1>
        <p>Press <kbd>Space</kbd> to flip · 每按一次刷新一词</p>
      </header>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategorySwitch(cat.id)}
          >
            {cat.label}
            <span className="shortcut">{idx + 1}</span>
          </button>
        ))}
      </div>

      {/* Session Stats Bar */}
      <div className="stats-bar">
        <span className="stat-item">
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          本次浏览 <strong>{wordCount}</strong> 词
        </span>
        <span className="stat-divider" />
        <span className="stat-item">
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
          {currentCategory?.label}词库 · <strong>{categoryTotal.toLocaleString()}</strong> 词
        </span>
        <span className="stat-divider" />
        <span className="stat-item">
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          已学 <strong>{Math.min(wordCount, categoryTotal).toLocaleString()}</strong>/{categoryTotal.toLocaleString()}
          <span className="stat-percent">({categoryTotal > 0 ? Math.round((Math.min(wordCount, categoryTotal) / categoryTotal) * 100) : 0}%)</span>
        </span>
      </div>

      {/* Word Card */}
      <div className="word-card-wrapper" onClick={handleNextWord}>
        <div className={`word-card ${animClass}`}>
          {/* Word */}
          <div className="word-text">{currentWord.word}</div>

          {/* Phonetic */}
          {currentWord.phonetic && (
            <div className="word-phonetic">{currentWord.phonetic}</div>
          )}

          {/* Divider */}
          <div className="word-divider" />

          {/* Part of Speech + Definition */}
          <div className="word-details">
            <span className="word-pos">{currentWord.partOfSpeech}</span>
            <span className="word-definition">{currentWord.definition}</span>
          </div>

          {/* Example */}
          {currentWord.example && (
            <div className="word-example">{currentWord.example}</div>
          )}

          {/* Speak Button */}
          <button
            className={`speak-button ${isSpeaking ? "speaking" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              handleSpeak()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
            {isSpeaking ? "朗读中..." : "朗读"}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="shortcuts-hint">
        <div className="hint-row">
          <span className="hint-item">
            <kbd>Space</kbd> 下一词
          </span>
          <span className="hint-item">
            <kbd>→</kbd> <kbd>↓</kbd> 下一词
          </span>
          <span className="hint-item">
            <kbd>1</kbd>~<kbd>3</kbd> 切换分类
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
