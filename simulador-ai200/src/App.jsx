import { useState } from 'react'
import { useExam } from './hooks/useExam'
import HomeMenu from './components/HomeMenu'
import WikiView from './components/WikiView'
import wikiContent, { DOMAIN_COLORS, introContent } from './data/wikiContent'
import devopsWikiContent, { DEVOPS_DOMAIN_COLORS, devopsIntroContent } from './data/devopsWikiContent'
import aiFundamentalsWikiContent, {
  AI_FUNDAMENTALS_DOMAIN_COLORS,
  aiFundamentalsIntroContent,
} from './data/aiFundamentalsWikiContent'
import questionBank from './data/questions.json'
import ai900Questions from './data/ai900Questions.json'
import StartScreen from './components/StartScreen'
import ExamHeader from './components/ExamHeader'
import SidebarNav from './components/SidebarNav'
import QuestionCard from './components/QuestionCard'
import LearnAssistantPanel from './components/LearnAssistantPanel'
import NotepadModal from './components/NotepadModal'
import ConfirmModal from './components/ConfirmModal'
import ResultsScreen from './components/ResultsScreen'

const AI200_CONFIG = {
  examId: 'ai200',
  questionBank,
  totalQuestions: 50,
  durationMinutes: 120,
  label: 'Microsoft AI-200',
  name: 'Azure AI Cloud Developer Associate',
}

const AI900_CONFIG = {
  examId: 'ai900',
  questionBank: ai900Questions,
  totalQuestions: 45,
  durationMinutes: 60,
  label: 'Microsoft AI-900',
  name: 'Azure AI Fundamentals',
}

export default function App() {
  const ai200Exam = useExam(AI200_CONFIG)
  const ai900Exam = useExam(AI900_CONFIG)
  const [view, setView] = useState('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [notepadOpen, setNotepadOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [studyMode, setStudyMode] = useState(false)

  if (view === 'home') {
    return (
      <HomeMenu
        onSelectExamAi200={() => setView('exam-ai200')}
        onSelectWikiAi200={() => setView('wiki-ai200')}
        onSelectExamAi900={() => setView('exam-ai900')}
        onSelectWikiAi900={() => setView('wiki-ai900')}
        onSelectWikiDevops={() => setView('wiki-devops')}
      />
    )
  }

  if (view === 'wiki-ai200') {
    return (
      <WikiView
        content={wikiContent}
        domainColors={DOMAIN_COLORS}
        title="Wiki AI-200"
        introContent={introContent}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'wiki-ai900') {
    return (
      <WikiView
        content={aiFundamentalsWikiContent}
        domainColors={AI_FUNDAMENTALS_DOMAIN_COLORS}
        title="Wiki AI-900"
        introContent={aiFundamentalsIntroContent}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'wiki-devops') {
    return (
      <WikiView
        content={devopsWikiContent}
        domainColors={DEVOPS_DOMAIN_COLORS}
        title="Wiki Azure DevOps Esenciales"
        introContent={devopsIntroContent}
        onBack={() => setView('home')}
      />
    )
  }

  const isAi900 = view === 'exam-ai900'
  const config = isAi900 ? AI900_CONFIG : AI200_CONFIG
  const { state, startExam, answerQuestion, toggleFlag, saveNote, finishExam, resetToStart } = isAi900
    ? ai900Exam
    : ai200Exam

  if (state.screen === 'start') {
    return (
      <StartScreen
        onStart={startExam}
        onBack={() => setView('home')}
        examLabel={config.label}
        examName={config.name}
        totalQuestions={config.totalQuestions}
        durationMinutes={config.durationMinutes}
      />
    )
  }

  if (state.screen === 'results') {
    return (
      <ResultsScreen
        state={state}
        examId={config.examId}
        totalQuestions={config.totalQuestions}
        onRetry={() => {
          resetToStart()
          startExam()
          setCurrentIndex(0)
        }}
      />
    )
  }

  const question = state.questions[currentIndex]

  return (
    <div className="min-h-screen">
      <ExamHeader
        examLabel={config.label}
        current={currentIndex + 1}
        total={state.questions.length}
        remainingSeconds={state.remainingSeconds}
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenNotepad={() => setNotepadOpen(true)}
        onToggleFlag={() => toggleFlag(question.id)}
        isFlagged={state.flagged.includes(question.id)}
        onFinish={() => setConfirmOpen(true)}
      />

      <div className="pt-16 flex flex-col lg:flex-row">
        <SidebarNav
          questions={state.questions}
          answers={state.answers}
          flagged={state.flagged}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />

        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs text-slate-400 font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                checked={studyMode}
                onChange={(e) => setStudyMode(e.target.checked)}
                className="accent-azure"
              />
              Modo Estudio Inmediato
            </label>
          </div>

          <QuestionCard
            question={question}
            selected={state.answers[question.id]}
            onAnswer={(displayId) => answerQuestion(question.id, displayId)}
            studyMode={studyMode}
          />

          <div className="max-w-3xl mx-auto flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-md border border-stroke bg-panel text-sm text-slate-300 disabled:opacity-30 hover:border-azure/40 transition"
            >
              Anterior
            </button>
            <button
              disabled={currentIndex === state.questions.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(state.questions.length - 1, i + 1))}
              className="px-4 py-2 rounded-md bg-azure hover:bg-azure-hover text-white text-sm font-medium disabled:opacity-30 transition"
            >
              Siguiente
            </button>
          </div>
        </main>
      </div>

      <LearnAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        question={question}
      />

      <NotepadModal
        open={notepadOpen}
        onClose={() => setNotepadOpen(false)}
        questionNumber={currentIndex + 1}
        value={state.notes[question.id]}
        onSave={(text) => saveNote(question.id, text)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Finalizar examen"
        message="¿Seguro que querés finalizar? No vas a poder seguir respondiendo preguntas después de esto."
        confirmLabel="Finalizar examen"
        onConfirm={() => {
          setConfirmOpen(false)
          finishExam('manual')
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
