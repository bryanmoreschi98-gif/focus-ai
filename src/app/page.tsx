"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Play, Pause, Target, Users, Zap, Clock, TrendingUp, Award, Sparkles, Brain, AlertCircle, Timer, Heart, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Task = {
  id: string
  title: string
  description?: string
  microtasks: Microtask[]
  deadline?: string
  timeframe?: string
  points: number
  completed: boolean
  startTime?: number
  elapsedTime: number
  isRunning: boolean
  category: "work" | "personal" | "health" | "learning"
}

type Microtask = {
  id: string
  title: string
  completed: boolean
  points: number
}

type LifeGoal = {
  id: string
  title: string
  description: string
  category: "career" | "health" | "relationships" | "personal-growth" | "financial"
  targetDate?: string
  milestones: Milestone[]
  progress: number
  aiSuggestions: string[]
}

type Milestone = {
  id: string
  title: string
  completed: boolean
  completedDate?: string
}

type DopamineCard = {
  id: string
  message: string
  emoji: string
  color: string
}

type DistractionTip = {
  message: string
  type: "warning" | "countdown" | "motivational"
}

const dopamineCards: DopamineCard[] = [
  { id: "1", message: "Você está arrasando! 🔥", emoji: "🔥", color: "from-orange-500 to-red-500" },
  { id: "2", message: "Foco total ativado! 🎯", emoji: "🎯", color: "from-blue-500 to-cyan-500" },
  { id: "3", message: "Imparável! Continue assim! ⚡", emoji: "⚡", color: "from-yellow-500 to-orange-500" },
  { id: "4", message: "Você é incrível! 🌟", emoji: "🌟", color: "from-purple-500 to-pink-500" },
  { id: "5", message: "Produtividade máxima! 🚀", emoji: "🚀", color: "from-green-500 to-emerald-500" },
  { id: "6", message: "Campeão do foco! 🏆", emoji: "🏆", color: "from-amber-500 to-yellow-500" },
]

const distractionTips: DistractionTip[] = [
  { message: "⏸️ Pare e pense duas vezes antes de mudar de tarefa", type: "warning" },
  { message: "⏱️ Faça uma contagem regressiva de 10 e recomece", type: "countdown" },
  { message: "🎯 Lembre-se: você escolheu essa tarefa por um motivo", type: "motivational" },
  { message: "💪 Mais 5 minutos de foco e você pode fazer uma pausa", type: "motivational" },
  { message: "🧠 Sua mente quer vagar, mas você é mais forte", type: "warning" },
]

