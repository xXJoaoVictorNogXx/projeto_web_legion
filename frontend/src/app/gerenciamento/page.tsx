"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
  email: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState("checando...");
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const healthCheck = async () => {
    try {
      const response = await fetch(`${API}/health`);
      const data = await response.json();
      setStatus(data.status === "ok" ? `OK (DB: ${data.db})` : "Falha");
    } catch {
      setStatus("Offline");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Falha ao carregar usuários:", error);
    }
  };

  const handleFoundUser = async () => {
    if (!name.trim() || !email.trim()) {
      return alert("Preencha nome, email");
    }
    await fetch(`${API}/users/:id`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email }),
    });

    await loadUsers();
  };

  const handleDeleteUser = async (id: number) => {
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    await loadUsers(); // Recarrega a lista
  };

  const handleSaveUser = async (id: number) => {
    // Encontra o usuário no estado atual para pegar os valores dos inputs
    const userToUpdate = users.find((u) => u.id === id);
    if (!userToUpdate) return;

    await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userToUpdate.name,
        email: userToUpdate.email,
      }),
    });
    alert("Usuário salvo!");
    await loadUsers();
  };

  // atualizar o valor de um input na lista
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: "name" | "email"
  ) => {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, [field]: e.target.value };
      }
      return user;
    });
    setUsers(newUsers);
  };

  useEffect(() => {
    healthCheck();
    loadUsers();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>

      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Adicionar Novo Usuário</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <Button onClick={handleFoundUser} className="w-full">
            Buscar
          </Button>
        </div>
      </div>
      <hr />

      <div className="p-4w-full max-w-4xl mt-5">
        <Card>
          <CardContent>
            <Table>
              <TableCaption>Lista de Usuários Cadastrados</TableCaption>
              <TableHeader>
                <TableRow className="flex justify-between">
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleSaveUser(user.id)}>
                        Salvar
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
