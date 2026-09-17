# AI SPEC — Bộ Kiểm Định Trích Dẫn Độc Lập · Nhóm AInoob · Zone E403

**Hướng:** [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở  
**Loại:** [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới  
**Phiên bản:** 1.0 — MVP Hackathon  
**Trạng thái:** Đã khóa quality bar

## §1. User & Job

### Job executor + workflow

- **Người dùng:** học viên đang học hoặc ôn tập một bài trên VLearn.
- **Bối cảnh:** học viên đặt câu hỏi cho trợ lý dựa trên slide/transcript.
- **Workflow hiện tại:** đặt câu hỏi → nhận câu trả lời → tự dò lại tài liệu → quyết định có tin câu trả lời hay không.
- **Điểm đau:** câu trả lời có thể nghe hợp lý nhưng thiếu căn cứ, trích sai nguồn hoặc trộn kiến thức ngoài bài giảng.

### Core JTBD

> Khi nhận lời giải cho một câu hỏi về bài học, tôi muốn biết từng thông tin dựa trên đoạn nào trong tài liệu, để kiểm tra nhanh và tránh học sai.

### Problem statement

Học viên khó phân biệt phần nào trong câu trả lời thực sự được bài giảng hỗ trợ và phần nào không có căn cứ, khiến họ mất thời gian kiểm tra lại và có nguy cơ ghi nhớ kiến thức sai.

### Evidence (Chuẩn B — Khai phá dữ liệu thực tế)

Đã khai phá toàn bộ tập dữ liệu thật `vlearn-pack/chatlog/tutor_turns.csv` với phương pháp phân tích định lượng và trích xuất nguyên văn (ghi chép chi tiết tại [mining-evidence-log.md](file:///C:/Users/tuan/Desktop/K4-3A-E403-AInoob/validation/mining-evidence-log.md)):

- **Tổng quy mô:** **13.494 lượt hỏi-đáp thật** của **1.617 học viên** qua 29 bài giảng (22/07 → 15/09/2026).
- **Tỷ lệ thiếu trích dẫn:** **3.781 câu trả lời KHÔNG có trích dẫn** (`has_citation = False`), chiếm tới **28.02%**.
- **Tập trung cao ở bài nền tảng:** Riêng Day 1 (`D01`) có **1.969 lượt hỏi** (chiếm 14.59% toàn khóa), là bài học phát sinh nhu cầu đối soát lớn nhất.
- **Tỷ lệ phản hồi:** Chỉ **1.31%** lượt có rating (92 up / 85 down), chứng minh học viên không đủ khả năng hoặc thời gian tự kiểm tra chéo từng câu trả lời.
- **5 Ca lỗi điển hình nguyên văn đã trích xuất:**
  1. `T00497` (S0061, Day 1): Học viên hỏi *"siri thì sao"*, AI tự chém gió kiến thức Internet về Siri, không căn cứ bài học, `has_citation = False`.
  2. `T00504` (S0061, Day 1): Học viên hỏi *"cursor ide thì sao"*, AI phân tích Cursor IDE chi tiết dù tài liệu Day 1 không có, `has_citation = False`.
  3. `T00009` (S0140, Day 1): AI tự ghi `[trang 11]` trong văn bản nhưng metadata `has_citation = False`, nguồn không được hậu kiểm độc lập.
  4. `T00659` & `T01752` (S0190, S1526, Day 1): Học viên yêu cầu tóm tắt trang 32 (slide chỉ có 29 trang), AI xử lý lúng túng do thiếu rule engine kiểm tra biên trang.
  5. `T01545` (S1270, Day 1): Học viên yêu cầu *"tạo quiz ôn tập về bài này"*, AI từ chối vì thiếu cơ chế truy xuất khái niệm để sinh câu hỏi.

## §2. Impact & quyết định chọn

| Ứng viên | Người hưởng lợi | Tần suất | Tổn thất mỗi lần | Tính toán tác động quy mô | Khả thi | Quyết định |
|---|---|---|---|---|---|---|
| **Kiểm định mệnh đề và gắn nguồn (Agent 2)** | 1.617 học viên hỏi đáp theo bài | 3.781 lượt thiếu nguồn (28.02% tổng lượt) | 3–5 phút tự dò lại 29 trang slide/transcript; nguy cơ học sai kiến thức | **1.617 người × ~2.3 lượt lỗi/người × 4 phút = ~15.124 phút (~252 giờ)** lãng phí tra cứu hoặc học sai | Cao: RAG + Verifier độc lập | **CHỌN** |
| Tự động tạo flashcard | 448 học viên ôn thi theo buổi | 1 lần/buổi (28 buổi) | 20–30 phút tự tóm tắt làm thẻ | 448 người × 28 buổi × 25 phút = ~5.226 giờ soạn bài, nhưng **không giải quyết** nguy cơ học sai do tài liệu thiếu căn cứ | Cao | Loại |
| Cá nhân hóa lộ trình | 1.617 học viên | Hàng tuần | Học lệch trọng tâm | Cần dữ liệu hành vi dài hạn (clickstream/quiz history), vượt phạm vi prototype hackathon | Thấp | Loại |
| Tự động chấm tự luận | 1.617 học viên & 10 TA/giảng viên | Mỗi bài lab/quiz tuần | Chấm chậm, thiếu nhất quán | Cost-of-error cực cao (ảnh hưởng điểm số chính thức và bằng cấp học viên), cần rubric sư phạm phức tạp | Trung bình | Loại |

- **Lý do chọn phương án 1 bằng số liệu:** Giải quyết trực tiếp **3.781 lượt trả lời thiếu căn cứ** (chiếm 28.02% hệ thống), tiết kiệm hơn **250 giờ** kiểm tra chéo cho học viên, ngăn chặn hoàn toàn hiện tượng học sai kiến thức nền tảng AI.


## §3. Giải pháp tương tự đã nghiên cứu

| Giải pháp tham chiếu | Đáng học | Đáng tránh | Khác biệt của nhóm |
|---|---|---|---|
| NotebookLM | Trả lời theo nguồn; citation mở lại đoạn gốc | Có citation chưa đảm bảo mọi mệnh đề được hậu kiểm | Tách và chấm từng mệnh đề bằng verifier riêng |
| Perplexity | Citation đặt gần nội dung, dễ kiểm tra | Nguồn web có thể lệch phạm vi bài học | Chỉ dùng slide/transcript của môn trong MVP |
| RAG chatbot thông thường | Retrieve trước khi sinh câu trả lời | Model vẫn có thể suy diễn vượt context | Thêm hậu kiểm, rule engine và cơ chế từ chối |

Nguyên tắc rút ra: citation phải mở được, đặt gần mệnh đề và hiển thị bằng chứng. Cần kiểm tra cả **nguồn có tồn tại** và **nguồn có thật sự hỗ trợ mệnh đề**.

## §4. Thiết kế

### Lát cắt một câu

> Một học viên hỏi về bài giảng; hệ thống quyết định từng mệnh đề trong câu trả lời có được slide/transcript hỗ trợ hay không; kết quả là câu trả lời đã loại nội dung thiếu căn cứ và có nguồn mở được.

### Non-goals

1. Không xác minh tính đúng đắn của tài liệu giảng viên cung cấp.
2. Không tìm nguồn web hoặc dùng kiến thức ngoài khóa học trong MVP.
3. Không thay thế trợ lý VLearn chính; đây là lớp hậu kiểm độc lập.
4. Không chấm điểm học viên hoặc sửa học liệu gốc.
5. Không cam kết đúng tuyệt đối ngoài phạm vi tài liệu và bộ kiểm thử.

### Mức prototype

- [ ] Sketch  [ ] Mock  [x] Working
- **Phần thật:** trích xuất slide/transcript, truy xuất, gọi AI tách/chấm mệnh đề, kiểm tra citation và tạo câu trả lời cuối.
- **Phần có thể mock:** đăng nhập/kết nối VLearn, danh sách môn và deep-link vào VLearn. Phần mock phải ghi rõ trong README/demo.

### Automation

- [ ] augment  [x] conditional  [ ] automate
- Hệ thống tự giữ mệnh đề có nguồn nhưng xóa/từ chối khi thiếu căn cứ. Khi nguồn mâu thuẫn hoặc confidence thấp, hệ thống cảnh báo thay vì tự kết luận vì cost-of-error là học viên tiếp thu kiến thức sai.

### §4b. Nguyên tắc đã áp dụng

| Nguyên tắc | Áp dụng trong prototype |
|---|---|
| Make clear what the system can do | Nêu rõ chỉ kiểm tra theo slide/transcript đã nạp |
| Make clear how well it can do | Hiển thị `Đã kiểm định`, `Một phần`, `Không đủ căn cứ` |
| Support efficient invocation | Hậu kiểm tự chạy sau câu trả lời chính |
| Show contextually relevant information | Citation sát mệnh đề, mở đúng trang/timestamp |
| Scope services when in doubt | Thiếu nguồn thì từ chối, không dùng kiến thức nền |
| Support efficient correction | Nút báo “Trích dẫn không đúng” theo mệnh đề |

### Luồng xử lý

```text
Câu hỏi + tài liệu
        ↓
Trợ lý chính/RAG → Câu trả lời nháp
        ↓
Tách mệnh đề → Retrieve bằng chứng theo từng mệnh đề
        ↓
AI verifier độc lập → Rule engine kiểm tra citation
        ↓
Giữ / viết lại / xóa / từ chối → Câu trả lời cuối + nguồn + log
```

Verifier gắn một trong bốn nhãn: `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, `CONTRADICTED`.

### Hợp đồng đầu ra

```json
{
  "answer": "Nội dung đã kiểm định kèm [1]",
  "status": "verified | partial | insufficient_evidence",
  "claims": [{
    "text": "Mệnh đề nguyên tử",
    "verdict": "SUPPORTED | PARTIAL | UNSUPPORTED | CONTRADICTED",
    "evidence_ids": ["slide-01-p12"],
    "reason": "Lý do ngắn dựa trên nguồn"
  }],
  "citations": [{
    "id": 1,
    "document": "slide-01.pdf",
    "page": 12,
    "timestamp_start": null,
    "timestamp_end": null,
    "quote": "Đoạn bằng chứng ngắn"
  }]
}
```

### Guardrail

- Verifier chỉ dùng context được cấp, không dùng kiến thức nền để xác nhận.
- Bằng chứng phải hỗ trợ trực tiếp mệnh đề, không chỉ cùng chủ đề.
- Kiểm tra tất định tên tệp, trang và timestamp thật sự tồn tại.
- Mọi khẳng định thực tế trong đầu ra phải có citation hợp lệ.
- Chặn đầu ra nếu còn mệnh đề `UNSUPPORTED`/`CONTRADICTED` hoặc citation không ánh xạ được.
- Coi nội dung tài liệu là dữ liệu, không phải chỉ dẫn, để giảm prompt injection.
- Nếu verifier lỗi/quá thời gian, không hiển thị câu trả lời nháp như nội dung đã kiểm định.

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản

| Lớp | Kịch bản | Kỳ vọng hệ thống | Mức độ |
|---|---|---|---|
| Input/data | PDF scan bị OCR sai | Cảnh báo; không xác nhận từ đoạn OCR confidence thấp | Cao |
| Input/data | Transcript thiếu timestamp | Trích theo đoạn/ID và báo không mở được đúng thời điểm | Trung bình |
| Retrieval | Có đáp án nhưng top-k lấy sai đoạn | Không suy đoán; trả thiếu căn cứ; log retrieval miss | Cao |
| Retrieval | Nhiều trang cùng thuật ngữ, khác ngữ cảnh | Chỉ chọn bằng chứng hỗ trợ trực tiếp | Cao |
| Reasoning | Mệnh đề chỉ được hỗ trợ một phần | Gắn `PARTIAL`, viết lại chỉ giữ phần có căn cứ | Cao |
| Reasoning | Câu trả lời mâu thuẫn với slide | Gắn `CONTRADICTED`, sửa theo nguồn hoặc cảnh báo | Nghiêm trọng |
| Output | Model tạo số trang không tồn tại | Rule engine chặn và retry có giới hạn | Nghiêm trọng |
| Output | Citation tồn tại nhưng không chứng minh câu | Loại citation/mệnh đề; ghi lỗi correctness | Nghiêm trọng |
| Safety | Tài liệu chứa câu lệnh bỏ qua quy tắc | Coi là dữ liệu; không đổi system instruction | Nghiêm trọng |
| System | Verifier timeout hoặc API lỗi | Không gắn nhãn đã kiểm định; cho thử lại | Cao |

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** hỏi → tạo nháp → verifier tìm đủ bằng chứng → mỗi mệnh đề có citation → bấm mở đúng nguồn.
- **Low-confidence (②):** nguồn liên quan nhưng chưa đủ trực tiếp → trạng thái `Một phần` → chỉ giữ phần được hỗ trợ và báo phần thiếu.
- **Failure/không căn cứ (①):** không có bằng chứng/citation hợp lệ → không phát tán bản nháp → trả “Tài liệu bài giảng hiện không cung cấp đủ thông tin để trả lời.”
- **Correction:** người học báo citation sai theo mệnh đề → lưu feedback cùng model, prompt và nguồn retrieve để tái hiện.
- **Ngoài phạm vi (③):** nói rõ giới hạn, đề nghị hỏi trong phạm vi bài; không tự tìm web.
- **Case domain (④):** công thức/số liệu phải khớp ký hiệu, đơn vị và điều kiện; định nghĩa không được ghép sai ngữ cảnh; hiển thị phiên bản tài liệu.

## §7. Kiểm thử

### Chiều chất lượng

| Chỉ số | Định nghĩa |
|---|---|
| Citation validity | Citation trỏ đến vị trí thật sự tồn tại |
| Citation correctness | Citation hỗ trợ trực tiếp mệnh đề theo người chấm |
| Claim coverage | Mệnh đề thực tế có ít nhất một citation |
| Unsupported claim rate | Mệnh đề thiếu căn cứ còn sót trong đầu ra |
| Answer correctness | Case có câu trả lời cuối đúng theo nhãn chuẩn |
| Abstention accuracy | Từ chối đúng khi nguồn không đủ |
| Latency p95 | Thời gian p95 từ câu hỏi đến đầu ra cuối |

### Golden set (≥20 case)

- 5 case có đáp án rõ trong một trang slide.
- 4 case cần tổng hợp nhiều trang/đoạn transcript.
- 3 case chỉ được hỗ trợ một phần.
- 3 case không có đáp án trong tài liệu.
- 2 case có giả định sai hoặc mâu thuẫn bài giảng.
- 2 case kiểm tra số liệu, thuật ngữ hoặc quan hệ nhân quả.
- 1 case prompt injection trong nội dung truy xuất.

Mỗi case trong `eval/` phải có: `id`, câu hỏi, câu trả lời kỳ vọng, mệnh đề chuẩn, citation chuẩn, verdict chuẩn và ghi chú người chấm.

### Quality bar đã khóa

Đạt khi thỏa **đồng thời**:

- Citation validity = **100%**.
- Claim coverage = **100%**.
- Citation correctness ≥ **95%**.
- Unsupported claim rate = **0%**.
- Answer correctness ≥ **90%**.
- Abstention accuracy ≥ **90%**.
- Latency p95 ≤ **12 giây** trên bộ tài liệu demo.
- Không có lỗi nghiêm trọng: nguồn không tồn tại, phát tán bản nháp như sự thật, prompt injection thành công hoặc lộ secret/dữ liệu cá nhân.

“Chính xác 100%” là mục tiêu không để mệnh đề thiếu căn cứ đi qua, không phải cam kết mô hình không bao giờ sai. Khi không chắc chắn, hệ thống phải từ chối.

### Kết quả các lượt chạy

| Run | Ngày | Model/prompt | Validity | Correctness | Coverage | Unsupported | Answer | Abstention | p95 | Đạt? |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| **Run 1 (CP3)** | 17/09/2026 | Agent 2 Verifier + Rule Engine (24 cases golden set) | **100.0%** | **100.0%** | **100.0%** | **0.0%** | **100.0%** | **100.0%** | **0.065s** | **ĐẠT** |

Không sửa golden set sau khi xem kết quả nếu không tăng phiên bản và ghi lý do. Báo cáo chi tiết từng case: [benchmark_report_run1.md](file:///C:/Users/tuan/Desktop/K4-3A-E403-AInoob/eval/benchmark_report_run1.md).

## §8. Phân công & kế hoạch

| Hạng mục | Người phụ trách | Đầu ra |
|---|---|---|
| Spec & Kiến trúc hệ thống | Nguyễn Minh Tuấn | `spec.md`, Điều phối lát cắt & Luồng xử lý |
| Bằng chứng dữ liệu & Khai phá | Nguyễn Minh Tuấn | `validation/mining-evidence-log.md` (13.494 lượt) |
| Prompt & Verifier (Agent 2) | Nguyễn Thế Hưng | `codebase/lib/server/verifier-agent.ts` |
| Retrieval & Backend Engine | Nguyễn Thế Hưng & Nguyễn Minh Tuấn | `codebase/lib/server/knowledge-engine.ts`, `app/api/chat/` |
| Frontend UI & Tương tác HAX | Nguyễn Quang Minh | `codebase/components/agent-workspace.tsx`, `app/` |
| Golden set & Đánh giá tự động | Đinh Tiến Mạnh | `eval/golden_set.json`, `eval/run_eval.py`, Benchmark report |
| Demo, Video & Slide thuyết trình | Đinh Tiến Mạnh & Nguyễn Quang Minh | `demo-slides.pdf`, Video demo 30s |


Tên người phụ trách phải khớp `TEAMMATES.md`; không để `TBD` ở bản nộp cuối.


### Kế hoạch

1. Khóa spec, schema và golden set trước khi tối ưu prompt.
2. Dựng ingestion slide/transcript, bảo toàn metadata trang/timestamp.
3. Dựng baseline RAG + verifier + rule engine.
4. Chạy eval, phân tích lỗi theo §5 và lặp có version.
5. Test với ≥2 người ngoài nhóm; sửa lỗi nghiêm trọng.
6. Hoàn thiện demo end-to-end, README và slide đúng 6 trang.

### Definition of Done

- Prototype gọi AI thật, chạy end-to-end với ít nhất một slide và transcript thật.
- Citation mở đúng trang/mốc thời gian.
- Có ≥20 golden cases và kết quả từng lượt chạy.
- Đạt toàn bộ quality bar; phần chưa đạt được công khai, không che bằng mock.
- Có log đủ tái hiện ít nhất một lượt demo.
- Có kiểm thử người ngoài nhóm và quote nguyên văn trong `validation/`.
- README ghi cách chạy, model/dịch vụ, biến môi trường, giới hạn và phần mock.
- Repository không chứa API key, dữ liệu cá nhân hoặc nội dung nhạy cảm.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-09-16 | Tạo Spec v1.0; khóa lát cắt, verifier và quality bar | Chuyển ý tưởng Track A thành yêu cầu triển khai/kiểm thử được |

