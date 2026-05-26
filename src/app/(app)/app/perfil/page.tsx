"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  clearSession,
  getOnboardingData,
  getSession,
  saveOnboardingData,
} from "@/lib/client/supabase-auth";
import type { OnboardingData } from "@/types/onboarding";

const BUDGET_OPTIONS = [
  "Até R$ 20 mil",
  "R$ 20-40 mil",
  "R$ 40-70 mil",
  "R$ 70-100 mil",
  "R$ 100-150 mil",
  "Acima de R$ 150 mil",
];

const WEDDING_FORMATS = [
  "Salão de festas",
  "Espaço ao ar livre",
  "Chácara / sítio",
  "Praia",
  "Hotel",
  "Restaurante",
  "Casa de festas",
  "Outro",
];

const CEREMONY_TYPES = [
  "Civil + Religioso",
  "Somente civil",
  "Somente religioso",
  "Só a festa",
  "Elopement",
];

const PARTY_SIZES = [
  "Micro (até 30 pessoas)",
  "Pequeno (30–80)",
  "Médio (80–150)",
  "Grande (150–300)",
  "Mega (300+)",
];

const GUEST_RANGES = [
  "Até 50",
  "50–100",
  "100–150",
  "150–200",
  "200–300",
  "300+",
];

const VENDOR_TYPES = [
  "Espaço",
  "Buffet",
  "Fotografia",
  "Filmagem",
  "Decoração",
  "Música/DJ",
  "Cerimonial",
  "Vestido",
  "Beleza",
  "Doces/Bolo",
  "Bar",
  "Convites",
  "Transporte",
  "Outros",
];

const EMPTY_ONBOARDING: OnboardingData = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  styles: [],
  brideName: "",
  partnerName: "",
  weddingDate: "",
  weddingDateMode: "exact",
  guestRange: "",
  guestCount: 0,
  weddingFormat: "",
  ceremonyType: "",
  partySize: "",
  vendorTypes: [],
  priorities: [],
  plannedBudget: "",
};

