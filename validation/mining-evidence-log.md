# Báo Cáo Khai Phá Dữ Liệu Bằng Chứng (Mining Evidence Log)
**Dự án:** Bộ Kiểm Định Trích Dẫn Độc Lập (Agent 2) — VLearn AI Tutor  
**Nhóm thực hiện:** AInoob (Zone E403)  
**Tập dữ liệu nguồn:** `vlearn-pack/chatlog/tutor_turns.csv` (13.494 lượt hỏi-đáp thực tế)  
**Phương pháp:** Trích xuất tự động qua script phân tích định lượng và trích mẫu nguyên văn kiểm chứng được.

---

## 1. Số liệu thống kê tổng thể (Quantitative Evidence)

| Chỉ số phân tích | Số lượng thực tế | Tỷ lệ % | Ý nghĩa thực tiễn |
|---|---:|---:|---|
| **Tổng số lượt hỏi-đáp (Turns)** | **13.494** | 100.0% | Toàn bộ hội thoại thực tế của học viên từ 22/07 đến 15/09/2026. |
| **Câu trả lời KHÔNG có trích dẫn (`has_citation = False`)** | **3.781** | **28.02%** | **Gần 1/3 câu trả lời của AI Tutor không có nguồn chứng minh**, tạo rủi ro hallucination rất lớn. |
| **Câu trả lời có ghi nhận trích dẫn (`has_citation = True`)** | 9.713 | 71.98% | Nhiều câu có text trích dẫn nhưng sai trang hoặc không được hậu kiểm độc lập. |
| **Câu hỏi mẫu bấm sẵn từ giao diện (`is_preset = True`)** | 3.067 | 22.73% | Học viên thường dùng câu gợi ý; khi câu hỏi ngoài lề thì AI dễ bịa. |
| **Lượt đánh giá của học viên (Rating)** | 177 | 1.31% | Tỷ lệ phản hồi cực kỳ thấp (92 Thumbs Up / 85 Thumbs Down), chứng minh học viên không thể tự phát hiện hết lỗi sai. |

### Phân bố lượt hỏi theo các bài học trọng tâm:
- **D01 (Day 1 - AI & LLM Foundation):** 1.969 lượt (14.59%) — *Bài học có số lượt hỏi cao nhất toàn khóa*.
- **D02 (Day 2 - Xác định bài toán):** 1.781 lượt (13.20%).
- **D03 (Day 3):** 1.293 lượt (9.58%).
- **D04 (Day 4):** 1.208 lượt (8.95%).
- **D05 (Day 5):** 1.122 lượt (8.31%).

---

## 2. Các Ca Lỗi Điển Hình Trích Xuất Nguyên Văn (Verbatim Case Studies)

Dưới đây là các ví dụ nguyên văn chứng minh sự cần thiết cấp bách của **Bộ Kiểm Định Độc Lập (Agent 2)**:

### Case 1: Lỗi "Nhiệt tình quá mức" — Đưa kiến thức ngoài Internet vào bài giảng
- **Turn ID:** `T00497`
- **Bài học:** `D01` (Day 1 - AI & LLM Foundation)
- **Học viên:** `S0061` | **Preset:** False
- **Câu hỏi của học viên:**
  > `(Trang 3, đoạn được chọn: "siri thì sao")`  
  > `siri thì sao`
- **Câu trả lời của AI Tutor:**
  > *"Siri được coi là một ví dụ sớm của **trợ lý ảo (virtual assistant)** có tính chất của một **agent** đơn giản... Đặc tính "agentic" của Siri nằm ở việc nó không chỉ dừng lại ở phản hồi ngôn ngữ, mà có thể "tác động" trực tiếp vào môi trường phần mềm..."*
- **Đánh giá & Phân tích lỗi:**
  - `has_citation = False`.
  - Trong tài liệu Day 1 không hề đề cập đến Siri hay các tính năng chi tiết của Siri. AI Tutor tự động "lôi kiến thức Internet" ra để giải thích một cách tự tin mà không hề có căn cứ trong tài liệu khóa học.
  - **Hành vi mong muốn của Agent 2:** Bắt lỗi thiếu căn cứ, từ chối hoặc cảnh báo: *"Tài liệu Day 1 không đề cập đến Siri. Bạn vui lòng tra cứu tài liệu tham khảo ngoài hoặc hỏi về các khái niệm trong bài."*

