import Link from "next/link";
import { Bell, BookOpen, ChevronRight, Circle, FlaskConical, Home, Moon, PlayCircle, Puzzle } from "lucide-react";

const lessons = ["Buổi 1: Day01","Buổi 2: DAY02","Buổi 3: DAY03","Buổi 4: DAY04","Buổi 5: Day05","Buổi 6: Day06"];

export default function HomePage() {
  return <main className="min-h-screen bg-[#f4f8fc] text-[#272a2f]">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1540px] items-center gap-10 px-5 lg:px-10">
        <div className="flex items-center gap-2.5" aria-label="VLearn"><span className="brand-mark"/><span className="text-[1.7rem] font-extrabold tracking-tight text-[#0c4f91]"><span className="text-[#cf202c]">V</span>Learn</span></div>
        <nav className="hidden h-full items-center gap-9 md:flex" aria-label="Điều hướng chính">
          <a className="nav-link active" href="#"><Home size={22}/>Trang chủ</a><a className="nav-link" href="#"><BookOpen size={22}/>Khoá học</a><a className="nav-link" href="#"><Puzzle size={22}/>Luyện tập <small>Sắp ra mắt</small></a><a className="nav-link" href="#"><FlaskConical size={22}/>Lab</a>
        </nav>
        <div className="ml-auto flex items-center gap-4 text-slate-600"><span className="hidden rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold sm:block">EN <b className="ml-1 text-[#c92431]">VI</b></span><Moon size={20} className="hidden sm:block"/><Bell size={20}/><span className="grid h-11 w-11 place-items-center rounded-full bg-[#115596] font-bold text-white">N</span></div>
      </div>
    </header>
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <section className="mb-12"><h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Chào buổi sáng, Minh! 👋</h1><p className="mt-5 text-lg font-medium text-slate-700">✨ Bạn vừa học hôm qua môn L3–L4 · Khoá 4 Phase 1. Còn 15 buổi phía trước.</p><Link href="/course/k4-phase-1/day/day-1" className="mt-6 inline-flex rounded-lg bg-[#155a9d] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#0e4a84]">Vào khoá học</Link></section>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-extrabold md:text-3xl">KHÓA HỌC CỦA TÔI</h2><a href="#" className="hidden items-center gap-2 font-bold sm:flex"><ChevronRight className="text-[#ce2733]"/>XEM TẤT CẢ</a></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"><div className="flex gap-8 border-b border-slate-200 font-bold"><button className="border-b-2 border-[#155a9d] px-1 pb-4 text-[#155a9d]">L3–L4 · Khoá 4 Phase 1</button><button className="px-1 pb-4 text-slate-500">Khoá 3 Phase 1</button></div>
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">{lessons.map((lesson,index)=>index===0?<Link key={lesson} href="/course/k4-phase-1/day/day-1" className="flex min-h-16 items-center gap-4 border-l-[3px] border-[#155a9d] bg-[#eef5fb] px-4 font-semibold text-[#12528f] hover:bg-[#e4f0fa]"><PlayCircle size={21}/><span>{lesson}</span><span className="ml-auto hidden text-sm font-extrabold tracking-widest sm:block">ĐANG HỌC...</span></Link>:<div key={lesson} className="flex min-h-16 items-center gap-4 border-t border-slate-200 px-4 font-medium"><Circle size={20} className="text-slate-400"/>{lesson}</div>)}</div>
        </div>
      </section>
    </div>
  </main>;
}
