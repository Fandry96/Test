
import { GoogleGenAI } from "@google/genai";
import { VideoResolution, AspectRatio } from "../types";

export async function generateVeoVideo(
  imageBytes: string,
  mimeType: string,
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: VideoResolution,
  onProgress: (msg: string) => void
): Promise<string> {
  // Create a new instance right before the first call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onProgress("Initializing cinematic engine...");
  
  let operation;
  try {
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this photo with natural, subtle movement to bring the scene to life.',
      image: {
        imageBytes,
        mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: resolution, // Use the selected resolution
        aspectRatio: aspectRatio
      }
    });
  } catch (err: any) {
    console.error("Initial generateVideos call failed:", err);
    throw err;
  }

  const progressMessages = [
    "Analyzing visual structure...",
    "Defining motion paths...",
    "Synthesizing temporal consistency...",
    "Rendering cinematic frames...",
    "Polishing visual artifacts...",
    "Finalizing export...",
  ];

  let msgIndex = 0;
  while (!operation.done) {
    onProgress(progressMessages[msgIndex % progressMessages.length]);
    msgIndex++;
    
    // Wait for the next poll
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // CRITICAL: Create a NEW instance for each polling request to ensure up-to-date auth state
    const pollingAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      operation = await pollingAi.operations.getVideosOperation({ operation: operation });
    } catch (err: any) {
      console.error("Polling operation failed:", err);
      throw err;
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Failed to generate video: No download link provided by API.");
  }

  // The download link also needs the latest key for authentication
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Video download failed:", errorBody);
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
