import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return Response.json({ error: "未提供图片" }, { status: 400 });
    }

    // 解析 Base64 图片
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return Response.json({ error: "图片格式无效" }, { status: 400 });
    }
    const mimeType = `image/${matches[1]}`;
    const base64Data = matches[2];

    const prompt = `Generate a 2026 Year of the Horse Chinese New Year portrait based on the reference photo.

CRITICAL RULE: Preserve the person's face 100% pixel-perfect. Do NOT alter any facial features.

**Settings:**
- Aspect Ratio: 3:4 vertical
- Layout: 1x2 grid (top + bottom panels)
- Style: Natural lifestyle portrait with soft lighting

**Face Preservation (NON-NEGOTIABLE):**
Keep ALL facial features identical: eyes, nose, mouth, face shape, skin tone, hair, ears, eyebrows. Only modify clothing and add decorative elements.

**Modifications:**
- Clothing: Red festive sweater with horse year theme
- Background: Warm beige with subtle Chinese New Year decorations
- Lighting: Soft, natural light

**Grid Layout:**

TOP PANEL:
- Holding bright red paper-cut horse near face (not covering)
- Expression: Playful, happy
- Text: "一马当先" (calligraphy, Chinese red)

BOTTOM PANEL:
- Hands clasped in traditional greeting gesture
- Expression: Warm smile
- Text: "马到成功" (calligraphy, Chinese red)

FINAL CHECK: Face must be recognizable as the exact same person. Any deviation = failure.`;

    // Gemini 模型选择规范（2026-01-17）：
    // - 图像生成：gemini-3-pro-image-preview
    // - 文本生成（快速）：gemini-3-flash-preview
    // - 文本生成（高级）：gemini-3-pro-preview
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-image-preview",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts) {
      return Response.json({ error: "生成失败，无返回内容" }, { status: 500 });
    }

    let generatedImage: string | null = null;
    let generatedText: string | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      } else if (part.text) {
        generatedText = part.text;
      }
    }

    if (!generatedImage) {
      return Response.json(
        { error: "未生成图片", details: generatedText || "未知错误" },
        { status: 500 }
      );
    }

    return Response.json({
      image: generatedImage,
      text: generatedText,
    });
  } catch (error) {
    console.error("Generation error:", error);

    // 友好的错误提示映射
    let userMessage = "生成失败，请重试";
    let details = "";

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes("api key") || errorMsg.includes("unauthorized")) {
        userMessage = "服务配置错误，请联系管理员";
      } else if (errorMsg.includes("rate limit") || errorMsg.includes("quota")) {
        userMessage = "请求过于频繁，请稍后再试";
      } else if (errorMsg.includes("image") && errorMsg.includes("large")) {
        userMessage = "图片过大，请上传小于 5MB 的图片";
      } else if (errorMsg.includes("invalid") || errorMsg.includes("format")) {
        userMessage = "图片格式无效，请上传 JPG 或 PNG 格式";
      } else {
        details = error.message;
      }
    }

    return Response.json(
      { error: userMessage, details },
      { status: 500 }
    );
  }
}
