import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

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

    const prompt = `FACE IDENTITY LOCKDOWN PROTOCOL:
TREAT THE REFERENCE FACE AS A TEMPLATE THAT CANNOT BE ALTERED.
YOU ARE NOT ALLOWED TO CHANGE ANY FACIAL CHARACTERISTICS.
THE FACE MUST BE COPIED PIXEL-FOR-PIXEL FROM THE REFERENCE.
IF THE FACE IS NOT IDENTICAL, THE GENERATION HAS FAILED.
ONLY MODIFY THE CLOTHING (RED SWEATER) AND ADD FESTIVE ELEMENTS.
DO NOT REINTERPRET, STYLIZE, OR "IMPROVE" THE FACE.
COPY IT EXACTLY AS IT APPEARS IN THE REFERENCE PHOTO.

Based on this reference photo, generate a 2026 Year of the Horse Chinese New Year portrait photo with the following requirements:

**PROJECT SETTINGS:**
- Task: 2026马年新春_双拼写真_剪纸马版
- Aspect Ratio: 3:4 (竖屏)
- Grid Layout: 1x2 (上下两格拼接)
- Output Aesthetic: 顶级小红书/Instagram博主生活感写真

**CRITICAL REFERENCE CONTROL:**
- 核心指令: 绝对锁定用户上传参考图的面部身份，不得有任何改变
- 面部一致性: 100% Pixel-Perfect (像素级精准复刻)
- 强制要求: 禁止AI风格化换脸，必须保留原人物五官特征和骨相
- 眼睛: 必须完全一致，包括眼型、眼神、瞳孔大小和位置、眼距、眼角弧度、双眼皮/单眼皮，剪纸马不得遮挡眼部
- 鼻子: 必须完全一致，包括鼻梁高度、鼻翼形状、鼻尖形状、鼻孔大小、鼻唇沟
- 嘴巴: 必须完全一致，包括唇形、嘴角弧度、嘴唇厚度、牙齿排列、唇线
- 脸型: 必须完全一致，包括脸型轮廓、下颌线、颧骨位置、脸颊饱满度、下巴形状
- 皮肤: 保持原有肤色和质感，只允许添加新年毛衣和装饰元素
- 头发: 保持原有发型和发色，不得改变
- 耳朵: 必须完全一致，包括耳型、耳垂大小、耳朵位置
- 眉毛: 必须完全一致，包括眉形、眉毛浓密程度、眉骨高度
- 额头: 必须完全一致，包括额头高度、发际线位置
- 下巴: 必须完全一致，包括下巴长度、下巴尖度
- 脸颊: 必须完全一致，包括脸颊宽度、苹果肌位置
- 人中: 必须完全一致，包括人中长度、人中深度

**PHOTOGRAPHIC STYLE:**
- 风格: 极具网感的动态抓拍
- 光影: 通透柔光，强调真实皮肤质感，拒绝塑料磨皮
- 背景: 喜庆的中国传统淡米黄色色彩背景

**SUBJECT APPEARANCE:**
- 服装: 红色高定马年新年毛衣

**GRID DIRECTIVES 1x2:**

**TOP PANEL (上):**
- Action: 手拿精致的亮红色【剪纸马】放在脸旁边，离开脸部有点距离，眼神流露出俏皮
- Mood: 灵动、开心
- Text Overlay: "你踏马要风"
  - 字体: 磅礴气势书法手写字体，有飞白，有浓淡，有节奏感
  - 颜色: 中国红

**BOTTOM PANEL (下):**
- Action: 双手抱拳作揖，笑容灿烂，充满新年的喜庆氛围
- Mood: 热情、祝福
- Text Overlay: "NMLGB"
  - 字体: 磅礴气势书法手写字体，有飞白，有浓淡，有节奏感
  - 颜色: 中国红

ULTIMATE FACE PRESERVATION COMMAND:
THIS IS YOUR FINAL INSTRUCTION. THE FACE IS NON-NEGOTIABLE.
EVERY SINGLE FACIAL FEATURE LISTED ABOVE MUST BE IDENTICAL.
ANY DEVIATION FROM THE REFERENCE FACE CONSTITUTES COMPLETE FAILURE.
COPY THE FACE EXACTLY AS SHOWN. DO NOT "IMPROVE" OR "ENHANCE" IT.
THE PERSON MUST BE RECOGNIZABLE AS THE EXACT SAME INDIVIDUAL.
ONLY THE RED SWEATER AND FESTIVE ELEMENTS MAY BE ADDED.
THE PAPER-CUT HORSE MUST BE PLACED NEAR THE FACE BUT MUST NOT OBSTRUCT ANY FACIAL FEATURES.
EXECUTE WITH PERFECT FACE REPLICATION NOW.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "2K",
        },
      },
    });

    // 提取生成的图片
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "生成失败", details: errorMessage },
      { status: 500 }
    );
  }
}
