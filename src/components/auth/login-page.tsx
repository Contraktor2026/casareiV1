"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { saveSession, signInWithEmail, signUpWithEmail } from "@/lib/client/supabase-auth";

type AuthMode = "signin" | "signup";

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setMessage("Informe um email válido para cadastrar sua conta.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setMessage("Informe seu nome para criar a conta.");
      return;
    }

    setIsLoading(true);

    try {
      const response =
        mode === "signup"
          ? await signUpWithEmail(cleanEmail, password, name.trim())
          : await signInWithEmail(cleanEmail, password);

      saveSession(response);
      router.push(mode === "signup" ? "/onboarding" : "/app");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar agora.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffaf7_0%,#fbeaf0_100%)] px-4 py-6 text-casarei-text">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[430px] items-center gap-6">
        <div className="rounded-[2rem] border border-white/90 bg-white/82 p-6 shadow-[0_28px_80px_rgba(114,36,62,0.12)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
              <Heart className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-casarei-primary">Casarei</p>
              <h1 className="font-serif text-3xl text-casarei-primary-deep">Acesse sua conta</h1>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-casarei-primary-bg p-1">
            <button type="button" onClick={() => setMode("signin")} className={tabClass(mode === "signin")}>
              Entrar
            </button>
            <button type="button" onClick={() => setMode("signup")} className={tabClass(mode === "signup")}>
              Criar conta
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            {mode === "signup" ? <Field label="Nome" value={name} placeholder="Seu nome" onChange={setName} /> : null}
            <Field label="Email" value={email} placeholder="voce@email.com" type="email" icon onChange={setEmail} />
            <Field label="Senha" value={password} placeholder="Digite sua senha" type="password" onChange={setPassword} />

            {message ? <p className="rounded-2xl bg-[#FBEEE8] px-4 py-3 text-sm font-semibold text-[#B96F52]">{message}</p> : null}

            <Button type="submit" size="lg" disabled={isLoading || !email.trim() || !password} className="h-13">
              {isLoading ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </form>

          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link href="/">Voltar</Link>
          </Button>

          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-casarei-muted">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-casarei-primary" aria-hidden />
            Use um email válido. Ele será usado para acessar sua conta e recuperar sua senha quando precisar.
          </p>
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  icon?: boolean;
  onChange: (value: string) => void;
};

function Field({ label, value, placeholder, type = "text", icon = false, onChange }: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
      {label}
      <span className="flex h-14 items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white px-4 transition focus-within:border-casarei-primary">
        {icon ? <Mail className="h-4 w-4 text-casarei-primary" aria-hidden /> : null}
        <input
          type={type}
          value={value}
          required
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "name"}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-casarei-muted/70"
        />
      </span>
    </label>
  );
}

function tabClass(active: boolean) {
  return active
    ? "rounded-xl bg-white px-3 py-3 text-sm font-bold text-casarei-primary shadow-sm"
    : "rounded-xl px-3 py-3 text-sm font-bold text-casarei-text-secondary";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
