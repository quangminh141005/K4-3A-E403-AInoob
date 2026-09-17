import { NextResponse } from "next/server";

export type MockItem = {
  question: string;
  keywords: string[];
  answer: string;
  status: "verified" | "partial" | "insufficient_evidence";
  citations: Array<{ id: number; source: string; excerpt: string }>;
};

// Danh sách các câu hỏi & câu trả lời mô phỏng theo Day 1 - AI & LLM Foundation
export const mockKnowledgeBase: MockItem[] = [
  {
    question: "Token là gì?",
    keywords: ["token", "đơn vị", "chi phí token", "1 token"],
    answer: "Token là đơn vị cơ bản mà mô hình ngôn ngữ sử dụng để đọc và xử lý văn bản. Một token có thể là một từ, một phần của từ hoặc một ký tự. Trung bình 1 token tương đương khoảng 4 ký tự tiếng Anh, hoặc xấp xỉ 0.75 từ.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 15", excerpt: "Token là đơn vị xử lý của LLM. 1 token ~ 4 ký tự tiếng Anh hoặc 0.75 từ." },
      { id: 2, source: "Transcript · T04-023", excerpt: "Mô hình chia nhỏ câu thành chuỗi token thay vì xử lý nguyên từ để tối ưu từ vựng." }
    ]
  },
  {
    question: "LLM hoạt động như thế nào?",
    keywords: ["llm", "hoạt động", "mô hình ngôn ngữ", "cơ chế", "dự đoán"],
    answer: "Mô hình ngôn ngữ lớn (LLM) hoạt động dựa trên cơ chế tự hồi quy (autoregressive) để dự đoán token tiếp theo. Khi nhận dữ liệu đầu vào, mô hình tính toán phân phối xác suất trên toàn bộ kho từ vựng và chọn ra token tiếp theo phù hợp nhất dựa trên ngữ cảnh.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 12", excerpt: "LLM dự đoán token tiếp theo dựa trên chuỗi token trước đó theo xác suất thống kê." },
      { id: 2, source: "Transcript · T04-041", excerpt: "Transformer và cơ chế attention giúp mô hình liên kết các phần khác nhau của ngữ cảnh dài." }
    ]
  },
  {
    question: "Giải thích cơ chế attention",
    keywords: ["attention", "self-attention", "cơ chế chú ý", "transformer"],
    answer: "Cơ chế self-attention trong kiến trúc Transformer cho phép mô hình cân nhắc và gán trọng số mức độ quan trọng cho các từ khác nhau trong câu khi xử lý một từ cụ thể. Điều này giúp LLM nắm bắt được ngữ cảnh và mối quan hệ ngữ nghĩa ở khoảng cách xa mà mạng RNN truyền thống khó làm được.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 22", excerpt: "Attention mô phỏng sự chú ý, gán trọng số tương quan giữa các token trong cùng chuỗi." },
      { id: 2, source: "Transcript · T06-015", excerpt: "Với self-attention, mỗi từ nhìn vào tất cả các từ xung quanh để giải nghĩa chính xác từ đó." }
    ]
  },
  {
    question: "Hallucination (ảo giác AI) là gì và vì sao xảy ra?",
    keywords: ["hallucination", "ảo giác", "bịa đặt", "sai lệch"],
    answer: "Hallucination (ảo giác) là hiện tượng LLM sinh ra thông tin nghe có vẻ rất thuyết phục và tự tin nhưng thực tế hoàn toàn sai lệch hoặc không có căn cứ. Nguyên nhân cốt lõi là do LLM tối ưu hóa việc dự đoán token có xác suất cao nhất chứ không thực sự 'suy nghĩ' hay tra cứu sự thật khách quan nếu không được bổ sung kỹ thuật RAG/Grounding.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 18", excerpt: "Hallucination xuất hiện khi mô hình ưu tiên tính liên tục của ngôn ngữ hơn tính chính xác thực tế." },
      { id: 2, source: "Transcript · T04-067", excerpt: "LLM sinh text theo xác suất, nếu không đối soát nguồn thì nguy cơ bịa thông tin là rất cao." }
    ]
  },
  {
    question: "Temperature trong LLM có ý nghĩa gì?",
    keywords: ["temperature", "tham số", "độ ngẫu nhiên", "nhiệt độ"],
    answer: "Temperature là tham số điều khiển mức độ ngẫu nhiên và sáng tạo của câu trả lời. Temperature thấp (gần 0) làm mô hình chọn các token có xác suất cao nhất, cho kết quả ổn định và logic; Temperature cao (gần 1 hoặc hơn) làm phân phối xác suất đồng đều hơn, khuyến khích câu trả lời đa dạng và sáng tạo hơn.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 25", excerpt: "Temperature = 0: xác định, ít sáng tạo; Temperature cao: tăng tính bất ngờ và biến thiên câu trả lời." }
    ]
  },
  {
    question: "Context window (cửa sổ ngữ cảnh) là gì?",
    keywords: ["context window", "cửa sổ ngữ cảnh", "độ dài ngữ cảnh", "ngữ cảnh"],
    answer: "Context window là giới hạn số lượng token tối đa mà một mô hình LLM có thể tiếp nhận và ghi nhớ trong một lượt gọi (bao gồm cả prompt của người dùng và câu trả lời sinh ra). Nếu vượt quá giới hạn này, thông tin cũ sẽ bị cắt bỏ hoặc lãng quên.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 16", excerpt: "Context window là dung lượng bộ nhớ tối đa cho cả đầu vào và đầu ra trong một phiên xử lý." }
    ]
  }
];

const fallbackResponse = {
  answer: "Phần nội dung này dường như không nằm trong phạm vi bài giảng Day 1 hoặc không có đủ bằng chứng từ Slide/Transcript để kiểm định chắc chắn. Bạn vui lòng đặt câu hỏi bám sát tài liệu bài học.",
  status: "insufficient_evidence",
  citations: []
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // Simulate AI processing delay (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const normalized = question.trim().toLowerCase();
    
    // Tìm kiếm câu hỏi khớp trong mock database
    const matched = mockKnowledgeBase.find((item) => {
      if (item.question.toLowerCase() === normalized) return true;
      return item.keywords.some((kw) => normalized.includes(kw.toLowerCase()));
    });

    if (matched) {
      return NextResponse.json({
        answer: matched.answer,
        status: matched.status,
        citations: matched.citations
      });
    }

    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
