# VLearn AI Tutor — Bộ Kiểm Định Trích Dẫn Độc Lập (Agent 2)
> **Zone E403 · Nhóm AInoob · Mini Hackathon AI Batch 04**  
> **Track A: VLearn Tutor (A1: Tối ưu AI Tutor & Chống Hallucination)**

---

## 📌 1. Vấn đề & Bằng chứng thực tế (Problem & Evidence)

Qua khai phá toàn bộ dữ liệu thật `vlearn-pack/chatlog/tutor_turns.csv` (**13.494 lượt hỏi-đáp** của 1.617 học viên):
- **28.02% câu trả lời (3.781 lượt)** của AI Tutor **KHÔNG CÓ TRÍCH DẪN** (`has_citation = False`).
- AI Tutor mắc tật *"nhiệt tình quá mức"*: hễ tài liệu bài học thiếu thông tin là tự ý lôi kiến thức Internet ra giải thích (ví dụ: tự phân tích Siri, Cursor IDE dù không có trong Slide/Transcript Day 1), khiến học viên tiếp thu sai lệch nội dung chuẩn của khóa học.
- Chi tiết phương pháp và 5 ca lỗi nguyên văn: xem tại [`validation/mining-evidence-log.md`](validation/mining-evidence-log.md) và [`spec.md`](spec.md).

---

## 🎯 2. Giải pháp: Bộ Kiểm Định Trích Dẫn Độc Lập (Agent 2)

**Lát cắt một câu:**  
> *Một học viên hỏi về bài giảng; hệ thống quyết định từng mệnh đề trong câu trả lời có được slide/transcript hỗ trợ hay không; kết quả là câu trả lời đã loại nội dung thiếu căn cứ và có nguồn mở được.*

### Kiến trúc Luồng Xử lý (Dual-Agent Architecture):
```text
Câu hỏi của học viên + Tài liệu bài giảng (Slide / Transcript)
                    ↓
         [Agent 1: Generator RAG]
                    ↓  (Câu trả lời nháp)
       [Tách Mệnh Đề Nguyên Tử (Claims)]
                    ↓
    [Agent 2: Independent Citation Verifier]
                    ↓
      Đối soát từng claim với Evidence gốc:
   (SUPPORTED / PARTIAL / UNSUPPORTED / CONTRADICTED)
                    ↓
          [Rule Engine & Safety Gating]
   - Kiểm tra số trang tồn tại (page <= 29)
   - Chặn Prompt Injection
   - Loại bỏ mệnh đề không căn cứ / Từ chối (insufficient_evidence)
                    ↓
   Câu trả lời cuối + Trích dẫn kiểm định + Log
```

---

## 🚀 3. Hướng dẫn Chạy Cục bộ (How to Run)

### Yêu cầu môi trường
- Node.js `22.13+` và npm.
- Python 3.10+ (cho bộ runner đánh giá benchmark).

### Khởi động Frontend & Backend Prototype
```bash
cd codebase
npm ci
npm run dev
```

Mở trình duyệt tại:  
👉 **`http://localhost:5173/course/k4-phase-1/day/day-1`**

### Cấu hình biến môi trường (Tùy chọn)
Tạo file `codebase/.env.local` nếu muốn gọi trực tiếp model Gemini thật:
```env
GEMINI_API_KEY="AIzaSy..."
# VLEARN_DATA_DIR="C:\\path\\to\\vlearn-pack" (Mặc định tự tìm trong thư mục hackathon)
```
*(Nếu không có API key, hệ thống tự động sử dụng **Local Deterministic Verifier Engine** nạp trực tiếp transcript/slide bài giảng, đảm bảo demo offline ổn định 100% không bị lỗi mạng).*

---

## 📊 4. Chạy Đánh Giá Tự Động (Benchmark Golden Set)

Bộ kiểm thử gồm **24 cases** (phủ đủ 4 lớp chỗ khó ①②③④ và $\ge 12$ cases lấy trực tiếp từ chatlog thật) tại [`eval/golden_set.json`](eval/golden_set.json):

```bash
python eval/run_eval.py
```

### Kết quả đo lường Lượt 1 (Run 1 Benchmark):
- **Citation Validity:** **100.0%** (Quality bar: 100%) — ✅ Đạt
- **Claim Coverage:** **100.0%** (Quality bar: 100%) — ✅ Đạt
- **Citation Correctness:** **100.0%** (Quality bar: $\ge$ 95%) — ✅ Đạt
- **Unsupported Claim Rate:** **0.0%** (Quality bar: 0%) — ✅ Đạt
- **Answer Correctness:** **100.0%** (Quality bar: $\ge$ 90%) — ✅ Đạt
- **Abstention Accuracy:** **100.0%** (Quality bar: $\ge$ 90%) — ✅ Đạt
- **Latency p95:** **0.065s** (Quality bar: $\le$ 12.0s) — ✅ Đạt

Báo cáo chi tiết từng case: xem tại [`eval/benchmark_report_run1.md`](eval/benchmark_report_run1.md).

---

## 👥 5. Phân công Thành viên (Team Members)

| Họ và tên | MSSV | GitHub | Vai trò chính | Phần phụ trách trong repo |
|---|---|---|---|---|
| **Nguyễn Minh Tuấn** | 2A202602850 | `Tuan-Nguyen-Minhh` | Product & System Architect | Quản trị `spec.md`, khai phá 13.494 lượt chatlog, kiến trúc Knowledge Engine RAG |
| **Nguyễn Thế Hưng** | 2A202602381 | `hungdong19982003-sudo` | AI & Verifier Lead | Xây dựng Agent 2 Verifier pipeline, prompt, đối soát mệnh đề |
| **Đinh Tiến Mạnh** | 2A202602458 | `dinhtienmanh2906` | Evaluation & Testing Lead | Xây dựng Golden set 24 cases, script `run_eval.py` và báo cáo Benchmark |
| **Nguyễn Quang Minh** | 2A202602440 | `quangminh141005` | Frontend & UX Lead | Xây dựng Agent Workspace UI, Claim breakdown, tương tác HAX/PAIR, Video demo 30s |

---

## 📁 6. Cấu trúc Repository

```text
├── 01-challenge-brief.md         # Tóm tắt bài toán & lát cắt prototype
├── README.md                     # Tổng quan dự án, hướng dẫn chạy & phân công
├── TEAMMATES.md                  # Danh sách và vai trò 4 thành viên
├── spec.md                       # AI Spec v1.0 khóa Quality bar & kết quả đo
├── codebase/                     # Mã nguồn dự án Next.js
│   ├── app/                      # App router & API route (/api/chat)
│   ├── components/               # Agent workspace & UI components
│   ├── lib/server/               # Knowledge Engine (RAG) & Agent 2 Verifier
│   └── lib/agent-service.ts      # Client service kết nối backend
├── eval/                         # Thư mục kiểm thử tự động
│   ├── golden_set.json           # 24 test cases chuẩn hóa
│   ├── run_eval.py               # Script chạy đánh giá tự động
│   └── benchmark_report_run1.md  # Báo cáo kết quả benchmark lượt 1
└── validation/                   # Bằng chứng dữ liệu & phản hồi người dùng
    └── mining-evidence-log.md    # Log khai phá 13.494 lượt chatlog thật
```
