const GQL_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3007/graphql";

// Backend origin where static /uploads files are served.
// PORT_API=3007 in backend .env — override with NEXT_PUBLIC_UPLOAD_URL for production.
const UPLOAD_BASE =
  process.env.NEXT_PUBLIC_UPLOAD_URL ?? "http://localhost:3007";

/**
 * Upload a single image via graphql-upload multipart format.
 * Returns the relative path returned by the server, e.g. "uploads/members/uuid.jpg"
 */
export async function uploadImage(
  file: File,
  target: "members" | "services",
  token: string
): Promise<string> {
  const operations = JSON.stringify({
    query: `
      mutation ImageUploader($file: Upload!, $target: String!) {
        imageUploader(file: $file, target: $target)
      }
    `,
    variables: { file: null, target },
  });

  const formData = new FormData();
  formData.append("operations", operations);
  formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
  formData.append("0", file);

  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: {
      "apollo-require-preflight": "true",
      "x-apollo-operation-name": "ImageUploader",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const path: string = json.data?.imageUploader;
  if (!path) throw new Error("Upload failed");
  return path;
}

/**
 * Convert a relative upload path returned by the server into a full URL.
 * If path is already a full URL, return it unchanged.
 */
export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/img/")) {
    return path;
  }
  return `${UPLOAD_BASE}/${path}`;
}

export const ALLOWED_FORMATS = "PNG, JPG, JPEG";
export const MAX_FILE_SIZE_MB = 15;
export const ALLOWED_MIME = ["image/png", "image/jpg", "image/jpeg"];