export default function FocusAI() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lifeGoals, setLifeGoals] = useState<LifeGoal[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [showDopamineCard, setShowDopamineCard] = useState(false)
  const [currentDopamineCard, setCurrentDopamineCard] = useState<DopamineCard | null>(null)
  const [showDistractionTip, setShowDistractionTip] = useState(false)
  const [currentDistractionTip, setCurrentDistractionTip] = useState<DistractionTip | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskTimeframe, setNewTaskTimeframe] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"work" | "personal" | "health" | "learning">("work")
  const [bigTasksCount, setBigTasksCount] = useState(0)
  const [activeTab, setActiveTab] = useState("tasks")

  // Life Goals states
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState<"career" | "health" | "relationships" | "personal-growth" | "financial">("career")
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("")

  // Timer effect para tarefas em execução
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.isRunning && task.startTime) {
            return {
              ...task,
              elapsedTime: task.elapsedTime + 1
            }
          }
          return task
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Sistema de distração aleatório
  useEffect(() => {
    const distractionInterval = setInterval(() => {
      const runningTasks = tasks.filter(t => t.isRunning)
      if (runningTasks.length > 0 && Math.random() > 0.7) {
        const randomTip = distractionTips[Math.floor(Math.random() * distractionTips.length)]
        setCurrentDistractionTip(randomTip)
        setShowDistractionTip(true)
        setTimeout(() => setShowDistractionTip(false), 5000)
      }
    }, 30000) // A cada 30 segundos

    return () => clearInterval(distractionInterval)
  }, [tasks])

  const generateMicrotasks = (title: string, description: string): Microtask[] => {
    // Simulação de IA dividindo em microtarefas
    const microtasks: Microtask[] = [
      { id: `${Date.now()}-1`, title: `Planejar: ${title}`, completed: false, points: 10 },
      { id: `${Date.now()}-2`, title: `Executar primeira etapa`, completed: false, points: 20 },
      { id: `${Date.now()}-3`, title: `Revisar progresso`, completed: false, points: 15 },
      { id: `${Date.now()}-4`, title: `Finalizar e validar`, completed: false, points: 25 },
    ]
    return microtasks
  }

  const generateAISuggestions = (title: string, category: string): string[] => {
    // Simulação de IA gerando sugestões personalizadas
    const suggestions: { [key: string]: string[] } = {
      career: [
        "Dedique 30 minutos diários para aprender novas habilidades relevantes",
        "Conecte-se com 2-3 profissionais da área por semana no LinkedIn",
        "Documente suas conquistas mensalmente para atualizar seu portfólio",
        "Participe de eventos ou webinars da sua área pelo menos 1x por mês"
      ],
      health: [
        "Comece com 15 minutos de exercício diário e aumente gradualmente",
        "Estabeleça uma rotina de sono consistente (mesmos horários)",
        "Prepare refeições saudáveis aos domingos para a semana",
        "Agende check-ups médicos preventivos regularmente"
      ],
      relationships: [
        "Reserve tempo de qualidade semanal com pessoas importantes",
        "Pratique escuta ativa e comunicação não-violenta",
        "Organize encontros mensais com amigos ou familiares",
        "Demonstre gratidão e apreço regularmente"
      ],
      "personal-growth": [
        "Leia ou ouça 20 minutos de conteúdo educativo diariamente",
        "Pratique meditação ou mindfulness por 10 minutos ao dia",
        "Mantenha um diário de reflexões e aprendizados",
        "Desafie-se a sair da zona de conforto semanalmente"
      ],
      financial: [
        "Crie e revise seu orçamento mensalmente",
        "Automatize 10-20% da renda para poupança/investimentos",
        "Eduque-se sobre finanças pessoais 30 min por semana",
        "Elimine uma despesa desnecessária por mês"
      ]
    }
    return suggestions[category] || suggestions["personal-growth"]
  }

  const generateMilestones = (title: string, category: string): Milestone[] => {
    // IA gera marcos baseados no objetivo
    return [
      { id: `${Date.now()}-m1`, title: "Definir plano de ação detalhado", completed: false },
      { id: `${Date.now()}-m2`, title: "Completar primeira fase", completed: false },
      { id: `${Date.now()}-m3`, title: "Atingir 50% do objetivo", completed: false },
      { id: `${Date.now()}-m4`, title: "Revisar e ajustar estratégia", completed: false },
      { id: `${Date.now()}-m5`, title: "Alcançar objetivo final", completed: false },
    ]
  }

  const addLifeGoal = () => {
    if (!newGoalTitle.trim()) return

    const milestones = generateMilestones(newGoalTitle, newGoalCategory)
    const aiSuggestions = generateAISuggestions(newGoalTitle, newGoalCategory)

    const newGoal: LifeGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      category: newGoalCategory,
      targetDate: newGoalTargetDate,
      milestones,
      progress: 0,
      aiSuggestions
    }

    setLifeGoals([...lifeGoals, newGoal])
    setNewGoalTitle("")
    setNewGoalDescription("")
    setNewGoalTargetDate("")
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setLifeGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(m => {
            if (m.id === milestoneId && !m.completed) {
              return { ...m, completed: true, completedDate: new Date().toLocaleDateString() }
            }
            return m
          })

          const completedCount = updatedMilestones.filter(m => m.completed).length
          const newProgress = (completedCount / updatedMilestones.length) * 100

          // Recompensa por marco completado
          if (completedCount > goal.milestones.filter(m => m.completed).length) {
            setTotalPoints(prev => prev + 50)
            const randomCard = dopamineCards[Math.floor(Math.random() * dopamineCards.length)]
            setCurrentDopamineCard(randomCard)
            setShowDopamineCard(true)
            setTimeout(() => setShowDopamineCard(false), 3000)
          }

          return { ...goal, milestones: updatedMilestones, progress: newProgress }
        }
        return goal
      })
    )
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return
    
    if (bigTasksCount >= 3) {
      alert("⚠️ Você já tem 3 Grandes Tarefas hoje! Complete algumas antes de adicionar mais para evitar sobrecarga.")
      return
    }

    const microtasks = generateMicrotasks(newTaskTitle, newTaskDescription)
    const totalTaskPoints = microtasks.reduce((sum, mt) => sum + mt.points, 0)

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      microtasks,
      timeframe: newTaskTimeframe,
      points: totalTaskPoints,
      completed: false,
      elapsedTime: 0,
      isRunning: false,
      category: selectedCategory
    }

    setTasks([...tasks, newTask])
    setBigTasksCount(bigTasksCount + 1)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskTimeframe("")
  }

  const toggleMicrotask = (taskId: string, microtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedMicrotasks = task.microtasks.map(mt => {
            if (mt.id === microtaskId && !mt.completed) {
              setTotalPoints(prev => prev + mt.points)
              
              // Mostrar cartão de dopamina aleatoriamente
              if (Math.random() > 0.5) {
                const randomCard = dopamineCards[Math.floor(Math.random() * dopamineCards.length)]
                setCurrentDopamineCard(randomCard)
                setShowDopamineCard(true)
                setTimeout(() => setShowDopamineCard(false), 3000)
              }
              
              return { ...mt, completed: true }
            }
            return mt
          })

          const allCompleted = updatedMicrotasks.every(mt => mt.completed)
          if (allCompleted && !task.completed) {
            setStreak(prev => prev + 1)
            setBigTasksCount(prev => Math.max(0, prev - 1))
            return { ...task, microtasks: updatedMicrotasks, completed: true, isRunning: false }
          }

          return { ...task, microtasks: updatedMicrotasks }
        }
        return task
      })
    )
  }

  const toggleTaskTimer = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.isRunning) {
            return { ...task, isRunning: false }
          } else {
            return { ...task, isRunning: true, startTime: Date.now() }
          }
        }
        // Pausar outras tarefas
        return { ...task, isRunning: false }
      })
    )
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const completedTasksToday = tasks.filter(t => t.completed).length
  const progressPercentage = tasks.length > 0 ? (completedTasksToday / tasks.length) * 100 : 0
  
  // Progresso de longo prazo (todas as tarefas concluídas acumuladas)
  const totalTasksCompleted = tasks.filter(t => t.completed).length
  const longTermProgress = Math.min((totalTasksCompleted / 50) * 100, 100) // Meta de 50 tarefas

  // Progresso médio dos objetivos de vida
  const lifeGoalsProgress = lifeGoals.length > 0 
    ? lifeGoals.reduce((sum, goal) => sum + goal.progress, 0) / lifeGoals.length 
    : 0

  useEffect(() => {
    const newLevel = Math.floor(totalPoints / 100) + 1
    setLevel(newLevel)
  }, [totalPoints])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "personal": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "health": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "learning": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getLifeGoalCategoryColor = (category: string) => {
    switch (category) {
      case "career": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "health": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "relationships": return "bg-pink-500/20 text-pink-400 border-pink-500/30"
      case "personal-growth": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "financial": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getLifeGoalCategoryLabel = (category: string) => {
    switch (category) {
      case "career": return "💼 Carreira"
      case "health": return "💪 Saúde"
      case "relationships": return "❤️ Relacionamentos"
      case "personal-growth": return "🌱 Crescimento Pessoal"
      case "financial": return "💰 Financeiro"
      default: return category
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 pb-24">
      {/* Header */}
      <header className="border-b border-blue-900/30 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-xl">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  FocusAI
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">Produtividade Inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 sm:px-4 py-2 rounded-lg border border-blue-900/30">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-400">Pontos</p>
                  <p className="text-sm sm:text-lg font-bold text-blue-400">{totalPoints}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 px-3 sm:px-4 py-2 rounded-lg border border-blue-900/30">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-400">Nível</p>
                  <p className="text-sm sm:text-lg font-bold text-cyan-400">{level}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 px-3 sm:px-4 py-2 rounded-lg border border-blue-900/30">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-400">Sequência</p>
                  <p className="text-sm sm:text-lg font-bold text-green-400">{streak}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dopamine Card Popup */}
      {showDopamineCard && currentDopamineCard && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <Card className={`bg-gradient-to-r ${currentDopamineCard.color} border-0 shadow-2xl p-6 text-center`}>
            <div className="text-5xl mb-2">{currentDopamineCard.emoji}</div>
            <p className="text-white font-bold text-xl">{currentDopamineCard.message}</p>
          </Card>
        </div>
      )}

      {/* Distraction Tip */}
      {showDistractionTip && currentDistractionTip && (
        <div className="fixed bottom-28 right-8 z-50 animate-slide-in-right max-w-sm">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <p className="text-white font-semibold">{currentDistractionTip.message}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Progress Overview */}
        <div className="space-y-4 mb-6 sm:mb-8">
          {/* Progresso de Hoje */}
          <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">Progresso de Hoje</h2>
                <p className="text-sm text-slate-400">
                  {completedTasksToday} de {tasks.length} tarefas concluídas
                </p>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
                {bigTasksCount}/3 Grandes Tarefas
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-slate-800" />
          </Card>

          {/* Progresso de Longo Prazo */}
          <Card className="bg-slate-900/50 border-green-900/30 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Progresso de Longo Prazo
                </h2>
                <p className="text-sm text-slate-400">
                  {totalTasksCompleted} tarefas completadas no total (Meta: 50)
                </p>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm">
                {Math.round(longTermProgress)}%
              </Badge>
            </div>
            <Progress value={longTermProgress} className="h-3 bg-slate-800" />
          </Card>

          {/* Progresso de Objetivos de Vida */}
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-purple-400 mb-1 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Objetivos Pessoais de Vida
                </h2>
                <p className="text-sm text-slate-400">
                  {lifeGoals.length} objetivo(s) em progresso
                </p>
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
                {Math.round(lifeGoalsProgress)}% Completo
              </Badge>
            </div>
            <Progress value={lifeGoalsProgress} className="h-3 bg-slate-800" />
            {lifeGoals.length === 0 && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                Adicione seus objetivos de vida na aba "Objetivos de Vida" abaixo
              </p>
            )}
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Add Task Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-6 text-base sm:text-lg shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-blue-900/30 text-slate-100 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl text-blue-400">Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">Título da Tarefa</Label>
                    <Input
                      id="title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Ex: Finalizar relatório mensal"
                      className="bg-slate-800 border-blue-900/30 text-slate-100 mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-slate-300">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Detalhes sobre a tarefa..."
                      className="bg-slate-800 border-blue-900/30 text-slate-100 mt-2 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-slate-300">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                      <SelectTrigger className="bg-slate-800 border-blue-900/30 text-slate-100 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-900/30 text-slate-100">
                        <SelectItem value="work">💼 Trabalho</SelectItem>
                        <SelectItem value="personal">🏠 Pessoal</SelectItem>
                        <SelectItem value="health">💪 Saúde</SelectItem>
                        <SelectItem value="learning">📚 Aprendizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeframe" className="text-slate-300">Prazo desejado</Label>
                    <Input
                      id="timeframe"
                      value={newTaskTimeframe}
                      onChange={(e) => setNewTaskTimeframe(e.target.value)}
                      placeholder="Ex: 3 dias, 1 semana, hoje"
                      className="bg-slate-800 border-blue-900/30 text-slate-100 mt-2"
                    />
                  </div>

                  <Button
                    onClick={addTask}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Criar Tarefa com IA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-8 sm:p-12 text-center">
                  <Target className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
                    Nenhuma tarefa ainda
                  </h3>
                  <p className="text-sm text-slate-400">
                    Adicione sua primeira tarefa e deixe a IA dividir em microtarefas para você!
                  </p>
                </Card>
              ) : (
                tasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6 transition-all ${
                      task.completed ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`mt-1 px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(task.category)}`}>
                            {task.category === "work" && "💼"}
                            {task.category === "personal" && "🏠"}
                            {task.category === "health" && "💪"}
                            {task.category === "learning" && "📚"}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-base sm:text-lg font-semibold ${task.completed ? "line-through text-slate-500" : "text-blue-300"}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-xs sm:text-sm text-slate-400 mt-1">{task.description}</p>
                            )}
                          </div>
                        </div>

                        {task.timeframe && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Prazo: {task.timeframe}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-3">
                          <Timer className="w-4 h-4" />
                          <span className="font-mono">{formatTime(task.elapsedTime)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Button
                          onClick={() => toggleTaskTimer(task.id)}
                          disabled={task.completed}
                          className={`${
                            task.isRunning
                              ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                          } text-white font-semibold w-full sm:w-auto`}
                        >
                          {task.isRunning ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar
                            </>
                          )}
                        </Button>

                        <Badge className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 justify-center py-2">
                          {task.points} pontos
                        </Badge>
                      </div>
                    </div>

                    {/* Microtasks */}
                    <div className="space-y-2 mt-4 pl-0 sm:pl-4">
                      <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-3">
                        Microtarefas sugeridas pela IA:
                      </p>
                      {task.microtasks.map((microtask) => (
                        <div
                          key={microtask.id}
                          className="flex items-center gap-3 p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-blue-900/20 hover:border-blue-700/40 transition-all"
                        >
                          <button
                            onClick={() => toggleMicrotask(task.id, microtask.id)}
                            disabled={microtask.completed}
                            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${
                              microtask.completed
                                ? "bg-green-500 border-green-500"
                                : "border-blue-500 hover:border-blue-400"
                            }`}
                          >
                            {microtask.completed && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                          </button>
                          <span
                            className={`flex-1 text-xs sm:text-sm ${
                              microtask.completed ? "line-through text-slate-500" : "text-slate-300"
                            }`}
                          >
                            {microtask.title}
                          </span>
                          <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs">
                            +{microtask.points}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {task.completed && (
                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400 font-semibold text-center">
                          ✅ Tarefa Concluída! +{task.points} pontos
                        </p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Life Goals Tab */}
          <TabsContent value="life-goals" className="space-y-6">
            {/* Add Life Goal Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-base sm:text-lg shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Objetivo de Vida
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-purple-900/30 text-slate-100 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl text-purple-400 flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    Novo Objetivo de Vida
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="goal-title" className="text-slate-300">Título do Objetivo</Label>
                    <Input
                      id="goal-title"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Ex: Alcançar fluência em inglês"
                      className="bg-slate-800 border-purple-900/30 text-slate-100 mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goal-description" className="text-slate-300">Descrição</Label>
                    <Textarea
                      id="goal-description"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Descreva seu objetivo e por que é importante para você..."
                      className="bg-slate-800 border-purple-900/30 text-slate-100 mt-2 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goal-category" className="text-slate-300">Categoria</Label>
                    <Select value={newGoalCategory} onValueChange={(value: any) => setNewGoalCategory(value)}>
                      <SelectTrigger className="bg-slate-800 border-purple-900/30 text-slate-100 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-900/30 text-slate-100">
                        <SelectItem value="career">💼 Carreira</SelectItem>
                        <SelectItem value="health">💪 Saúde</SelectItem>
                        <SelectItem value="relationships">❤️ Relacionamentos</SelectItem>
                        <SelectItem value="personal-growth">🌱 Crescimento Pessoal</SelectItem>
                        <SelectItem value="financial">💰 Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goal-target" className="text-slate-300">Data Alvo (opcional)</Label>
                    <Input
                      id="goal-target"
                      value={newGoalTargetDate}
                      onChange={(e) => setNewGoalTargetDate(e.target.value)}
                      placeholder="Ex: Dezembro 2025"
                      className="bg-slate-800 border-purple-900/30 text-slate-100 mt-2"
                    />
                  </div>

                  <Button
                    onClick={addLifeGoal}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Criar com Sugestões de IA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Life Goals List */}
            <div className="space-y-6">
              {lifeGoals.length === 0 ? (
                <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm p-8 sm:p-12 text-center">
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
                    Nenhum objetivo de vida ainda
                  </h3>
                  <p className="text-sm text-slate-400">
                    Adicione seus objetivos de longo prazo e receba sugestões personalizadas da IA!
                  </p>
                </Card>
              ) : (
                lifeGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`mt-1 px-3 py-1 rounded text-xs font-semibold border ${getLifeGoalCategoryColor(goal.category)}`}>
                            {getLifeGoalCategoryLabel(goal.category)}
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-2">
                          {goal.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">{goal.description}</p>
                        {goal.targetDate && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Meta: {goal.targetDate}</span>
                          </div>
                        )}
                      </div>
                      <Badge className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-4 py-2">
                        {Math.round(goal.progress)}% Completo
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <Progress value={goal.progress} className="h-3 bg-slate-800" />
                    </div>

                    {/* Milestones */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Marcos do Objetivo
                      </h4>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-purple-900/20 hover:border-purple-700/40 transition-all"
                          >
                            <button
                              onClick={() => toggleMilestone(goal.id, milestone.id)}
                              disabled={milestone.completed}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                milestone.completed
                                  ? "bg-purple-500 border-purple-500"
                                  : "border-purple-500 hover:border-purple-400"
                              }`}
                            >
                              {milestone.completed && <Check className="w-4 h-4 text-white" />}
                            </button>
                            <div className="flex-1">
                              <span
                                className={`text-sm ${
                                  milestone.completed ? "line-through text-slate-500" : "text-slate-300"
                                }`}
                              >
                                {milestone.title}
                              </span>
                              {milestone.completed && milestone.completedDate && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Concluído em {milestone.completedDate}
                                </p>
                              )}
                            </div>
                            {milestone.completed && (
                              <Badge className="bg-purple-600/20 text-purple-400 border border-purple-600/30 text-xs">
                                +50 pts
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Sugestões da IA para Alcançar seu Objetivo
                      </h4>
                      <ul className="space-y-2">
                        {goal.aiSuggestions.map((suggestion, index) => (
                          <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Focus Tab */}
          <TabsContent value="focus" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-6 sm:p-8">
              <div className="text-center mb-8">
                <Timer className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Modo Foco</h2>
                <p className="text-sm text-slate-400">
                  Inicie uma tarefa acima para ativar o cronômetro de foco
                </p>
              </div>

              <div className="space-y-4">
                {tasks.filter(t => t.isRunning).map(task => (
                  <div key={task.id} className="p-4 sm:p-6 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-2">{task.title}</h3>
                    <div className="text-3xl sm:text-5xl font-mono font-bold text-center text-cyan-400 mb-4">
                      {formatTime(task.elapsedTime)}
                    </div>
                    <Progress
                      value={(task.microtasks.filter(mt => mt.completed).length / task.microtasks.length) * 100}
                      className="h-2 bg-slate-800"
                    />
                    <p className="text-xs sm:text-sm text-slate-400 text-center mt-2">
                      {task.microtasks.filter(mt => mt.completed).length} de {task.microtasks.length} microtarefas concluídas
                    </p>
                  </div>
                ))}

                {tasks.filter(t => t.isRunning).length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-slate-400">Nenhuma tarefa em execução no momento</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Distraction Tips */}
            <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-6">
              <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Protetor Contra Distrações
              </h3>
              <div className="space-y-3">
                {distractionTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-orange-900/30">
                    <p className="text-sm text-slate-300">{tip.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-6 sm:p-8 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Comunidade FocusAI</h2>
              <p className="text-sm text-slate-400 mb-6">
                Conecte-se com outros usuários, compartilhe seu progresso e encontre motivação!
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold">
                <Users className="w-5 h-5 mr-2" />
                Entrar em uma Sala de Foco
              </Button>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-3">Ranking Semanal</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((pos) => (
                    <div key={pos} className="flex items-center gap-3 p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-white">
                        {pos}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-300">Usuário {pos}</p>
                        <p className="text-xs text-slate-400">{1000 - pos * 100} pontos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-3">Dicas da Comunidade</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-300">
                      💡 "Divida tarefas grandes em blocos de 25 minutos"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">- Maria S.</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-300">
                      🎯 "Comece sempre pela tarefa mais difícil do dia"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">- João P.</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Tarefas Concluídas</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-400">{completedTasksToday}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Tempo Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-cyan-400">
                      {formatTime(tasks.reduce((sum, t) => sum + t.elapsedTime, 0))}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Microtarefas</p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                      {tasks.reduce((sum, t) => sum + t.microtasks.filter(mt => mt.completed).length, 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-blue-900/30 backdrop-blur-sm p-6">
              <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-4">Progresso por Categoria</h3>
              <div className="space-y-4">
                {["work", "personal", "health", "learning"].map((category) => {
                  const categoryTasks = tasks.filter(t => t.category === category)
                  const completed = categoryTasks.filter(t => t.completed).length
                  const percentage = categoryTasks.length > 0 ? (completed / categoryTasks.length) * 100 : 0

                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 capitalize">
                          {category === "work" && "💼 Trabalho"}
                          {category === "personal" && "🏠 Pessoal"}
                          {category === "health" && "💪 Saúde"}
                          {category === "learning" && "📚 Aprendizado"}
                        </span>
                        <span className="text-slate-400">{completed}/{categoryTasks.length}</span>
                      </div>
                      <Progress value={percentage} className="h-2 bg-slate-800" />
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation - Swipeable */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-blue-900/30 z-50">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 py-3 min-w-max px-2">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === "tasks"
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Tarefas</span>
              </button>

              <button
                onClick={() => setActiveTab("life-goals")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === "life-goals"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Objetivos de Vida</span>
              </button>

              <button
                onClick={() => setActiveTab("focus")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === "focus"
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <Timer className="w-5 h-5" />
                <span>Foco</span>
              </button>

              <button
                onClick={() => setActiveTab("community")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === "community"
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Comunidade</span>
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === "stats"
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Estatísticas</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
