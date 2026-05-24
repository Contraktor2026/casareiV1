"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Flag,
  Heart,
  Home,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { budgetPayments } from "@/lib/mock/budget";

type TimelineTab = "Hoje" | "Linha do tempo" | "Agenda" | "Tarefas";
type TaskStatus = "Pendente" | "Concluída" | "Atrasada";
type TaskFilter = "Pendentes" | "Concluídas" | "Atrasadas";

type TimelineTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  dueDateIso: string;
  day: number;
  status: TaskStatus;
  priority: "Alta" | "Média" | "Baixa";
  kind: "manual" | "sofia" | "sistema";
};

type TimelinePhaseData = {
  id: string;
  period: string;
  title: string;
  description: string;
  done: number;
  total: number;
  status: "No caminho" | "Atenção" | "Futuro";
};

const tabs: TimelineTab[] = ["Hoje", "Linha do tempo", "Agenda", "Tarefas"];
const filters: TaskFilter[] = ["Pendentes", "Concluídas", "Atrasadas"];
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const agendaMonths = [
  { label: "Maio 2026", monthLabel: "Maio", year: 2026, month: 4 },
  { label: "Junho 2026", monthLabel: "Junho", year: 2026, month: 5 },
  { label: "Julho 2026", monthLabel: "Julho", year: 2026, month: 6 },
  { label: "Agosto 2026", monthLabel: "Agosto", year: 2026, month: 7 },
  { label: "Setembro 2026", monthLabel: "Setembro", year: 2026, month: 8 },
  { label: "Outubro 2026", monthLabel: "Outubro", year: 2026, month: 9 },
  { label: "Novembro 2026", monthLabel: "Novembro", year: 2026, month: 10 },
  { label: "Dezembro 2026", monthLabel: "Dezembro", year: 2026, month: 11 }
];

const phases: TimelinePhaseData[] = [
  {
    id: "12-10",
    period: "12 a 10 meses antes",
    title: "Prioridades, orçamento e estilo",
    description: "Definir a direção do casamento e organizar as primeiras decisões.",
    done: 8,
    total: 10,
    status: "No caminho"
  },
  {
    id: "9-7",
    period: "9 a 7 meses antes",
    title: "Fornecedores principais",
    description: "Contratar os fornecedores que sustentam a experiência do dia.",
    done: 6,
    total: 8,
    status: "No caminho"
  },
  {
    id: "6-4",
    period: "6 a 4 meses antes",
    title: "Cerimônia, festa e detalhes",
    description: "Conectar estética, convidados, cardápio e celebração.",
    done: 4,
    total: 7,
    status: "Atenção"
  },
  {
    id: "3-2",
    period: "3 a 2 meses antes",
    title: "Confirmações e ajustes finais",
    description: "Revisar contratos, lista, provas e escolhas importantes.",
    done: 2,
    total: 6,
    status: "Atenção"
  },
  {
    id: "1",
    period: "1 mês antes",
    title: "Revisão geral",
    description: "Conferir pagamentos, fornecedores e últimos detalhes.",
    done: 1,
    total: 5,
    status: "Futuro"
  },
  {
    id: "week",
    period: "Semana do casamento",
    title: "Confirmar tudo e respirar",
    description: "Deixar o essencial alinhado para viver o dia com presença.",
    done: 0,
    total: 4,
    status: "Futuro"
  }
];

const initialTasks: TimelineTask[] = [
  {
    id: "local-cerimonia",
    title: "Definir local da cerimônia",
    description: "Pesquisar, visitar e comparar locais disponíveis.",
    category: "Cerimônia",
    dueDate: "Até 10/06",
    dueDateIso: "2026-06-10",
    day: 10,
    status: "Pendente",
    priority: "Alta",
    kind: "sofia"
  },
  {
    id: "cotacao-buffet",
    title: "Iniciar cotação do buffet",
    description: "Solicitar propostas e comparar opções de cardápio.",
    category: "Buffet",
    dueDate: "Até 15/06",
    dueDateIso: "2026-06-15",
    day: 15,
    status: "Pendente",
    priority: "Alta",
    kind: "sofia"
  },
  {
    id: "convidados",
    title: "Revisar convidados pendentes",
    description: "Conferir quem ainda precisa responder.",
    category: "Convidados",
    dueDate: "Até 18/06",
    dueDateIso: "2026-06-18",
    day: 18,
    status: "Pendente",
    priority: "Alta",
    kind: "sistema"
  },
  {
    id: "vestido",
    title: "Provar vestido de noiva",
    description: "Confirmar ajustes com o ateliê.",
    category: "Vestuário",
    dueDate: "Até 20/06",
    dueDateIso: "2026-06-20",
    day: 20,
    status: "Pendente",
    priority: "Média",
    kind: "manual"
  },
  {
    id: "musicas",
    title: "Escolher músicas da festa",
    description: "Separar músicas importantes com o DJ.",
    category: "Música",
    dueDate: "Até 22/07",
    dueDateIso: "2026-07-22",
    day: 22,
    status: "Atrasada",
    priority: "Alta",
    kind: "manual"
  },
  {
    id: "decor",
    title: "Enviar referências da decoração",
    description: "Organizar imagens e briefing para o fornecedor.",
    category: "Decoração",
    dueDate: "Até 25/08",
    dueDateIso: "2026-08-25",
    day: 25,
    status: "Atrasada",
    priority: "Média",
    kind: "sofia"
  },
  {
    id: "save-date",
    title: "Enviar save the date",
    description: "Aprovar arte e enviar para convidados.",
    category: "Convites",
    dueDate: "Concluída em 10/05",
    dueDateIso: "2026-05-10",
    day: 10,
    status: "Concluída",
    priority: "Média",
    kind: "manual"
  },
  {
    id: "degustacao",
    title: "Agendar degustação do buffet",
    description: "Reservar horário com os fornecedores favoritos.",
    category: "Buffet",
    dueDate: "Até 30/09",
    dueDateIso: "2026-09-30",
    day: 30,
    status: "Pendente",
    priority: "Baixa",
    kind: "manual"
  }
];

