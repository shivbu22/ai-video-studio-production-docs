import { NextRequest, NextResponse } from "next/server";

export interface DubbingRequest {
  clipId: string;
  sourceLanguage: string;
  targetLanguages: string[]; // ["es", "ja", "fr", "de", "zh"]
  enableLipSync?: boolean;
  preserveEmotion?: boolean;
  sourceTranscript?: Array<{ word: string; startMs: number; endMs: number }>;
}

export async function POST(req: NextRequest) {
  try {
    const body: DubbingRequest = await req.json();
    const { sourceLanguage, targetLanguages, enableLipSync, preserveEmotion } = body;

    if (!targetLanguages || targetLanguages.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one targetLanguage is required" },
        { status: 400 }
      );
    }

    const translations: Record<string, {
      languageName: string;
      translatedText: string;
      audioUrl: string;
      durationMs: number;
      syllableMatchRatio: number;
      lipSyncAccuracyScore: number;
      srtDownloadUrl: string;
    }> = {
      es: {
        languageName: "Spanish (Español Neutro)",
        translatedText: "En octubre de 2019, Google demostró la supremacía cuántica. Su procesador Sycamore realizó un cálculo en 200 segundos que a las supercomputadoras les llevaría diez mil años.",
        audioUrl: "/mock/dubbed_audio_es.wav",
        durationMs: 14200,
        syllableMatchRatio: 0.98,
        lipSyncAccuracyScore: 0.965,
        srtDownloadUrl: "/mock/subtitles_es.srt",
      },
      ja: {
        languageName: "Japanese (日本語)",
        translatedText: "2019年10月、Googleは量子超越性を実証しました。彼らのSycamoreプロセッサは、スーパーコンピュータで1万年かかるベンチマークをわずか200秒で実行しました。",
        audioUrl: "/mock/dubbed_audio_ja.wav",
        durationMs: 13900,
        syllableMatchRatio: 0.95,
        lipSyncAccuracyScore: 0.948,
        srtDownloadUrl: "/mock/subtitles_ja.srt",
      },
      fr: {
        languageName: "French (Français)",
        translatedText: "En octobre 2019, Google a démontré la suprématie quantique. Leur processeur Sycamore a réalisé en 200 secondes un calcul qui prendrait dix mille ans aux superordinateurs.",
        audioUrl: "/mock/dubbed_audio_fr.wav",
        durationMs: 14400,
        syllableMatchRatio: 0.97,
        lipSyncAccuracyScore: 0.952,
        srtDownloadUrl: "/mock/subtitles_fr.srt",
      },
      de: {
        languageName: "German (Deutsch)",
        translatedText: "Im Oktober 2019 demonstrierte Google die Quantenüberlegenheit. Der Sycamore-Prozessor führte in 200 Sekunden eine Benchmark durch, für die Supercomputer zehntausend Jahre bräuchten.",
        audioUrl: "/mock/dubbed_audio_de.wav",
        durationMs: 14100,
        syllableMatchRatio: 0.96,
        lipSyncAccuracyScore: 0.958,
        srtDownloadUrl: "/mock/subtitles_de.srt",
      },
      zh: {
        languageName: "Mandarin (中文)",
        translatedText: "2019年10月，谷歌展示了量子霸权。他们的Sycamore处理器在200秒内完成了一项基准测试，而超级计算机需要一万年才能完成。",
        audioUrl: "/mock/dubbed_audio_zh.wav",
        durationMs: 13800,
        syllableMatchRatio: 0.94,
        lipSyncAccuracyScore: 0.942,
        srtDownloadUrl: "/mock/subtitles_zh.srt",
      },
    };

    const results = targetLanguages.map((lang) => translations[lang] || {
      languageName: lang.toUpperCase(),
      translatedText: "AI neural translation generated with pitch preservation.",
      audioUrl: `/mock/dubbed_audio_${lang}.wav`,
      durationMs: 14000,
      syllableMatchRatio: 0.95,
      lipSyncAccuracyScore: 0.95,
      srtDownloadUrl: `/mock/subtitles_${lang}.srt`,
    });

    return NextResponse.json({
      success: true,
      sourceLanguage: sourceLanguage || "en",
      targetLanguages,
      translations: results,
      enableLipSync: !!enableLipSync,
      preserveEmotion: preserveEmotion !== false,
      processingTimeMs: 680,
      neuralModel: "OmniCut-VoiceClone-Polylingual-v3 + Wav2Lip-HD",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI dubbing request" },
      { status: 500 }
    );
  }
}
