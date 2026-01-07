"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Download,
  Check,
  Loader2,
  Sparkles,
  ImageIcon,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请上传图片文件");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "生成失败");
      }

      setResultImage(data.image);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "masnap-2026-portrait.png";
    link.click();
  };

  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 selection:bg-red-200 selection:text-red-900">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-100/20 to-orange-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-6">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                <span className="text-white text-lg">🐴</span>
              </div>
              <span className="font-bold text-xl text-neutral-800">MaSnap</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100/80 backdrop-blur rounded-full border border-red-200/50">
                2026 马年
              </span>
            </motion.div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                马年写真
              </span>
              <br />
              <span className="text-neutral-800">AI 生成器</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-md mx-auto">
              上传你的照片，AI 直接生成专属马年新春双拼写真
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-neutral-900/10 border border-white/50 overflow-hidden">
              {/* Steps Indicator */}
              <div className="px-8 py-5 border-b border-neutral-100/80 bg-white/50">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      image ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        image
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {image ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className="font-medium">上传照片</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      loading
                        ? "text-orange-600"
                        : resultImage
                        ? "text-green-600"
                        : "text-neutral-400"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        loading
                          ? "bg-orange-100 text-orange-600"
                          : resultImage
                          ? "bg-green-100 text-green-600"
                          : "bg-neutral-100 text-neutral-400"
                      )}
                    >
                      {resultImage ? <Check className="w-4 h-4" /> : "2"}
                    </div>
                    <span className="font-medium">AI 生成</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      resultImage ? "text-green-600" : "text-neutral-400"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        resultImage
                          ? "bg-green-100 text-green-600"
                          : "bg-neutral-100 text-neutral-400"
                      )}
                    >
                      {resultImage ? <Check className="w-4 h-4" /> : "3"}
                    </div>
                    <span className="font-medium">下载写真</span>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {!image ? (
                    /* Upload Zone */
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(
                          "relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group",
                          dragging
                            ? "border-red-400 bg-red-50/50 scale-[1.02]"
                            : "border-neutral-200 hover:border-red-300 hover:bg-red-50/30"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <div className="py-16 px-8 text-center">
                          <motion.div
                            animate={dragging ? { scale: 1.1, y: -5 } : {}}
                            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/10 transition-shadow"
                          >
                            <Upload
                              className={cn(
                                "w-10 h-10 transition-colors",
                                dragging ? "text-red-500" : "text-red-400"
                              )}
                            />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                            {dragging ? "松开以上传" : "点击或拖拽上传照片"}
                          </h3>
                          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                            支持 JPG、PNG 格式，建议上传清晰的人脸自拍照
                          </p>
                          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full px-8 py-3 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            选择照片
                          </Button>
                        </div>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </motion.div>
                  ) : !resultImage ? (
                    /* Preview & Generate */
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-neutral-100 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt="Preview"
                          className="w-full max-h-[400px] object-contain mx-auto"
                        />
                        <button
                          onClick={handleReset}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="rounded-full px-6"
                          disabled={loading}
                        >
                          重新选择
                        </Button>
                        <Button
                          onClick={handleGenerate}
                          disabled={loading}
                          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full px-8 py-3 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              AI 生成中...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 mr-2" />
                              生成写真
                            </>
                          )}
                        </Button>
                      </div>

                      {loading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-4"
                        >
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                            正在生成马年新春写真，请稍候...
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    /* Result - Generated Image */
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                          <Check className="w-4 h-4" />
                          生成完成
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-neutral-500 text-center">
                            原图
                          </p>
                          <div className="rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt="Original"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>

                        {/* Generated */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-red-500 text-center">
                            🐴 马年写真
                          </p>
                          <div className="rounded-2xl overflow-hidden bg-neutral-100 border-2 border-red-200 shadow-lg shadow-red-500/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resultImage}
                              alt="Generated Portrait"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="rounded-full px-6"
                        >
                          生成新的
                        </Button>
                        <Button
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full px-8 shadow-lg shadow-red-500/25"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          下载写真
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
          >
            {[
              {
                icon: "🎨",
                title: "智能换装",
                desc: "AI 自动穿上新年红装",
              },
              {
                icon: "🐴",
                title: "马年主题",
                desc: "融合剪纸马等喜庆元素",
              },
              {
                icon: "✨",
                title: "一键生成",
                desc: "Gemini AI 直接出图",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-2xl bg-white/50 backdrop-blur border border-white/50"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-neutral-800 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-neutral-400">
          <p>
            Made with ❤️ for 2026 Year of the Horse •{" "}
            <span className="text-neutral-500">Powered by Gemini AI</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
