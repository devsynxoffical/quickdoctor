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
import spanishDoctorImage from "@/../public/hero-bg.png";

const bookingDays = [
  { key: "apr-21", day: "Mar", date: "21", month: "Abr", label: "Hoy, April 21st" },
  { key: "apr-22", day: "Mie", date: "22", month: "Abr", label: "Wednesday, April 22nd" },
  { key: "apr-23", day: "Jue", date: "23", month: "Abr", label: "Thursday, April 23rd" },
  { key: "apr-24", day: "Vie", date: "24", month: "Abr", label: "Friday, April 24th" },
  { key: "apr-25", day: "Sab", date: "25", month: "Abr", label: "Saturday, April 25th" },
  { key: "apr-26", day: "Dom", date: "26", month: "Abr", label: "Sunday, April 26th" },
];

const slotsByDay: Record<string, { time: string; price: string }[]> = {
  "apr-21": [
    { time: "09:45", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:15", price: "EUR49" },
    { time: "11:30", price: "EUR49" },
    { time: "11:45", price: "EUR49" },
    { time: "12:00", price: "EUR39" },
    { time: "12:15", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
    { time: "12:45", price: "EUR39" },
    { time: "13:00", price: "EUR49" },
    { time: "13:15", price: "EUR49" },
    { time: "13:30", price: "EUR49" },
  ],
  "apr-22": [
    { time: "09:00", price: "EUR49" },
    { time: "09:30", price: "EUR49" },
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR39" },
    { time: "11:45", price: "EUR39" },
  ],
  "apr-23": [
    { time: "09:15", price: "EUR49" },
    { time: "10:00", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:30", price: "EUR39" },
    { time: "12:15", price: "EUR39" },
  ],
  "apr-24": [
    { time: "10:00", price: "EUR49" },
    { time: "10:30", price: "EUR49" },
    { time: "11:15", price: "EUR39" },
  ],
  "apr-25": [
    { time: "10:30", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:45", price: "EUR39" },
  ],
  "apr-26": [
    { time: "10:15", price: "EUR49" },
    { time: "11:30", price: "EUR39" },
    { time: "12:15", price: "EUR39" },
  ],
};

const included = [
  { title: "Cartas de derivacion", desc: "Derivaciones a especialistas, analisis y estudios de imagen cuando sea necesario." },
  { title: "Certificados medicos", desc: "Bajas y certificados medicos cuando sea clinicamente apropiado." },
  { title: "Recetas de rutina", desc: "Recetas para la mayoria de medicamentos de uso habitual." },
  { title: "Consulta de 5-10 minutos", desc: "Evaluacion clara, orientacion medica y proximos pasos." },
];

const excluded = [
  "Certificados medicos retroactivos",
  "Informes medicos para NDLS",
  "Certificados de aptitud laboral, viaje o deporte",
  "Atencion de emergencia",
  "Sustancias controladas o de potencial abuso",
  "Medicamentos no autorizados o con monitoreo estrecho",
];

const faqs = [
  { q: "Que sucede durante la consulta?", a: "Hablas con un medico registrado en Irlanda y recibes orientacion clinica clara." },
  { q: "Puedo completar el cuestionario en espanol?", a: "No. El cuestionario medico debe completarse en ingles." },
  { q: "Puedo recibir una receta medica?", a: "Si, cuando sea clinicamente apropiado." },
  { q: "Mis documentos seran emitidos en espanol?", a: "No. Los documentos medicos se emiten en ingles." },
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

export default function SpanishConsultationPage() {
  const [selectedDay, setSelectedDay] = useState(bookingDays[0].key);
  const [selectedTime, setSelectedTime] = useState(slotsByDay[bookingDays[0].key][0]?.time ?? "");
  const [showAllSlots, setShowAllSlots] = useState(false);
  const selectedDayMeta = bookingDays.find((day) => day.key === selectedDay) ?? bookingDays[0];
  const daySlots = slotsByDay[selectedDay] ?? [];
  const visibleSlots = showAllSlots ? daySlots : daySlots.slice(0, 12);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">A healthier year starts now. Check your BMI and access medical weight care from EUR50.</p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 xl:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                <Heart className="w-4 h-4 fill-secondary" />
                Servicio de GP Online en Irlanda
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">Consulta Medica Online en <span className="text-primary">Espanol</span></h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">Proxima disponibilidad en 2 horas con medicos registrados en Irlanda.</p>
            </div>

            <div className="rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 w-full max-w-[540px] lg:justify-self-end">
              <img src={spanishDoctorImage.src} alt="Consulta online en espanol" className="w-full h-[300px] md:h-[360px] object-cover rounded-2xl" />
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
                <div><h2 className="text-2xl md:text-3xl font-black">Reservar cita</h2><p className="text-sm text-slate-500 mt-1">Selecciona fecha y hora para tu consulta en espanol.</p></div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl"><Calendar className="w-4 h-4" />April 2026</div>
              </div>

              <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Elige fecha</p>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Fechas anteriores"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Fechas siguientes"><ChevronRight className="w-4 h-4" /></button>
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
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Elige hora</p>
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
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Resumen de cita</p>
                  <div className="mt-4 space-y-4">
                    <div><p className="text-xs text-slate-500">Tipo</p><p className="font-bold">Consulta por video en espanol</p></div>
                    <div><p className="text-xs text-slate-500">Fecha</p><p className="font-bold">{selectedDayMeta.label}</p></div>
                    <div><p className="text-xs text-slate-500">Hora</p><p className="font-bold">{selectedTime || "Selecciona una hora"}</p></div>
                    <div><p className="text-xs text-slate-500">Duracion</p><p className="font-bold">5-10 minutos</p></div>
                  </div>
                  <ContinueBookingButton label="Reservar ahora" showSignUpHint />
                </div>
              </div>

              <div className="mt-6">
                <button className="text-primary font-bold underline underline-offset-4 text-left" onClick={() => setShowAllSlots((v) => !v)}>
                  {showAllSlots ? "Ver menos horas" : "Ver mas"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Que incluye y que no incluye</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">Incluido en el servicio</h3>
                <ul className="space-y-5">{included.map((item) => (<li key={item.title} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0" /><div><p className="font-bold">{item.title}</p><p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p></div></li>))}</ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">No incluido en el servicio</h3>
                <ul className="space-y-3">{excluded.map((item) => (<li key={item} className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</p></li>))}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[{ step: "Paso 1", icon: FileText, title: "Cuestionario en linea", desc: "Completa un cuestionario seguro antes de la cita." }, { step: "Paso 2", icon: Calendar, title: "Elige horario", desc: "Selecciona una cita que se adapte a tu agenda." }, { step: "Paso 3", icon: Clock, title: "Habla con un medico", desc: "Consulta por video con orientacion medica clara." }].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white/5 border border-white/10"><item.icon className="w-8 h-8 text-primary" /><p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p><p className="text-xl font-black mt-2">{item.title}</p><p className="text-sm text-slate-300 mt-2">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Preguntas frecuentes</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqs.map((faq) => (<AccordionItem key={faq.q} question={faq.q} answer={faq.a} />))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[{ title: "Experiencia", icon: ShieldCheck, desc: "Medicos registrados en Irlanda con atencion segura." }, { title: "Confidencialidad", icon: Heart, desc: "Misma confidencialidad que en consulta presencial." }, { title: "Comodidad", icon: Users, desc: "Consulta desde casa en horarios flexibles." }].map((item) => (
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