const dayNotesKey = "casarei:schedule-day-notes";

export function ScheduleExperience() {
  return <TimelinePage />;
}

function TimelinePage() {
  const [activeTab, setActiveTab] = useState<TimelineTab>("Hoje");
  const [tasks, setTasks] = useState<TimelineTask[]>(initialTasks);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("Pendentes");
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSofia, setShowSofia] = useState(false);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [message, setMessage] = useState("");

  const pendingTasks = tasks.filter((task) => task.status === "Pendente");
  const doneTasks = tasks.filter((task) => task.status === "Concluída");
  const delayedTasks = tasks.filter((task) => task.status === "Atrasada");
  const selectedMonth = agendaMonths[selectedMonthIndex];
  const selectedDayTasks = selectedDay ? tasks.filter((task) => task.day === selectedDay && isTaskInMonth(task, selectedMonth.year, selectedMonth.month)) : [];

  const filteredTasks = useMemo(() => {
    const status = taskFilter === "Pendentes" ? "Pendente" : taskFilter === "Concluídas" ? "Concluída" : "Atrasada";
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesQuery = !normalizedQuery || `${task.title} ${task.category}`.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [query, taskFilter, tasks]);

  function completeTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status: "Concluída" } : task)));
    setMessage("Tarefa concluída. O cronograma ficou um pouco mais leve.");
  }

  function deleteTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!confirmPermanentDelete({ itemName: task?.title ?? "esta tarefa", context: "Ela será excluída do cronograma." })) return;
    setTasks((current) => current.filter((task) => task.id !== id));
    setMessage("Tarefa removida.");
  }

  function saveTask(task: Omit<TimelineTask, "id" | "kind"> & { id?: string }) {
    if (task.id) {
      setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, ...task } : item)));
      setMessage("Tarefa atualizada.");
    } else {
      setTasks((current) => [{ ...task, id: `manual-${Date.now()}`, kind: "manual" }, ...current]);
      setMessage("Nova tarefa adicionada.");
    }
    setEditingTask(null);
    setShowAddTask(false);
    setActiveTab("Tarefas");
  }

  function openCalendar() {
    setActiveTab("Agenda");
  }

  return (
    <div className="-mx-4 -mt-6 min-h-screen bg-[#F8F4F1] px-4 pb-24 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <div className="mx-auto max-w-[430px] lg:max-w-[760px]">
        <TopBar activeTab={activeTab} onHome={() => setActiveTab("Hoje")} />
        <TimelineTabs
          active={activeTab}
          counts={{ pending: pendingTasks.length, delayed: delayedTasks.length, phases: phases.length }}
          onChange={setActiveTab}
        />

        {message ? (
          <p className="mb-4 rounded-2xl bg-[#EEF3EA] px-4 py-3 text-sm font-semibold text-[#4B2E2B] shadow-sm ring-1 ring-[#DCE8D4]">
            {message}
          </p>
        ) : null}

        <main>
          {activeTab === "Hoje" ? (
            <TimelineOverview
              pendingCount={pendingTasks.length}
              doneCount={doneTasks.length}
              delayedCount={delayedTasks.length}
              onTasks={() => setActiveTab("Tarefas")}
              onTimeline={() => setActiveTab("Linha do tempo")}
              onCalendar={openCalendar}
              onSofia={() => setShowSofia(true)}
            />
          ) : null}

          {activeTab === "Linha do tempo" ? (
            <section className="space-y-4">
              <div className="rounded-[28px] bg-[#FFFDFC] p-4 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">Linha do tempo</p>
                  <h1 className="mt-1 font-serif text-3xl leading-tight text-[#4B2E2B] lg:text-4xl">A jornada visual do seu casamento</h1>
                  <p className="mt-2 text-sm leading-6 text-[#8A716D]">Veja as fases do planejamento, do agora até a semana do casamento.</p>
                </div>
              </div>

              <WeddingTimeline />
            </section>
          ) : null}

          {activeTab === "Agenda" ? (
            <AgendaView
              tasks={tasks}
              monthIndex={selectedMonthIndex}
              onMonthChange={setSelectedMonthIndex}
              onSelectDay={setSelectedDay}
              onAdd={() => setShowAddTask(true)}
            />
          ) : null}

          {activeTab === "Tarefas" ? (
            <PersonalTasks
              tasks={filteredTasks}
              activeFilter={taskFilter}
              query={query}
              counts={{ pending: pendingTasks.length, done: doneTasks.length, delayed: delayedTasks.length }}
              onFilter={setTaskFilter}
              onQuery={setQuery}
              onAdd={() => setShowAddTask(true)}
              onComplete={completeTask}
              onEdit={(task) => {
                setEditingTask(task);
                setShowAddTask(true);
              }}
              onDelete={deleteTask}
            />
          ) : null}
        </main>
      </div>

      <MobileBottomBar active={activeTab} onChange={setActiveTab} onAdd={() => setShowAddTask(true)} />

      {selectedDay ? (
        <CalendarDayModal
          day={selectedDay}
          month={selectedMonth}
          tasks={selectedDayTasks}
          onClose={() => setSelectedDay(null)}
          onSofia={() => {
            setSelectedDay(null);
            setMessage("Sofia organizou esse dia por prioridade.");
          }}
          onAdd={() => {
            setSelectedDay(null);
            setShowAddTask(true);
          }}
          onEdit={(task) => {
            setSelectedDay(null);
            setEditingTask(task);
            setShowAddTask(true);
          }}
        />
      ) : null}

      {showAddTask ? (
        <AddTaskModal
          task={editingTask}
          onClose={() => {
            setShowAddTask(false);
            setEditingTask(null);
          }}
          onSave={saveTask}
        />
      ) : null}

      {showSofia ? (
        <SofiaSheet delayed={delayedTasks.length} pending={pendingTasks.length} onClose={() => setShowSofia(false)} onCalendar={() => {
          setShowSofia(false);
          openCalendar();
        }} />
      ) : null}
    </div>
  );
}

