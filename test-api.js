// 简单的 1x1 红色像素 PNG 图片的 base64
const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

async function testAPI() {
  try {
    console.log("正在调用 API...");
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: testImage }),
    });

    console.log("状态码:", response.status);
    const data = await response.json();
    console.log("响应数据:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("错误:", error.message);
  }
}

testAPI();
