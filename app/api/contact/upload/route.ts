import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

// Issues a one-shot Vercel Blob client-upload token. The browser uploads the
// damage photo directly to Blob storage and posts the resulting URL with the
// rest of the form. Server actions can't carry 100MB of files; client uploads
// can. BotID guards token issuance so scrapers can't burn our quota.
//
// Access is `public` so Serge can open photos directly from his email. Random
// suffix on the pathname keeps URLs unguessable.

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
