import fs from "fs";
import path from "path";

export interface EvidenceChunk {
  id: string;
  source: string;
  type: "transcript" | "slide";
  pageOrTag: string;
  title: string;
  content: string;
}

// Đường dẫn ưu tiên tìm data pack
function getDataPackDir(): string | null {
  if (process.env.VLEARN_DATA_DIR && fs.existsSync(process.env.VLEARN_DATA_DIR)) {
    return process.env.VLEARN_DATA_DIR;
  }

  const possiblePaths = [
    path.resolve(process.cwd(), "..", "..", "K4-3A-Day05-06-AI-Product-Hackathon", "data", "vlearn-pack"),
    path.resolve(process.cwd(), "..", "K4-3A-Day05-06-AI-Product-Hackathon", "data", "vlearn-pack")
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Bộ Slide Day 1 cấu trúc chuẩn (29 trang)
const day1Slides: EvidenceChunk[] = [
  {
    id: "slide-d1-p01",
    source: "Slide Day 1 · Trang 1",
    type: "slide",
    pageOrTag: "Trang 1",
    title: "AI & LLM Foundation",
    content: "Day 01: AI & LLM Foundation. Khóa học AI Thực Chiến. Giới thiệu tổng quan về Large Language Models, Transformer và ứng dụng trong thực tế."
  },
  {
    id: "slide-d1-p03",
    source: "Slide Day 1 · Trang 3",
    type: "slide",
    pageOrTag: "Trang 3",
    title: "Mục tiêu bài học",
    content: "Hiểu bản chất của LLM: cách mô hình xử lý ngôn ngữ, cơ chế dự đoán token tiếp theo, kiến trúc Transformer, và cách tương tác qua API."
  },
  {
    id: "slide-d1-p11",
    source: "Slide Day 1 · Trang 11",
    type: "slide",
    pageOrTag: "Trang 11",
    title: "Bản chất của Large Language Models (LLM)",
    content: "Large Language Models là mô hình ngôn ngữ dựa trên kiến trúc Transformer, được huấn luyện trên hàng nghìn tỷ token văn bản. Năng lực: sinh văn bản, trả lời câu hỏi, viết code, suy luận (reasoning). Nguyên lý cốt lõi: Next-token prediction."
  },
  {
    id: "slide-d1-p12",
    source: "Slide Day 1 · Trang 12",
    type: "slide",
    pageOrTag: "Trang 12",
    title: "Cơ chế hoạt động: Next-Token Prediction",
    content: "LLM hoạt động bằng cách dự đoán token tiếp theo dựa trên chuỗi token trước đó. Mô hình tính toán phân phối xác suất trên toàn bộ từ vựng và chọn token tiếp theo theo thuật toán lấy mẫu."
  },
  {
    id: "slide-d1-p15",
    source: "Slide Day 1 · Trang 15",
    type: "slide",
    pageOrTag: "Trang 15",
    title: "Khái niệm Token & Tokenization",
    content: "Token là đơn vị cơ bản mà LLM sử dụng để xử lý văn bản. 1 token tương đương khoảng 4 ký tự tiếng Anh, hoặc xấp xỉ 0.75 từ. Tiếng Việt thường tốn nhiều token hơn do cơ chế ghép từ."
  },
  {
    id: "slide-d1-p16",
    source: "Slide Day 1 · Trang 16",
    type: "slide",
    pageOrTag: "Trang 16",
    title: "Context Window (Cửa sổ ngữ cảnh)",
    content: "Context Window là giới hạn số lượng token tối đa mà một mô hình LLM có thể tiếp nhận và ghi nhớ trong một lượt gọi (bao gồm cả prompt đầu vào và câu trả lời sinh ra)."
  },
  {
    id: "slide-d1-p18",
    source: "Slide Day 1 · Trang 18",
    type: "slide",
    pageOrTag: "Trang 18",
    title: "Hiện tượng Hallucination (Ảo giác AI)",
    content: "Hallucination là hiện tượng LLM sinh ra thông tin có vẻ tự tin và hợp lý nhưng thực chất hoàn toàn sai lệch hoặc không có căn cứ. Nguyên nhân do LLM tối ưu hóa xác suất ngôn ngữ chứ không tra cứu sự thật."
  },
  {
    id: "slide-d1-p22",
    source: "Slide Day 1 · Trang 22",
    type: "slide",
    pageOrTag: "Trang 22",
    title: "Cơ chế Self-Attention trong Transformer",
    content: "Cơ chế Self-Attention cho phép mô hình đánh giá và gán trọng số mức độ quan trọng giữa các từ trong câu so với từ đang xét, giúp nắm bắt ngữ cảnh ở khoảng cách xa."
  },
  {
    id: "slide-d1-p25",
    source: "Slide Day 1 · Trang 25",
    type: "slide",
    pageOrTag: "Trang 25",
    title: "Tham số Temperature & Top-p",
    content: "Temperature điều khiển tính ngẫu nhiên của câu trả lời. Temperature = 0 cho kết quả tất định và logic nhất. Temperature cao tăng tính sáng tạo và biến thiên."
  },
  {
    id: "slide-d1-p29",
    source: "Slide Day 1 · Trang 29",
    type: "slide",
    pageOrTag: "Trang 29",
    title: "Tổng kết Day 1 & Giới thiệu Lab API",
    content: "Tổng kết các khái niệm nền tảng AI/LLM. Chuẩn bị tài khoản và API Key để thực hành gọi mô hình trong buổi Lab tiếp theo."
  }
];

let cachedChunks: EvidenceChunk[] | null = null;

export function loadAllKnowledge(): EvidenceChunk[] {
  if (cachedChunks) return cachedChunks;

  const chunks: EvidenceChunk[] = [...day1Slides];
  const dataDir = getDataPackDir();

  if (dataDir) {
    const transcriptDir = path.join(dataDir, "transcript");
    // Nạp transcript 04 (Day 1) và 06 (Transformer & Attention)
    const filesToLoad = ["transcript-04-clean.md", "transcript-06-clean.md"];

    for (const fileName of filesToLoad) {
      const fullPath = path.join(transcriptDir, fileName);
      if (fs.existsSync(fullPath)) {
        try {
          const raw = fs.readFileSync(fullPath, "utf-8");
          const regex = /\*\*\[(T\d{2}-\d{3})\]\*\*\s*([\s\S]*?)(?=(?:\*\*\[T\d{2}-\d{3}\]\*\*|$))/g;
          let match;
          while ((match = regex.exec(raw)) !== null) {
            const tag = match[1];
            const text = match[2].trim();
            if (text.length > 30) {
              chunks.push({
                id: `transcript-${tag}`,
                source: `Transcript · ${tag}`,
                type: "transcript",
                pageOrTag: tag,
                title: `Transcript đoạn ${tag}`,
                content: text
              });
            }
          }
        } catch (e) {
          console.error(`Error loading transcript file ${fileName}:`, e);
        }
      }
    }
  }

  cachedChunks = chunks;
  return chunks;
}

// Hàm tìm kiếm đoạn trích liên quan dựa trên từ khóa ngữ nghĩa
export function searchEvidence(query: string, topK: number = 4): EvidenceChunk[] {
  const all = loadAllKnowledge();
  const q = query.toLowerCase();
  
  // Tách từ khóa quan trọng
  const tokens = q
    .replace(/[?,.:;!'"()]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["là", "gì", "như", "thế", "nào", "có", "không", "cho", "tôi", "hãy"].includes(w));

  if (tokens.length === 0) return [];

  const scored = all.map((chunk) => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();

    for (const t of tokens) {
      if (titleLower.includes(t)) score += 5;
      if (contentLower.includes(t)) {
        score += 2;
        // Thưởng điểm cho việc xuất hiện lặp lại
        const count = contentLower.split(t).length - 1;
        score += Math.min(count, 3);
      }
    }

    // Khớp cụm từ nguyên văn
    if (contentLower.includes(q)) score += 10;

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.chunk);
}
