export type AgentReply = {
  answer: string;
  status: "verified" | "partial" | "insufficient_evidence";
  citations: Array<{ id: number; source: string; excerpt: string }>;
};

export async function askAgent(_question: string): Promise<AgentReply> {
  await new Promise((resolve) => setTimeout(resolve, 850));

  return {
    answer:
      "Mô hình ngôn ngữ lớn (LLM) xử lý văn bản bằng cách chia nội dung thành các token, sau đó dự đoán token tiếp theo dựa trên ngữ cảnh đã có. Cơ chế attention giúp mô hình xác định phần nào trong ngữ cảnh cần được chú ý nhiều hơn.",
    status: "verified",
    citations: [
      { id: 1, source: "Slide Day 1 · Trang 12", excerpt: "LLM dự đoán token tiếp theo dựa trên chuỗi token trước đó." },
      { id: 2, source: "Transcript · T04-041", excerpt: "Attention giúp mô hình cân nhắc các phần khác nhau của ngữ cảnh." },
    ],
  };
}
