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

### Evidence

Chưa đủ dữ liệu người dùng để khẳng định quy mô vấn đề. Trước vòng validation, nhóm phải bổ sung vào `validation/`:

- Kết quả khảo sát với `n`, số lượng và tỷ lệ người xác nhận từng pain point.
- Tối thiểu 5 quote nguyên văn, có mã người tham gia, thời điểm và bối cảnh.
- Tối thiểu 3 ví dụ câu trả lời VLearn thiếu căn cứ hoặc trích dẫn sai.
- Không dùng số liệu hoặc quote giả trong báo cáo và demo.

## §2. Impact & quyết định chọn

| Ứng viên | Người hưởng lợi | Tần suất | Tổn thất mỗi lần | Khả thi | Quyết định |
|---|---|---|---|---|---|
| Kiểm định mệnh đề và gắn nguồn | Người hỏi đáp theo bài | Mỗi câu trả lời | Học sai, mất thời gian dò nguồn | Cao: RAG + verifier | **Chọn** |
| Tự động tạo flashcard | Người ôn thi | Mỗi buổi ôn | Tốn thời gian soạn thẻ | Cao nhưng phổ biến | Loại |
| Cá nhân hóa lộ trình | Người học dài hạn | Hàng tuần | Học lệch trọng tâm | Thấp: cần lịch sử dài hạn | Loại |
| Tự động chấm tự luận | Học viên/giảng viên | Mỗi bài tập | Chấm chậm, thiếu nhất quán | Trung bình; rủi ro cao | Loại |

- **Flashcard:** không xử lý rủi ro học sai do nội dung thiếu căn cứ.
- **Lộ trình học:** cần dữ liệu hành vi dài hạn, vượt phạm vi prototype.
- **Chấm tự luận:** cần rubric và kiểm định domain sâu; quyết định sai ảnh hưởng điểm số.
- **Phương án chọn:** giải quyết trực tiếp hallucination, xuất hiện ở mỗi lượt hỏi đáp và đo được bằng độ đúng/đủ của citation. Quy mô impact sẽ được cập nhật bằng evidence thật, chưa tuyên bố bằng số khi chưa có dữ liệu.

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
| Baseline | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Chưa chạy |

Không sửa golden set sau khi xem kết quả nếu không tăng phiên bản và ghi lý do.

## §8. Phân công & kế hoạch

| Hạng mục | Người phụ trách | Đầu ra |
|---|---|---|
| Spec & quality bar | TBD | `spec.md` |
| Evidence & user research | TBD | Log/quote trong `validation/` |
| Prompt & verifier | TBD | Prompt có version trong `codebase/` |
| Retrieval & application code | TBD | Prototype trong `codebase/` |
| Golden set & evaluation | TBD | Dataset/kết quả trong `eval/` |
| Demo & slides | TBD | `demo-slides.pdf` |

Tên người phụ trách phải khớp `TEAMMATES.md`; không để `TBD` ở bản nộp cuối.

### Willing users và validation

- Người dùng 1: **TBD** — thử happy path và case không đủ căn cứ.
- Người dùng 2: **TBD** — kiểm tra khả năng hiểu/mở citation và correction.
- Lưu task completion, lỗi quan sát, quote nguyên văn và thay đổi sau test trong `validation/`.

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

