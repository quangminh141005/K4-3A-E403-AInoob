import { NextResponse } from "next/server";
import { runVerificationPipeline } from "@/lib/server/verifier-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập câu hỏi hợp lệ." },
        { status: 400 }
      );
    }

    // Chạy toàn bộ pipeline kiểm định của Agent 2
    const result = await runVerificationPipeline(question);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lỗi trong API /api/chat:", error);
    return NextResponse.json(
      {
        answer: "Đã xảy ra lỗi nội bộ trong quá trình kiểm định. Vui lòng thử lại sau.",
        status: "insufficient_evidence",
        claims: [],
        citations: [],
        latency_ms: 0,
        model_used: "error-fallback"
      },
      { status: 500 }
    );
  }
}