export default function PerfilPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) setData(saved);
    const session = getSession();
    setEmail((session?.user?.email as string) ?? saved?.email ?? "");
  }, []);

  function update<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function toggleVendorType(type: string) {
    const current = data.vendorTypes ?? [];
    const next = current.includes(type)
      ? current.filter((v) => v !== type)
      : [...current, type];
    update("vendorTypes", next);
  }

  function save() {
    saveOnboardingData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function logout() {
    clearSession();
    router.replace("/login");
  }

  const coupleNames =
    [data.brideName, data.partnerName].filter(Boolean).join(" & ") || "Seu perfil";

  const daysLeft = data.weddingDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(`${data.weddingDate}T12:00:00`).getTime() - Date.now()) /
            86_400_000
        )
      )
    : null;

  return (
    <div className="space-y-4 pb-8">
      {/* ── Hero ── */}
      <section
        className="rounded-[24px] p-6 text-white"
        style={{ background: "linear-gradient(145deg, #4B2E2B 0%, #2E1A18 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/15">
            <Heart className="h-7 w-7 text-white" strokeWidth={1.8} fill="currentColor" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-2xl leading-snug text-white">{coupleNames}</p>
            {email && <p className="mt-0.5 truncate text-sm text-white/55">{email}</p>}
            {daysLeft !== null && (
              <p className="mt-1 text-sm font-semibold text-white/70">
                {daysLeft} {daysLeft === 1 ? "dia" : "dias"} para o casamento
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/80">
          Plano Gratuito
        </div>
      </section>

      {/* ── Casal ── */}
      <SectionCard title="Casal" icon={<Heart className="h-4 w-4" />}>
        <Field
          label="Nome da noiva"
          value={data.brideName}
          onChange={(v) => update("brideName", v)}
          placeholder="Seu nome"
        />
        <Field
          label="Nome do noivo / parceiro"
          value={data.partnerName}
          onChange={(v) => update("partnerName", v)}
          placeholder="Nome do parceiro"
        />
        <Field
          label="Data do casamento"
          value={data.weddingDate}
          onChange={(v) => update("weddingDate", v)}
          type="date"
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Cidade"
            value={data.city}
            onChange={(v) => update("city", v)}
            placeholder="Cidade"
          />
          <Field
            label="Estado"
            value={data.state}
            onChange={(v) => update("state", v)}
            placeholder="UF"
          />
        </div>
        <SelectField
          label="Formato do casamento"
          value={data.weddingFormat}
          onChange={(v) => update("weddingFormat", v)}
          options={WEDDING_FORMATS}
        />
        <SelectField
          label="Tipo de cerimônia"
          value={data.ceremonyType}
          onChange={(v) => update("ceremonyType", v)}
          options={CEREMONY_TYPES}
        />
      </SectionCard>

      {/* ── Convidados & orçamento ── */}
      <SectionCard title="Convidados & Orçamento" icon={<Users className="h-4 w-4" />}>
        <SelectField
          label="Faixa de convidados"
          value={data.guestRange}
          onChange={(v) => update("guestRange", v)}
          options={GUEST_RANGES}
        />
        <Field
          label="Número estimado de convidados"
          value={data.guestCount ? String(data.guestCount) : ""}
          onChange={(v) => update("guestCount", Number(v) || 0)}
          placeholder="150"
          type="number"
        />
        <SelectField
          label="Porte da festa"
          value={data.partySize}
          onChange={(v) => update("partySize", v)}
          options={PARTY_SIZES}
        />
        <SelectField
          label="Orçamento planejado"
          value={data.plannedBudget}
          onChange={(v) => update("plannedBudget", v)}
          options={BUDGET_OPTIONS}
        />
      </SectionCard>

      {/* ── Fornecedores pretendidos ── */}
      <SectionCard title="Fornecedores pretendidos" icon={<Sparkles className="h-4 w-4" />}>
        <p className="text-xs text-[#8A716D]">Selecione os que pretende contratar</p>
        <div className="flex flex-wrap gap-2">
          {VENDOR_TYPES.map((type) => {
            const active = (data.vendorTypes ?? []).includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleVendorType(type)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-[#D4537E] text-white"
                    : "bg-[#FFF8F4] text-[#8A716D] ring-1 ring-[#F0E1DD]"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Conta ── */}
      <SectionCard title="Conta" icon={<MapPin className="h-4 w-4" />}>
        <Field
          label="Nome completo"
          value={data.fullName}
          onChange={(v) => update("fullName", v)}
          placeholder="Seu nome completo"
        />
        <Field
          label="Telefone / WhatsApp"
          value={data.phone}
          onChange={(v) => update("phone", v)}
          placeholder="+55 11 99999-9999"
        />
        <div className="rounded-2xl bg-[#FFF8F4] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Email</p>
          <p className="mt-1 text-sm font-semibold text-[#4B2E2B]">{email || "—"}</p>
          <p className="mt-0.5 text-[11px] text-[#B5A09B]">
            O email não pode ser alterado aqui
          </p>
        </div>
      </SectionCard>

      {/* ── Salvar ── */}
      <Button
        type="button"
        onClick={save}
        className={`h-12 w-full text-base font-bold transition ${
          saved ? "bg-[#5F7752] hover:bg-[#5F7752]" : "bg-[#D4537E] hover:bg-[#993556]"
        }`}
      >
        {saved ? "✓ Salvo com sucesso!" : "Salvar alterações"}
      </Button>

      {/* ── Plano ── */}
      <SectionCard title="Plano" icon={<Wallet className="h-4 w-4" />}>
        <div className="flex items-center justify-between rounded-2xl bg-[#FFF8F4] p-4">
          <div>
            <p className="font-bold text-[#4B2E2B]">Gratuito</p>
            <p className="mt-0.5 text-xs text-[#8A716D]">Acesso a todos os módulos</p>
          </div>
          <span className="rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-bold text-[#27500A]">
            Ativo
          </span>
        </div>
        {[
          ["Convidados", "Ilimitados"],
          ["Fornecedores", "Ilimitados"],
          ["Cotações com Sofia (IA)", "Incluído"],
          ["Exportar lista em PDF", "Incluído"],
          ["Financeiro completo", "Incluído"],
          ["Cronograma e tarefas", "Incluído"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl bg-[#FFF8F4] px-4 py-3"
          >
            <span className="text-sm text-[#6F5B57]">{label}</span>
            <span className="text-sm font-bold text-[#5F7752]">{value}</span>
          </div>
        ))}
      </SectionCard>

      {/* ── Configurações ── */}
      <SectionCard title="Configurações" icon={<CalendarDays className="h-4 w-4" />}>
        <a
          href="https://github.com/Contraktor2026/casareiV1/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl bg-[#FFF8F4] px-4 py-3"
        >
          <span className="text-sm font-semibold text-[#4B2E2B]">Enviar feedback</span>
          <ChevronRight className="h-4 w-4 text-[#C4B0AA]" />
        </a>
        <div className="flex items-center justify-between rounded-2xl bg-[#FFF8F4] px-4 py-3">
          <span className="text-sm text-[#8A716D]">Versão do app</span>
          <span className="text-sm font-bold text-[#4B2E2B]">1.0</span>
        </div>
      </SectionCard>

      {/* ── Sair ── */}
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-between rounded-[20px] bg-white p-5 ring-1 ring-[#EEE6E1]"
        style={{ boxShadow: "0 4px 16px rgba(75,46,43,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#FCEBEB]">
            <LogOut className="h-5 w-5 text-[#791F1F]" />
          </span>
          <span className="text-sm font-semibold text-[#791F1F]">Sair da conta</span>
        </div>
        <ChevronRight className="h-4 w-4 text-[#C4B0AA]" />
      </button>

      <p className="text-center text-[11px] text-[#B5A09B]">casarei · v1.0</p>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[24px] bg-white p-5 ring-1 ring-[#EEE6E1]"
      style={{ boxShadow: "0 4px 20px rgba(75,46,43,0.06)" }}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon && <span className="text-[#D96C8A]">{icon}</span>}
        <h2 className="font-serif text-xl text-[#4B2E2B]">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block rounded-2xl bg-[#FFF8F4] p-4">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-9 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none placeholder:text-[#C4B0AA]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block rounded-2xl bg-[#FFF8F4] p-4">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-9 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none"
      >
        <option value="">Selecionar...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
