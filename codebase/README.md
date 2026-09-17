# VLearn AI Tutor — Frontend

## Chạy local

Yêu cầu: Node.js `22.13+` và npm.

```bash
cd codebase
npm ci
npm run dev
```

Mở địa chỉ được hiển thị trong terminal, thường là:

```text
http://localhost:3000
```

Trang AI Day 1:

```text
http://localhost:3000/course/k4-phase-1/day/day-1
```

## Kiểm tra build

```bash
npm run build
```

Hiện tại câu trả lời AI là dữ liệu mô phỏng trong `lib/agent-service.ts`.

## Cấu trúc codebase

```text
codebase/
├── app/
│   ├── page.tsx                    # Trang danh sách khoá học
│   ├── course/.../page.tsx         # Trang chat AI của Day 1
│   ├── api/                         # API backend sẽ bổ sung tại đây
│   ├── layout.tsx                   # Khung và metadata chung
│   └── globals.css                  # CSS dùng chung
├── components/
│   └── agent-workspace.tsx          # Giao diện và trạng thái chat
├── lib/
│   ├── agent-service.ts             # Kết nối frontend với AI/API
│   └── server/                      # Logic backend, RAG và verifier sau này
├── public/                          # Logo, icon và tài nguyên tĩnh
├── package.json                     # Thư viện và lệnh chạy dự án
└── .env.local                       # API key local, không commit lên Git
```

### Luồng hoạt động

```text
Người dùng nhập câu hỏi
        ↓
components/agent-workspace.tsx
        ↓
lib/agent-service.ts
        ↓
app/api/chat/route.ts (backend bổ sung sau)
        ↓
AI/RAG trả về câu trả lời và trích dẫn
```

Frontend không nên gọi trực tiếp model AI. Mọi yêu cầu AI đi qua `agent-service.ts` và API backend.

## Phân chia công việc

| Việc cần làm | File/thư mục |
|---|---|
| Tạo prompt/system instruction | `codebase/prompts/` hoặc file backend |
| Gọi Gemini/OpenAI/model khác | Backend trong `codebase/` |
| Xử lý output | Backend trong `codebase/` |
| Hiện kết quả trong UI | Frontend trong `codebase/` |
| Lưu trace/log mẫu | `eval/traces/` |
| Mô tả AI call | `codebase/README.md` |
| Ghi phần thật và mock | `spec.md §` |

Không cần tách thành hai dự án riêng. Frontend và backend có thể cùng nằm trong dự án Next.js này.

- **Frontend:** làm việc trong `app/`, `components/` và `lib/agent-service.ts`.
- **Backend:** tạo API trong `app/api/` và đặt logic AI/RAG trong `lib/server/`.
- Không đưa API key vào Git. Lưu biến bí mật trong `.env.local`.

Backend cần cung cấp endpoint:

```text
POST /api/chat
```

Request:

```json
{
  "question": "Token là gì?",
  "lessonId": "day-1"
}
```

Response:

```json
{
  "answer": "Nội dung câu trả lời",
  "status": "verified",
  "citations": [
    {
      "id": 1,
      "source": "Slide Day 1 · Trang 12",
      "excerpt": "Đoạn nội dung làm bằng chứng"
    }
  ]
}
```

Khi backend hoàn thành `/api/chat`, thay dữ liệu mô phỏng trong `lib/agent-service.ts` bằng lệnh `fetch` tới endpoint này.