function TopBar({ activeTab, onHome }: { activeTab: TimelineTab; onHome: () => void }) {
  return (
    <header className="mb-4 flex h-12 items-center justify-between lg:hidden">
      <button type="button" onClick={onHome} className="grid h-10 w-10 place-items-center rounded-full text-[#4B2E2B]" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-sm font-bold text-[#4B2E2B]">{activeTab}</h1>
      <button type="button" className="relative grid h-10 w-10 place-items-center rounded-full text-[#4B2E2B]" aria-label="Notificações">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D96C8A]" />
      </button>
    </header>
  );
}

function TimelineTabs({ active, counts, onChange }: { active: TimelineTab; counts: { pending: number; delayed: number; phases: number }; onChange: (tab: TimelineTab) => void }) {
  const tabInfo: Record<TimelineTab, { icon: React.ReactNode; subtitle: string; tone: string }> = {
    Hoje: { icon: <Home className="h-5 w-5" />, subtitle: `${counts.pending} pendentes`, tone: "bg-[#F8E7EC] text-[#D96C8A]" },
    "Linha do tempo": { icon: <Flag className="h-5 w-5" />, subtitle: `${counts.phases} fases`, tone: "bg-[#EEF3EA] text-[#5F7752]" },
    Agenda: { icon: <CalendarDays className="h-5 w-5" />, subtitle: "por mês", tone: "bg-[#FBEEE8] text-[#B96F52]" },
    Tarefas: { icon: <CheckCircle2 className="h-5 w-5" />, subtitle: `${counts.delayed} atrasadas`, tone: "bg-[#F8F4F1] text-[#4B2E2B]" }
  };

  return (
    <nav className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={
            active === tab
              ? "rounded-[22px] bg-[#4B2E2B] p-4 text-left text-white shadow-[0_16px_38px_rgba(75,46,43,0.18)]"
              : "rounded-[22px] bg-[#FFFDFC] p-4 text-left text-[#4B2E2B] shadow-[0_10px_28px_rgba(75,46,43,0.05)] ring-1 ring-[#EEE6E1]"
          }
        >
          <span className={active === tab ? "grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-white" : `grid h-10 w-10 place-items-center rounded-2xl ${tabInfo[tab].tone}`}>
            {tabInfo[tab].icon}
          </span>
          <span className="mt-3 block text-sm font-bold leading-tight">{tab}</span>
          <span className={active === tab ? "mt-1 block text-xs text-white/75" : "mt-1 block text-xs text-[#8A716D]"}>{tabInfo[tab].subtitle}</span>
        </button>
      ))}
    </nav>
  );
}

