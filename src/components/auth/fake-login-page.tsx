"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { saveFakeSession } from "@/lib/client/fake-auth";

export function FakeLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("Mariana Silva");
  const [email, setEmail] = useState("mari@email.com");
  const [password, setPassword] = useState("casarei123");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveFakeSession({
      name: name.trim() || "Mariana Silva",
      email: email.trim() || "mari@email.com",
      createdAt: new Date().toISOString()
    });

    setMessage("Login fake criado. Vamos para o onboarding.");
    window.setTimeout(() => router.push("/onboarding"), 350);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffaf7_0%,#fbeaf0_100%)] px-4 py-6 text-casarei-text md:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(90deg,rgba(255,253,249,0.94),rgba(255,253,249,0.62)),url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop')] bg-cover bg-center p-8 shadow-[0_30px_90px_rgba(114,36,62,0.14)] md:p-12">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-casarei-primary shadow-[0_14px_34px_rgba(114,36,62,0.12)]">
            <Heart className="h-6 w-6" aria-hidden />
          </div>
          <p className="mt-8 text-sm font-semibold text-casarei-primary">Teste fake do Casarei</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl font-medium leading-tight text-casarei-primary-deep md:text-6xl">
            Entre como noiva e teste a jornada completa.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7">
            Este login ainda não conecta backend. Ele serve para validar sensação, onboarding e fluxo do produto com dados salvos no navegador.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_28px_80px_rgba(114,36,62,0.12)] md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-casarei-primary">Entrar</p>
              <h2 className="font-serif text-3xl text-casarei-primary-deep">Acesso de teste</h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4">
            <Field label="Nome" value={name} placeholder="Mariana Silva" onChange={setName} />
            <Field label="Email" value={email} placeholder="mari@email.com" icon onChange={setEmail} />
            <Field label="Senha fake" value={password} placeholder="Digite qualquer senha" type="password" onChange={setPassword} />
          </div>

          {message ? <p className="mt-5 rounded-2xl bg-casarei-primary-bg px-4 py-3 text-sm font-semibold text-casarei-primary-deep">{message}</p> : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <Button asChild variant="ghost" className="justify-center sm:justify-start">
              <Link href="/">Voltar</Link>
            </Button>
            <Button type="submit" size="lg">
              Entrar e preencher dados
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <p className="mt-5 text-xs leading-5 text-casarei-muted">
            Para limpar o teste depois, basta apagar os dados do site no navegador ou usar uma aba anônima.
          </p>
        </form>
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
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-casarei-muted/70"
        />
      </span>
    </label>
  );
}
