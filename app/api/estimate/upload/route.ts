import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

// Sibling of /api/contact/upload — same purpose (Vercel Blob client-upload
// token), same constraints, separate path so BotID can rate-limit each
// funnel independently and so the route name reflects the funnel it serves.
//
// Files land in the same Blob bucket; the form prefixes paths with `estimate/`
// so the two funnels stay separable in the bucket listing.

export async function POST(request: Request): Promise<NextResponse> {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
        ],
        access: "public",
        addRandomSuffix: true,
        maximumSizeInBytes: 10 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Intentional no-op — the form submission carries the URL forward.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload failed" },
      { status: 400 },
    );
  }
}
