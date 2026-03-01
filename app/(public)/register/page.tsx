"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setError(data?.error?.message ?? "Ошибка регистрации");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Регистрация</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Создаем..." : "Создать аккаунт"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
