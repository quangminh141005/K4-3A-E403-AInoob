export type AgentReply = {
  answer: string;
  status: "verified" | "partial" | "insufficient_evidence";
  citations: Array<{ id: number; source: string; excerpt: string }>;
};

export async function askAgent(question: string): Promise<AgentReply> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, lessonId: "day-1" }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = (await res.json()) as AgentReply;
    return data;
  } catch (error) {
    console.error("Failed to fetch from agent API:", error);
    return {
      answer: "Đã xảy ra lỗi khi kết nối tới Trợ lý học tập. Vui lòng thử lại sau.",
      status: "insufficient_evidence",
      citations: [],
    };
  }
}
