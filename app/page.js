"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// COMPONENTES SIMPLES
const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-xl">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

const Button = ({ children, ...props }) => (
  <button
    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input className="w-full border p-2 rounded-xl" {...props} />
);

const Label = ({ children }) => (
  <label className="text-sm font-medium">{children}</label>
);

// 🔗 SUA URL DO GOOGLE SHEETS
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz5k7kniR4VMLccjgh1S2LaOMxsdUr5AB5bkvQ60nV0RAUTKmduEYv8By57ZnAcRK5f/exec";

// 🎮 LIMITE DE VAGAS
const MAX_VAGAS = 32;

export default function Page() {
  const [form, setForm] = useState({
    nome: "",
    turma: "",
    idade: "",
    nick: "",
  });

  const [inscritos, setInscritos] = useState(0);

  // 🔒 NOVO: estado de loading
  const [loading, setLoading] = useState(false);

  // 🔄 Buscar total de inscritos
  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.total !== undefined) {
          setInscritos(data.total);
        }
      })
      .catch(() => {
        console.log("Erro ao buscar inscritos");
      });
  }, []);

  // ✏️ Atualizar formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Enviar inscrição (COM TRAVA)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 evita duplo clique

    if (inscritos >= MAX_VAGAS) {
      alert("Vagas esgotadas!");
      return;
    }

    setLoading(true); // 🔒 trava botão

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Inscrição enviada com sucesso! 🎮");

      setInscritos((prev) => prev + 1);

      setForm({
        nome: "",
        turma: "",
        idade: "",
        nick: "",
      });
    } catch (err) {
      alert("Erro ao enviar inscrição");
    } finally {
      setLoading(false); // 🔓 libera botão
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold text-center">
              Intercopa Gaming 🎮
            </h1>

            <p className="text-center text-sm text-gray-500">
              Escola Estadual Santos Carvalhais
            </p>

            <p className="text-center font-semibold mt-2">
              Vagas: {inscritos} / {MAX_VAGAS}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Nome completo</Label>
                <Input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Turma</Label>
                <Input
                  name="turma"
                  value={form.turma}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Idade</Label>
                <Input
                  name="idade"
                  type="number"
                  value={form.idade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Nick no jogo</Label>
                <Input
                  name="nick"
                  value={form.nick}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={inscritos >= MAX_VAGAS || loading}
              >
                {loading
                  ? "Enviando..."
                  : inscritos >= MAX_VAGAS
                  ? "Esgotado"
                  : "Se inscrever"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
