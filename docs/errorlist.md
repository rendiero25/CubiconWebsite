MASALAH:
Saat ini resolusi (1K/2K/4K) yang dipilih user hanya dikirim sebagai 
hint teks di dalam prompt string ke Gemini API. Parameter 
`imageConfig.imageSize` tidak dipakai sama sekali, sehingga semua 
generate selalu output resolusi default 1K dari Nano Banana 2, 
apapun pilihan user.

YANG HARUS DIPERBAIKI:
Tambahkan parameter `imageConfig.imageSize` ke API call Gemini dengan 
nilai yang di-mapping dari pilihan resolusi user:
- User pilih "1K" → imageSize: "1K"
- User pilih "2K" → imageSize: "2K"  
- User pilih "4K" → imageSize: "4K"

PENTING:
- Nilai imageSize HARUS uppercase ("1K" bukan "1k") atau API reject 400
- Aspect ratio fix ke "1:1"
- Hapus teks hint resolusi dari dalam prompt string (tidak diperlukan)
- Model: gemini-3.1-flash-image-preview
- Parameter ada di dalam config.imageConfig

CONTOH STRUKTUR API CALL YANG BENAR:
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: enhancedPrompt,
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      imageSize: userResolution, // "1K" | "2K" | "4K"
      aspectRatio: "1:1",
    },
  },
});

Setelah fix, pastikan tidak ada perubahan pada logika credit deduction, 
prompt enhancer, dan response handling.
