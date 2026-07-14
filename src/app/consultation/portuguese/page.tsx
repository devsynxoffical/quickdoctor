"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContinueBookingButton from "@/components/ContinueBookingButton";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  ShieldCheck,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import portugueseDoctorImage from "@/../public/images/doctors_hero.png";

const bookingDays = [
  { key: "apr-23", day: "Qui", date: "23", month: "Abr", label: "Thursday, April 23rd" },
  { key: "apr-24", day: "Sex", date: "24", month: "Abr", label: "Friday, April 24th" },
  { key: "apr-25", day: "Sab", date: "25", month: "Abr", label: "Saturday, April 25th" },
  { key: "apr-26", day: "Dom", date: "26", month: "Abr", label: "Sunday, April 26th" },
  { key: "apr-27", day: "Seg", date: "27", month: "Abr", label: "Monday, April 27th" },
  { key: "apr-28", day: "Ter", date: "28", month: "Abr", label: "Tuesday, April 28th" },
];

const slotsByDay: Record<string, { time: string; price: string }[]> = {
  "apr-23": [
    { time: "09:00", price: "EUR49" },
    { time: "09:15", price: "EUR49" },
    { time: "09:30", price: "EUR49" },
    { time: "10:00", price: "EUR49" },
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:15", price: "EUR49" },
    { time: "11:30", price: "EUR49" },
    { time: "11:45", price: "EUR49" },
    { time: "12:15", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
    { time: "12:45", price: "EUR39" },
  ],
  "apr-24": [
    { time: "09:30", price: "EUR49" },
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:45", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
  ],
  "apr-25": [
    { time: "10:00", price: "EUR49" },
    { time: "10:30", price: "EUR49" },
    { time: "11:15", price: "EUR39" },
    { time: "12:00", price: "EUR39" },
  ],
  "apr-26": [
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:45", price: "EUR39" },
  ],
  "apr-27": [
    { time: "09:00", price: "EUR49" },
    { time: "09:45", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:30", price: "EUR39" },
  ],
  "apr-28": [
    { time: "09:15", price: "EUR49" },
    { time: "10:00", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:45", price: "EUR39" },
  ],
};

const included = [
  { title: "Cartas de encaminhamento", desc: "Encaminhamento para especialistas, exames de sangue e exames de imagem." },
  { title: "Atestados medicos", desc: "Atestados e notas de afastamento quando clinicamente apropriado." },
  { title: "Prescricoes de rotina", desc: "Prescricoes para a maioria dos medicamentos de rotina." },
  { title: "Consulta por video 5-10 minutos", desc: "Avaliacao medica clara com orientacoes e proximos passos." },
];

const excluded = [
  "Atestados retroativos",
  "Relatorios medicos NDLS",
  "Atestados de aptidao para trabalho, viagem ou esporte",
  "Atendimento de emergencia",
  "Drogas controladas ou de abuso potencial",
  "Medicamentos nao licenciados ou com monitoramento rigoroso",
];

const faqs = [
  { q: "O questionario pode ser preenchido em portugues?", a: "Nao. O questionario medico deve ser preenchido em ingles." },
  { q: "Meus documentos serao emitidos em portugues?", a: "Nao. As notas medicas e documentos sao emitidos em ingles." },
  { q: "Posso receber prescricoes medicas?", a: "Sim, quando clinicamente apropriado durante a consulta." },
  { q: "O que acontece durante a consulta?", a: "Voce conversa com um medico registado na Irlanda e recebe orientacao medica clara." },
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-bold text-dark-slate dark:text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-5 text-slate-600 dark:text-slate-400">
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PortugueseConsultationPage() {
  const [selectedDay, setSelectedDay] = useState(bookingDays[0].key);
  const [selectedTime, setSelectedTime] = useState(slotsByDay[bookingDays[0].key][0]?.time ?? "");
  const [showAllSlots, setShowAllSlots] = useState(false);
  const selectedDayMeta = bookingDays.find((day) => day.key === selectedDay) ?? bookingDays[0];
  const daySlots = slotsByDay[selectedDay] ?? [];
  const visibleSlots = showAllSlots ? daySlots : daySlots.slice(0, 12);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 xl:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                <Heart className="w-4 h-4 fill-secondary" />
                Servico de Telemedicina na Irlanda
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">Consulta Online com um GP que fala <span className="text-primary">Portugues</span></h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">Proxima disponibilidade em 3 dias. Atendimento em portugues com medicos registados na Irlanda.</p>
            </div>

            <div className="rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 w-full max-w-[540px] lg:justify-self-end">
              <img src={portugueseDoctorImage.src} alt="Consulta online em portugues" className="w-full h-[300px] md:h-[360px] object-cover rounded-2xl" />
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center"><Video className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-xs font-bold text-slate-500 uppercase">Consulta</p><p className="font-black">5-10 min</p></div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center"><ShieldCheck className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-xs font-bold text-slate-500 uppercase">Medicos</p><p className="font-black">IMC Registered</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div><h2 className="text-2xl md:text-3xl font-black">Agendar consulta</h2><p className="text-sm text-slate-500 mt-1">Selecione data e horario da sua consulta.</p></div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl"><Calendar className="w-4 h-4" />April 2026</div>
              </div>

              <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Escolha a data</p>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Datas anteriores"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Proximas datas"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {bookingDays.map((day) => {
                      const isSelected = selectedDay === day.key;
                      return (
                        <button key={day.key} onClick={() => { setSelectedDay(day.key); setSelectedTime(slotsByDay[day.key]?.[0]?.time ?? ""); setShowAllSlots(false); }} className={`rounded-2xl border p-3 text-center transition-all ${isSelected ? "border-primary bg-primary text-white shadow-md" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/60"}`}>
                          <p className={`text-xs font-bold uppercase ${isSelected ? "text-white/80" : "text-slate-500"}`}>{day.day}</p><p className="text-2xl font-black leading-none mt-1">{day.date}</p><p className={`text-xs font-semibold mt-1 ${isSelected ? "text-white/90" : "text-slate-500"}`}>{day.month}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Escolha o horario</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {visibleSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button key={`${selectedDay}-${slot.time}`} onClick={() => setSelectedTime(slot.time)} className={`p-4 rounded-xl border transition-all text-left ${isSelected ? "border-primary bg-primary/10 dark:bg-primary/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/60"}`}>
                            <p className="text-lg font-black">{slot.time}</p><p className="text-xs font-bold text-primary mt-1">{slot.price}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 h-fit">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Resumo da consulta</p>
                  <div className="mt-4 space-y-4">
                    <div><p className="text-xs text-slate-500">Tipo</p><p className="font-bold">Consulta online em portugues</p></div>
                    <div><p className="text-xs text-slate-500">Data</p><p className="font-bold">{selectedDayMeta.label}</p></div>
                    <div><p className="text-xs text-slate-500">Horario</p><p className="font-bold">{selectedTime || "Selecione um horario"}</p></div>
                    <div><p className="text-xs text-slate-500">Duracao</p><p className="font-bold">5-10 minutos</p></div>
                  </div>
                  <ContinueBookingButton label="Agendar agora" showSignUpHint />
                </div>
              </div>

              <div className="mt-6">
                <button className="text-primary font-bold underline underline-offset-4 text-left" onClick={() => setShowAllSlots((v) => !v)}>
                  {showAllSlots ? "Ver menos horarios" : "Ver mais"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">O que esta incluido e excluido</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">Incluido no servico</h3>
                <ul className="space-y-5">{included.map((item) => (<li key={item.title} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0" /><div><p className="font-bold">{item.title}</p><p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p></div></li>))}</ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">Nao incluido no servico</h3>
                <ul className="space-y-3">{excluded.map((item) => (<li key={item} className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</p></li>))}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[{ step: "Passo 1", icon: FileText, title: "Questionario online", desc: "Preencha um questionario simples e seguro." }, { step: "Passo 2", icon: Calendar, title: "Escolha um horario", desc: "Escolha o horario que melhor se adapta ao seu dia." }, { step: "Passo 3", icon: Clock, title: "Fale com um medico", desc: "Consulta por video com orientacao medica clara." }].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white/5 border border-white/10"><item.icon className="w-8 h-8 text-primary" /><p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p><p className="text-xl font-black mt-2">{item.title}</p><p className="text-sm text-slate-300 mt-2">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Perguntas frequentes</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqs.map((faq) => (<AccordionItem key={faq.q} question={faq.q} answer={faq.a} />))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[{ title: "Profissionalismo", icon: ShieldCheck, desc: "Medicos registrados no Irish Medical Council." }, { title: "Sigilo medico", icon: Heart, desc: "Mesma confidencialidade de consulta presencial." }, { title: "Experiencia", icon: Users, desc: "Mais de 100.000 consultas realizadas." }].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><item.icon className="w-5 h-5 text-primary" /><p className="font-black mt-3">{item.title}</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