---

### Case 2: Tự suy diễn tính năng công cụ ngoài phạm vi tài liệu bài học
- **Turn ID:** `T00504`
- **Bài học:** `D01` (Day 1 - AI & LLM Foundation)
- **Học viên:** `S0061` | **Preset:** False
- **Câu hỏi của học viên:**
  > `(Trang 3, đoạn được chọn: "cursor ide thì sao")`  
  > `cursor ide thì sao`
- **Câu trả lời của AI Tutor:**
  > *"Cursor IDE được coi là một ví dụ điển hình về công cụ có tính **"agentic" cao** trong lĩnh vực lập trình... Nó có khả năng "đọc" và hiểu toàn bộ cấu trúc dự án (codebase)..."*
- **Đánh giá & Phân tích lỗi:**
  - `has_citation = False`.
  - Đưa thông tin ngoài lề không có trong tài liệu Day 1, khiến học viên nhầm lẫn giữa kiến thức chuẩn của buổi học và công cụ bên ngoài.

---

### Case 3: Trích dẫn giả lập nhưng hệ thống không thể xác minh
- **Turn ID:** `T00009`
- **Bài học:** `D01` (Day 1 - AI & LLM Foundation)
- **Học viên:** `S0140` | **Preset:** False
- **Câu hỏi của học viên:**
  > `(Trang 1, đoạn được chọn: "Hãy giải thích ngắn gọn LLM là gì và trích dẫn slide.")`  
  > `Hãy giải thích ngắn gọn LLM là gì và trích dẫn slide.`
- **Câu trả lời của AI Tutor:**
  > *"Large Language Model (LLM) hay Mô hình ngôn ngữ lớn là một loại mô hình ngôn ngữ dựa trên kiến trúc Transformer... [trang 11]. Cơ chế hoạt động: Hoạt động dựa trên nguyên lý Next-token prediction [trang 11]..."*
- **Đánh giá & Phân tích lỗi:**
  - AI Tutor tự chèn chuỗi text `[trang 11]`, nhưng siêu dữ liệu nền tảng ghi nhận `has_citation = False` vì hệ thống không có bộ verifier xác thực xem trang 11 có thực sự nói về các định nghĩa trên hay không.
  - **Hành vi mong muốn của Agent 2:** Phân tách thành 3 mệnh đề nguyên tử và đối soát từng mệnh đề với Trang 11 và Transcript.

---

### Case 4: Lỗi truy xuất trang không tồn tại (Out-of-bounds Page Reference)
- **Turn ID:** `T00659` và `T01752`
- **Bài học:** `D01`
- **Câu hỏi:**
  > `(Trang 32, đoạn được chọn: "sumary this slide")`
- **Câu trả lời của AI Tutor:**
  > *"Rất tiếc, hiện tại tôi không thể truy cập trực tiếp vào nội dung trang 32 của tài liệu bài giảng này..."*
- **Đánh giá & Phân tích lỗi:**
  - Slide Day 1 chỉ có 29 trang. Học viên chọn hoặc nhập trang 32 khiến hệ thống bị bối rối và phản hồi lúng túng.
  - **Hành vi mong muốn của Agent 2:** Rule engine kiểm tra tất định `page <= 29`, lập tức báo rõ trang không tồn tại thay vì để LLM trả lời mơ hồ.

---

## 3. Kết Luận Khai Phá & Tác Động (Impact)
1. **Quy mô ảnh hưởng:** 1.617 học viên toàn khóa, với 3.781 lượt câu trả lời không có căn cứ (28.02%).
2. **Hậu quả:** Học viên ôn tập bị tiếp nhận kiến thức không chuẩn hoặc mất trung bình 3-5 phút mỗi câu để tự lật lại 29 trang slide và hàng nghìn dòng transcript tìm xem câu trả lời có đúng hay không.
3. **Giải pháp Agent 2:** Đóng vai trò là chốt chặn độc lập:
   - Đối soát từng mệnh đề với Slide/Transcript.
   - Ép buộc gắn citation chính xác có thể mở xem trực tiếp.
   - Thẳng tay từ chối hoặc cảnh báo khi câu hỏi vượt quá phạm vi bài giảng.