function TimelineOverview({
  pendingCount,
  doneCount,
  delayedCount,
  onTasks,
  onTimeline,
  onCalendar,
  onSofia
}: {
  pendingCount: number;
  doneCount: number;
  delayedCount: number;
  onTasks: () => void;
  onTimeline: () => void;
  onCalendar: () => void;
  onSofia: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-[30px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">Hoje</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#4B2E2B] lg:text-6xl">O seu casamento está tomando forma</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A716D] lg:text-base">
              Mari, você está na fase de consolidar fornecedores e organizar as decisões que dão segurança para os próximos meses.
            </p>
          </div>
          <Heart className="hidden h-8 w-8 shrink-0 text-[#D96C8A] sm:block" />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <CounterCard />
          <MonthlyFocus onTasks={onTasks} />
        </div>
      </div>

      <TaskSummary done={doneCount} pending={pendingCount} delayed={delayedCount} />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[26px] bg-[#FFFDFC] p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#4B2E2B]">Próximos passos</h2>
            <button type="button" onClick={onTimeline} className="text-xs font-bold text-[#D96C8A]">Ver linha do tempo</button>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-[#EEE6E1]">
            {initialTasks.slice(0, 3).map((task) => <SimpleTaskLine key={task.id} task={task} />)}
          </div>
        </section>

        <section className="rounded-[26px] bg-[#FFFDFC] p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
          <div className="flex items-center gap-2 text-[#D96C8A]">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-bold">Sofia</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-[#4B2E2B]">Algumas tarefas merecem carinho essa semana. Comece pelo local da cerimônia e depois revise convidados antes do buffet.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" onClick={onCalendar} variant="outline" className="h-11 border-[#F3C7D2] text-[#D96C8A]">Abrir agenda</Button>
            <Button type="button" onClick={onSofia} className="h-11 bg-[#D96C8A] hover:bg-[#C85D7B]">Sofia</Button>
          </div>
        </section>
      </div>
    </section>
  );
}

function CounterCard() {
  return (
    <article className="rounded-[24px] bg-[#F8F4F1] p-5">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm font-bold text-[#4B2E2B]">Faltam 236 dias</p>
          <p className="mt-2 text-xs leading-6 text-[#8A716D]">20 de dezembro de 2026</p>
          <p className="mt-4 text-xs font-semibold text-[#8A716D]">do planejamento concluído</p>
        </div>
        <TimelineProgress value={64} />
      </div>
    </article>
  );
}

function MonthlyFocus({ compact = false, onTasks }: { compact?: boolean; onTasks: () => void }) {
  const priorities = ["Definir local da cerimônia", "Iniciar cotação do buffet", "Revisar convidados"];

  return (
    <article className={compact ? "rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]" : "rounded-[24px] bg-[#F8E7EC] p-5"}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FFFDFC] text-[#D96C8A]">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-[#4B2E2B]">Foco do mês</h2>
          <p className="mt-1 text-xs text-[#8A716D]">O que merece atenção agora</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {priorities.map((priority) => (
          <p key={priority} className="flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D96C8A]" />
            {priority}
          </p>
        ))}
      </div>
      <Button type="button" onClick={onTasks} className="mt-4 h-11 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">Ver tarefas do mês</Button>
    </article>
  );
}

function TaskSummary({ done, pending, delayed }: { done: number; pending: number; delayed: number }) {
  return (
    <section className="grid grid-cols-3 gap-2 lg:gap-4">
      <SummaryItem label="Concluídas" value={done} tone="done" />
      <SummaryItem label="Pendentes" value={pending} tone="pending" />
      <SummaryItem label="Atrasadas" value={delayed} tone="delayed" />
    </section>
  );
}

function SummaryItem({ label, value, tone }: { label: string; value: number; tone: "done" | "pending" | "delayed" }) {
  const colors = {
    done: "text-[#5F7752] bg-[#EEF3EA] ring-[#DCE8D4]",
    pending: "text-[#B96F52] bg-[#FBEEE8] ring-[#F3D8CC]",
    delayed: "text-[#D96C8A] bg-[#F8E7EC] ring-[#F3C7D2]"
  };

  return (
    <article className={`rounded-2xl p-4 text-center shadow-sm ring-1 ${colors[tone]}`}>
      <p className="text-[11px] font-semibold text-[#8A716D]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#4B2E2B]">{value}</p>
      <span className="mx-auto mt-2 grid h-5 w-5 place-items-center rounded-full bg-[#FFFDFC]">
        <CheckCircle2 className="h-3 w-3" />
      </span>
    </article>
  );
}

function WeddingTimeline() {
  return (
    <section className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-8">
      <div className="relative space-y-3 pl-7 lg:pl-10">
        <span className="absolute left-[10px] top-5 h-[calc(100%-42px)] w-px bg-[#F3C7D2] lg:left-[15px]" />
        {phases.map((phase) => <TimelinePhase key={phase.id} phase={phase} />)}
      </div>
    </section>
  );
}

function TimelinePhase({ phase }: { phase: TimelinePhaseData }) {
  return (
    <article className="relative rounded-[22px] bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.05)] ring-1 ring-[#EEE6E1] lg:p-5">
      <span className={phase.status === "No caminho" ? "absolute -left-[24px] top-6 h-3 w-3 rounded-full bg-[#D96C8A] ring-4 ring-[#F8E7EC] lg:-left-[30px]" : "absolute -left-[24px] top-6 h-3 w-3 rounded-full bg-[#FFFDFC] ring-2 ring-[#D96C8A] lg:-left-[30px]"} />
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-xs font-bold text-[#4B2E2B]">{phase.period}</p>
          <h3 className="mt-1 text-sm font-bold text-[#4B2E2B] lg:text-base">{phase.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#8A716D] lg:text-sm lg:leading-6">{phase.description}</p>
        </div>
        <div className="min-w-[92px]">
          <p className={phase.status === "No caminho" ? "text-right text-xs font-bold text-[#5F7752]" : phase.status === "Atenção" ? "text-right text-xs font-bold text-[#B96F52]" : "text-right text-xs font-bold text-[#8A716D]"}>
            {phase.done}/{phase.total}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F8F4F1]">
            <div className="h-full rounded-full bg-[#D96C8A]" style={{ width: `${Math.round((phase.done / phase.total) * 100)}%` }} />
          </div>
          <p className="mt-2 text-right text-[11px] text-[#8A716D]">{phase.status}</p>
        </div>
      </div>
    </article>
  );
}

function AgendaView({
  tasks,
  monthIndex,
  onMonthChange,
  onSelectDay,
  onAdd
}: {
  tasks: TimelineTask[];
  monthIndex: number;
  onMonthChange: (index: number) => void;
  onSelectDay: (day: number) => void;
  onAdd: () => void;
}) {
  const pending = tasks.filter((task) => task.status === "Pendente").length;
  const delayed = tasks.filter((task) => task.status === "Atrasada").length;
  const done = tasks.filter((task) => task.status === "Concluída").length;

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">Agenda</p>
            <h1 className="mt-1 font-serif text-3xl leading-tight text-[#4B2E2B] lg:text-5xl">Tarefas organizadas por mês</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A716D]">Use essa visão quando quiser enxergar datas, semanas cheias e compromissos próximos.</p>
          </div>
          <Button type="button" onClick={onAdd} className="h-12 bg-[#D96C8A] hover:bg-[#C85D7B]">
            <Plus className="h-4 w-4" />
            Adicionar tarefa
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <AgendaMetric label="Pendentes" value={pending} tone="pending" />
          <AgendaMetric label="Atrasadas" value={delayed} tone="delayed" />
          <AgendaMetric label="Concluídas" value={done} tone="done" />
        </div>
      </div>

      <TimelineCalendar tasks={tasks} monthIndex={monthIndex} onMonthChange={onMonthChange} onSelectDay={onSelectDay} onAdd={onAdd} />
    </section>
  );
}

function AgendaMetric({ label, value, tone }: { label: string; value: number; tone: "pending" | "delayed" | "done" }) {
  const colors = {
    pending: "bg-[#FBEEE8] text-[#B96F52]",
    delayed: "bg-[#F8E7EC] text-[#D96C8A]",
    done: "bg-[#EEF3EA] text-[#5F7752]"
  };

  return (
    <article className={`rounded-2xl p-4 text-center ${colors[tone]}`}>
      <p className="text-[11px] font-bold">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#4B2E2B]">{value}</p>
    </article>
  );
}

function TimelineProgress({ value }: { value: number }) {
  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[conic-gradient(#D96C8A_var(--progress),#F8E7EC_0)]" style={{ "--progress": `${value}%` } as React.CSSProperties}>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FFFDFC] text-sm font-bold text-[#4B2E2B]">{value}%</span>
    </div>
  );
}

function TimelineCalendar({
  tasks,
  monthIndex,
  onMonthChange,
  onSelectDay,
  onAdd
}: {
  tasks: TimelineTask[];
  monthIndex: number;
  onMonthChange: (index: number) => void;
  onSelectDay: (day: number) => void;
  onAdd: () => void;
}) {
  const month = agendaMonths[monthIndex];
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const monthTasks = tasks.filter((task) => isTaskInMonth(task, month.year, month.month));
  const nextAttention = monthTasks.filter((task) => task.status !== "Concluída").slice(0, 3);

  return (
    <section className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(Math.max(0, monthIndex - 1))}
          disabled={monthIndex === 0}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1] text-[#4B2E2B] disabled:opacity-35"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#4B2E2B]">{month.label}</h2>
          <p className="mt-1 text-xs text-[#8A716D]">{monthTasks.length ? `${monthTasks.length} tarefa(s) neste mês` : "Nenhuma tarefa neste mês"}</p>
        </div>
        <button
          type="button"
          onClick={() => onMonthChange(Math.min(agendaMonths.length - 1, monthIndex + 1))}
          disabled={monthIndex === agendaMonths.length - 1}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1] text-[#4B2E2B] disabled:opacity-35"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {weekDays.map((day, index) => <span key={`${day}-${index}`} className="font-bold text-[#8A716D]">{day}</span>)}
        {monthDays.map((day) => {
          const dayTasks = monthTasks.filter((task) => task.day === day);
          const hasDelayed = dayTasks.some((task) => task.status === "Atrasada");
          const hasDone = dayTasks.some((task) => task.status === "Concluída");
          const hasPending = dayTasks.some((task) => task.status === "Pendente");
          const tone = hasDelayed ? "bg-[#D96C8A] text-white" : hasDone ? "bg-[#9CAF88] text-white" : hasPending ? "bg-[#D28B6E] text-white" : "text-[#4B2E2B]";

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`relative grid h-10 place-items-center rounded-full text-sm transition hover:bg-[#F8E7EC] ${tone}`}
            >
              {day}
              {dayTasks.length ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current" /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-bold text-[#4B2E2B]">Próximos dias com atenção</h3>
        {nextAttention.length ? nextAttention.map((task) => <SimpleTaskLine key={task.id} task={task} />) : <p className="rounded-2xl bg-[#F8F4F1] p-4 text-sm text-[#8A716D]">Sem tarefas pendentes neste mês.</p>}
      </div>

      <Button type="button" onClick={onAdd} variant="outline" className="mt-5 h-12 w-full rounded-xl border-[#F3C7D2] text-[#D96C8A]">
        <Plus className="h-4 w-4" />
        Adicionar tarefa
      </Button>
    </section>
  );
}

function CalendarDayModal({
  day,
  month,
  tasks,
  onClose,
  onSofia,
  onAdd,
  onEdit
}: {
  day: number;
  month: (typeof agendaMonths)[number];
  tasks: TimelineTask[];
  onClose: () => void;
  onSofia: () => void;
  onAdd: () => void;
  onEdit: (task: TimelineTask) => void;
}) {
  const noteKey = `${month.year}-${String(month.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const payments = budgetPayments.filter((payment) => {
    const parsed = new Date(`${payment.dueDate}T12:00:00`);
    return parsed.getFullYear() === month.year && parsed.getMonth() === month.month && parsed.getDate() === day;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(dayNotesKey) || "{}");
      setNote(stored[noteKey] || "");
    } catch {
      setNote("");
    }
  }, [noteKey]);

  function saveNote() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(dayNotesKey) || "{}");
      window.localStorage.setItem(dayNotesKey, JSON.stringify({ ...stored, [noteKey]: note }));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[460px] rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-[#EEE6E1] lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">{month.monthLabel}</p>
            <h2 className="font-serif text-3xl text-[#4B2E2B]">{day} de {month.monthLabel.toLowerCase()}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-[#4B2E2B]">Tarefas e compromissos</h3>
              <button type="button" onClick={onAdd} className="text-xs font-bold text-[#D96C8A]">Adicionar</button>
            </div>
            <div className="overflow-hidden rounded-2xl ring-1 ring-[#EEE6E1]">
              {tasks.length ? tasks.map((task) => <SimpleTaskLine key={task.id} task={task} onEdit={() => onEdit(task)} />) : <p className="bg-[#F8F4F1] p-4 text-sm text-[#8A716D]">Nenhum compromisso neste dia.</p>}
            </div>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-bold text-[#4B2E2B]">Pagamentos relacionados</h3>
            <div className="space-y-2">
              {payments.length ? payments.map((payment) => (
                <article key={payment.id} className="rounded-2xl bg-[#FBEEE8] p-4 text-sm text-[#4B2E2B]">
                  <strong className="block">{payment.supplier}</strong>
                  <span className="mt-1 block text-xs text-[#8A716D]">{payment.category} · {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(payment.amount)}</span>
                </article>
              )) : <p className="rounded-2xl bg-[#F8F4F1] p-4 text-sm text-[#8A716D]">Nenhum pagamento previsto para este dia.</p>}
            </div>
          </section>
          <label className="block rounded-2xl bg-[#F8F4F1] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Observações do dia</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Anote visitas, reuniões ou lembretes rápidos..." className="mt-2 w-full resize-none bg-transparent text-sm text-[#4B2E2B] outline-none" />
          </label>
          <Button type="button" onClick={saveNote} variant="outline" className="h-11 w-full rounded-xl border-[#F3C7D2] text-[#D96C8A]">
            {saved ? "Observação salva" : "Salvar observação"}
          </Button>
        </div>
        <Button type="button" onClick={onSofia} className="mt-5 h-12 w-full rounded-xl bg-[#D96C8A] hover:bg-[#C85D7B]">
          <Sparkles className="h-4 w-4" />
          Sofia organiza isso pra você
        </Button>
      </section>
    </div>
  );
}

function PersonalTasks({
  tasks,
  activeFilter,
  query,
  counts,
  onFilter,
  onQuery,
  onAdd,
  onComplete,
  onEdit,
  onDelete
}: {
  tasks: TimelineTask[];
  activeFilter: TaskFilter;
  query: string;
  counts: { pending: number; done: number; delayed: number };
  onFilter: (filter: TaskFilter) => void;
  onQuery: (value: string) => void;
  onAdd: () => void;
  onComplete: (id: string) => void;
  onEdit: (task: TimelineTask) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">Tarefas</p>
            <h1 className="mt-1 font-serif text-3xl leading-tight text-[#4B2E2B] lg:text-5xl">O que você criou e acompanha</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A716D]">Pendências pessoais, lembretes e tarefas que precisam de um toque seu.</p>
          </div>
          <Button type="button" onClick={onAdd} className="h-12 bg-[#D96C8A] hover:bg-[#C85D7B]">
            <Plus className="h-4 w-4" />
            Nova tarefa
          </Button>
        </div>

        <label className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-[#F8F4F1] px-4 ring-1 ring-[#EEE6E1]">
          <Search className="h-4 w-4 text-[#8A716D]" />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar tarefa" className="w-full bg-transparent text-sm text-[#4B2E2B] outline-none" />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilter(filter)}
              className={activeFilter === filter ? "rounded-full bg-[#F8E7EC] px-4 py-2 text-xs font-bold text-[#D96C8A]" : "rounded-full bg-[#FFFDFC] px-4 py-2 text-xs font-bold text-[#4B2E2B] ring-1 ring-[#EEE6E1]"}
            >
              {filter} {filter === "Pendentes" ? counts.pending : filter === "Concluídas" ? counts.done : counts.delayed}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

function TaskCard({ task, onComplete, onEdit, onDelete }: { task: TimelineTask; onComplete: (id: string) => void; onEdit: (task: TimelineTask) => void; onDelete: (id: string) => void }) {
  return (
    <article className="rounded-[22px] bg-[#FFFDFC] p-4 shadow-[0_12px_36px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          className={task.status === "Concluída" ? "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#9CAF88] text-white" : "mt-1 h-5 w-5 shrink-0 rounded-full border border-[#D96C8A]"}
          aria-label="Concluir tarefa"
        >
          {task.status === "Concluída" ? <Check className="h-3 w-3" /> : null}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#4B2E2B]">{task.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#8A716D]">{task.dueDate}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${statusClass(task.status)}`}>{task.category}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#8A716D]">{task.description}</p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => onEdit(task)} className="grid h-9 w-9 place-items-center rounded-full bg-[#F8F4F1] text-[#8A716D]" aria-label="Editar">
              <Edit3 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onDelete(task.id)} className="grid h-9 w-9 place-items-center rounded-full bg-[#FBEEE8] text-[#B96F52]" aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AddTaskModal({ task, onClose, onSave }: { task: TimelineTask | null; onClose: () => void; onSave: (task: Omit<TimelineTask, "id" | "kind"> & { id?: string }) => void }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDateIso, setDueDateIso] = useState(task?.dueDateIso ?? "2026-06-28");
  const [category, setCategory] = useState(task?.category ?? "Pessoal");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "Pendente");
  const [description, setDescription] = useState(task?.description ?? "");

  function submit() {
    if (!title.trim()) return;
    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || "Tarefa pessoal.",
      category: category.trim() || "Pessoal",
      dueDate: status === "Concluída" ? `Concluída em ${formatShortDate(dueDateIso)}` : `Até ${formatShortDate(dueDateIso)}`,
      dueDateIso,
      day: getIsoDay(dueDateIso),
      status,
      priority: task?.priority ?? "Média"
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[520px] rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-[#EEE6E1] lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#4B2E2B]">{task ? "Editar tarefa" : "Nova tarefa"}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          <Field label="Nome da tarefa" value={title} onChange={setTitle} placeholder="Ex: Confirmar padrinhos" />
          <label className="block rounded-2xl bg-[#F8F4F1] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Prazo</span>
            <input type="date" value={dueDateIso} onChange={(event) => setDueDateIso(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none" />
          </label>
          <Field label="Categoria" value={category} onChange={setCategory} placeholder="Ex: Cerimônia" />
          <label className="block rounded-2xl bg-[#F8F4F1] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} className="mt-2 h-10 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none">
              <option>Pendente</option>
              <option>Concluída</option>
              <option>Atrasada</option>
            </select>
          </label>
          <label className="block rounded-2xl bg-[#F8F4F1] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Observação</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-[92px] w-full resize-none bg-transparent text-sm text-[#4B2E2B] outline-none" />
          </label>
        </div>
        <Button type="button" onClick={submit} className="mt-5 h-12 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">Salvar tarefa</Button>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block rounded-2xl bg-[#F8F4F1] p-4">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-9 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none" />
    </label>
  );
}

function SofiaReminder({ delayed, pending, onCalendar }: { delayed: number; pending: number; onCalendar: () => void }) {
  return (
    <section className="rounded-[26px] bg-[#FFFDFC] p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-center gap-2 text-[#D96C8A]">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-bold">Sofia</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-[#4B2E2B]">Mari, algumas tarefas merecem carinho essa semana. A etapa de fornecedores está tomando forma.</p>
      <div className="mt-4 space-y-2">
        <ReminderLine tone="danger" title={`${delayed} tarefas atrasadas`} />
        <ReminderLine tone="warning" title={`${pending} pendentes no radar`} />
        <ReminderLine tone="success" title="Seu progresso está consistente" />
      </div>
      <Button type="button" onClick={onCalendar} variant="outline" className="mt-4 h-11 w-full border-[#F3C7D2] text-[#D96C8A]">Ver calendário</Button>
    </section>
  );
}

function SofiaSheet({ delayed, pending, onClose, onCalendar }: { delayed: number; pending: number; onClose: () => void; onCalendar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-[#EEE6E1] lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D96C8A]">Sofia</p>
              <h2 className="font-serif text-2xl text-[#4B2E2B]">Vamos por partes</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-5 text-sm leading-7 text-[#4B2E2B]">
          Mari, algumas tarefas merecem carinho essa semana. Sugiro revisar convidados antes de avançar com o buffet.
        </p>

        <div className="mt-5 space-y-2">
          <ReminderLine tone="danger" title={`${delayed} tarefas atrasadas`} />
          <ReminderLine tone="warning" title={`${pending} pendentes no radar`} />
          <ReminderLine tone="success" title="Seu casamento está tomando forma" />
        </div>

        <Button type="button" onClick={onCalendar} className="mt-5 h-12 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">
          Ver o que fazer agora
        </Button>
      </section>
    </div>
  );
}

function ReminderLine({ title, tone }: { title: string; tone: "danger" | "warning" | "success" }) {
  const color = tone === "danger" ? "bg-[#F8E7EC] text-[#D96C8A]" : tone === "warning" ? "bg-[#FBEEE8] text-[#B96F52]" : "bg-[#EEF3EA] text-[#5F7752]";
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
      <span className={`grid h-7 w-7 place-items-center rounded-xl ${color}`}><Flag className="h-3.5 w-3.5" /></span>
      {title}
    </p>
  );
}

function SimpleTaskLine({ task, onEdit }: { task: TimelineTask; onEdit?: () => void }) {
  return (
    <article className="flex items-center gap-3 border-b border-[#EEE6E1] bg-[#FFFDFC] p-4 last:border-b-0">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${statusClass(task.status)}`}>
        {task.status === "Concluída" ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#4B2E2B]">{task.title}</p>
        <p className="mt-1 text-xs text-[#8A716D]">{task.dueDate}</p>
      </div>
      {onEdit ? (
        <button type="button" onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-full bg-[#F8F4F1] text-[#8A716D]" aria-label="Editar tarefa">
          <Edit3 className="h-4 w-4" />
        </button>
      ) : <MoreHorizontal className="h-4 w-4 text-[#8A716D]" />}
    </article>
  );
}

function MobileBottomBar({ active, onChange, onAdd }: { active: TimelineTab; onChange: (tab: TimelineTab) => void; onAdd: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-end border-t border-[#EEE6E1] bg-[#FFFDFC] px-5 pb-3 pt-2 text-[10px] font-semibold text-[#8A716D] shadow-[0_-12px_40px_rgba(75,46,43,0.08)] lg:hidden">
      <BottomItem icon={<Home className="h-4 w-4" />} label="Hoje" active={active === "Hoje"} onClick={() => onChange("Hoje")} />
      <BottomItem icon={<Flag className="h-4 w-4" />} label="Linha" active={active === "Linha do tempo"} onClick={() => onChange("Linha do tempo")} />
      <button type="button" onClick={onAdd} className="mx-auto grid h-12 w-12 -translate-y-3 place-items-center rounded-full bg-[#D96C8A] text-white shadow-[0_10px_30px_rgba(217,108,138,0.35)]" aria-label="Adicionar tarefa">
        <Plus className="h-6 w-6" />
      </button>
      <BottomItem icon={<CalendarDays className="h-4 w-4" />} label="Agenda" active={active === "Agenda"} onClick={() => onChange("Agenda")} />
      <BottomItem icon={<CheckCircle2 className="h-4 w-4" />} label="Tarefas" active={active === "Tarefas"} onClick={() => onChange("Tarefas")} />
    </nav>
  );
}

function BottomItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={active ? "grid justify-items-center gap-1 text-[#D96C8A]" : "grid justify-items-center gap-1"}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function statusClass(status: TaskStatus) {
  if (status === "Concluída") return "bg-[#EEF3EA] text-[#5F7752]";
  if (status === "Atrasada") return "bg-[#F8E7EC] text-[#D96C8A]";
  return "bg-[#FBEEE8] text-[#B96F52]";
}

function isTaskInMonth(task: TimelineTask, year: number, month: number) {
  const date = parseIsoDate(task.dueDateIso);
  return Boolean(date && date.getFullYear() === year && date.getMonth() === month);
}

function parseIsoDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getIsoDay(value: string) {
  return parseIsoDate(value)?.getDate() ?? 1;
}

function formatShortDate(value: string) {
  const date = parseIsoDate(value);
  if (!date) return "sem data";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date);
}
