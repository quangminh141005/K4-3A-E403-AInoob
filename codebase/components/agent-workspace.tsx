"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, BookOpen, Check, ChevronDown, ChevronRight, FileText, FlaskConical, Menu, Send, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { askAgent } from "@/lib/agent-service";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  status?: "verified" | "partial" | "insufficient_evidence";
  citations?: Array<{ id: number; source: string; excerpt: string }>;
};
const suggestions = [
  "Token là gì?",
  "LLM hoạt động như thế nào?",
  "Giải thích cơ chế attention",
  "Hallucination là gì?",
  "Temperature có ý nghĩa gì?",
  "Context window là gì?"
];
const firstMessage: Message = { id: 1, role: "assistant", text: "Chào bạn! Mình có thể giúp bạn tìm hiểu nội dung Day 1. Câu trả lời sẽ được đối chiếu với slide và transcript của bài học." };

export function AgentWorkspace() {
  const [messages,setMessages] = useState<Message[]>([firstMessage]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [sourcesOpen,setSourcesOpen] = useState(true);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages((current)=>[...current,{ id: Date.now(), role: "user", text: question.trim() }]);
    setInput(""); setLoading(true);
    const reply = await askAgent(question);
    setMessages((current)=>[
      ...current,
      {
        id: Date.now()+1,
        role: "assistant",
        text: reply.answer,
        status: reply.status,
        citations: reply.citations
      }
    ]);
    setLoading(false);
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(input); }

  return <main className="flex min-h-screen flex-col bg-white text-[#292d32]">
    <header className="flex h-[70px] shrink-0 items-center border-b border-slate-200 px-4 shadow-sm lg:px-6">
      <Link href="/" aria-label="Quay lại khoá học" className="mr-3 rounded-lg p-2 hover:bg-slate-100"><ArrowLeft size={21}/></Link><h1 className="text-lg font-bold sm:text-xl">Bài 1 · Day01</h1>
      <div className="ml-auto flex items-center gap-3 sm:gap-6"><div className="hidden items-center gap-3 md:flex"><span className="font-semibold text-slate-600">1/28 bài</span><span className="h-2 w-32 rounded-full bg-slate-100"><span className="block h-full w-[8%] rounded-full bg-[#155a9d]"/></span></div><span className="hidden h-8 w-px bg-slate-200 sm:block"/><span className="hidden items-center gap-2 font-semibold sm:flex"><Sparkles size={19} className="text-[#8d3889]"/>Hỏi đáp với AI</span><span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf3fb] font-bold text-[#155a9d]">N</span></div>
    </header>
    <div className="relative flex min-h-0 flex-1">
      <button onClick={()=>setSidebarOpen(true)} className="absolute left-3 top-3 z-10 rounded-lg border border-slate-200 bg-white p-2 shadow-sm lg:hidden" aria-label="Mở nội dung bài học"><Menu size={21}/></button>
      <aside className={`${sidebarOpen?"translate-x-0":"-translate-x-full"} fixed inset-y-0 left-0 z-30 w-[310px] border-r border-slate-200 bg-[#f1f6f9] transition-transform lg:static lg:w-[330px] lg:translate-x-0`}>
        <div className="flex h-[60px] items-center justify-between border-b border-slate-200 px-5"><h2 className="font-extrabold tracking-wide">NỘI DUNG BÀI HỌC</h2><button onClick={()=>setSidebarOpen(false)} className="rounded p-1 hover:bg-slate-200 lg:hidden" aria-label="Đóng"><X size={20}/></button></div>
        <button onClick={()=>setSourcesOpen(!sourcesOpen)} className="flex w-full items-center justify-between border-b border-slate-200 px-5 py-4 text-left font-bold">Slides & tài liệu <ChevronDown size={19} className={sourcesOpen?"rotate-180 transition":"transition"}/></button>
        {sourcesOpen&&<div className="space-y-1 p-3"><button className="flex w-full items-center gap-3 rounded-lg bg-white px-3 py-3 text-left font-medium shadow-sm"><BookOpen size={19} className="text-[#b26a00]"/>Day01 · AI & LLM Foundation</button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium hover:bg-white"><FileText size={19} className="text-[#155a9d]"/>Transcript · Foundation</button></div>}
        <div className="mt-2 border-y border-slate-200 bg-[#e2edf4] px-5 py-4"><div className="flex items-center gap-3 font-bold"><FlaskConical size={20} className="text-[#155a9d]"/>Lab 01 — Nền tảng LLM API <ChevronRight size={18} className="ml-auto"/></div></div>
      </aside>
      {sidebarOpen&&<button className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={()=>setSidebarOpen(false)} aria-label="Đóng nội dung bài học"/>}

      <section className="flex min-w-0 flex-1 flex-col bg-[#f8fafc]">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-5 pt-16 sm:px-7 lg:pt-8">
          <div className="mb-6 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#155a9d] text-white"><Sparkles size={22}/></span><div><h2 className="text-2xl font-extrabold">Trợ lý học tập Day 1</h2><p className="mt-1 text-slate-600">Hỏi về nội dung trong slide và transcript của bài học.</p></div></div>
          <div className="flex-1 space-y-5" aria-live="polite">
            {messages.map((message,index)=><div key={message.id} className={message.role==="user"?"ml-auto max-w-[80%]":"max-w-[92%]"}>
              <div className={message.role==="user"?"rounded-2xl rounded-br-sm bg-[#155a9d] px-4 py-3 leading-7 text-white":"rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-4 leading-7 shadow-sm"}>
                {message.text}
                {message.role==="assistant" && message.citations && message.citations.length > 0 && (
                  <span className="ml-1 inline-flex gap-1">
                    {message.citations.map((c, i) => (
                      <button key={c.id || i} className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-[#e8f3ec] px-1.5 align-middle text-sm font-bold text-[#137044]">
                        {i + 1}
                      </button>
                    ))}
                  </span>
                )}
              </div>
              {message.role==="assistant" && index > 0 && message.status === "verified" && (
                <div className="mt-2 rounded-xl border border-[#b9dfc8] bg-[#f1fbf5] p-4">
                  <div className="flex items-center gap-2 font-bold text-[#116b40]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#137044] text-white"><Check size={15}/></span>
                    Đã kiểm định từ tài liệu bài học (Agent 2 Verified)
                  </div>
                  {message.citations && message.citations.length > 0 && (
                    <details className="mt-3" open>
                      <summary className="cursor-pointer font-semibold text-[#155a9d]">Xem {message.citations.length} nguồn trích dẫn</summary>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        {message.citations.map((c, idx) => (
                          <p key={c.id || idx}>
                            <b>[{idx + 1}] {c.source}</b><br/>
                            {c.excerpt}
                          </p>
                        ))}
                      </div>
                    </details>
                  )}
                  <div className="mt-3 flex items-center gap-2 border-t border-[#cde8d7] pt-3 text-slate-500">
                    <span className="text-sm">Nguồn này hữu ích?</span>
                    <button aria-label="Hữu ích" className="rounded p-1 hover:bg-white"><ThumbsUp size={16}/></button>
                    <button aria-label="Không hữu ích" className="rounded p-1 hover:bg-white"><ThumbsDown size={16}/></button>
                  </div>
                </div>
              )}
              {message.role==="assistant" && index > 0 && message.status === "insufficient_evidence" && (
                <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <span>⚠️</span>
                    Không đủ căn cứ trong bài học
                  </div>
                  <p className="mt-1 text-xs text-amber-700">Bộ kiểm định phát hiện nội dung này không có trong Slide/Transcript Day 1.</p>
                </div>
              )}
            </div>)}
            {loading&&<div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-500 shadow-sm"><span>Đang đối chiếu tài liệu</span>{[1,2,3].map((dot)=><span key={dot} className="typing-dot h-1.5 w-1.5 rounded-full bg-[#155a9d]"/>)}</div>}
          </div>
          {messages.length===1&&<div className="my-5 flex flex-wrap gap-2">{suggestions.map((suggestion)=><button key={suggestion} onClick={()=>void send(suggestion)} className="rounded-full border border-[#b8cfe4] bg-white px-4 py-2.5 text-sm font-semibold text-[#155a9d] hover:bg-[#eef5fb]">{suggestion}</button>)}</div>}
          <form onSubmit={submit} className="mt-5 rounded-2xl border border-slate-300 bg-white p-2 shadow-[0_8px_24px_rgba(15,61,102,.08)] focus-within:border-[#155a9d]"><label htmlFor="question" className="sr-only">Đặt câu hỏi về bài học</label><div className="flex items-end gap-2"><textarea id="question" rows={1} value={input} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();void send(input)}}} placeholder="Đặt câu hỏi về bài học..." className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 outline-none"/><button disabled={!input.trim()||loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#155a9d] text-white hover:bg-[#0f4c86] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Gửi câu hỏi"><Send size={19}/></button></div><p className="px-3 pb-1 text-xs text-slate-500">AI chỉ trả lời dựa trên tài liệu bài học. Hãy kiểm tra lại các nguồn được trích dẫn.</p></form>
        </div>
      </section>
    </div>
  </main>;
}
