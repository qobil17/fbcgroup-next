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
  target: "members" | "services" | "projects" | "partners",
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

  if (res.status === 413) throw new Error(`Rasm hajmi ${MAX_FILE_SIZE_MB} MB dan oshmasligi kerak`);
  const json = await res.json().catch(() => ({ errors: [{ message: "Server javobini o'qib bo'lmadi" }] }));
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

// Backend (apps/fbcgroup-api/src/libs/image.ts) bilan bir xil qoidalar.
// Server rasmni o'zi siqadi (WebP, uzun tomoni 2400px gacha) — sifat ko'zga sezilarli o'zgarmaydi.
export const ALLOWED_FORMATS = "JPG, PNG, WEBP";
export const MAX_FILE_SIZE_MB = 15;
export const ALLOWED_MIME = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
export const ACCEPT_ATTR = "image/png,image/jpeg,image/webp";

/** Faylni yuborishdan oldin tekshiradi; muammo bo'lsa o'zbekcha xabar qaytaradi. */
export function validateImageFile(file: File): string | null {
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
    return `${file.name}: iPhone HEIC formati qabul qilinmaydi. Rasmni JPG qilib saqlang (iPhone: Sozlamalar → Kamera → Formatlar → "Eng mos").`;
  }
  if (!ALLOWED_MIME.includes(file.type)) return `${file.name}: faqat ${ALLOWED_FORMATS} formatlar qabul qilinadi`;
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `${file.name}: hajmi ${(file.size / 1048576).toFixed(1)} MB — ${MAX_FILE_SIZE_MB} MB dan oshmasligi kerak`;
  }
  return null;
}

/** Bir nechta rasmni ketma-ket yuklaydi; har biridan keyin onProgress chaqiriladi. */
export async function uploadImages(
  files: File[],
  target: "members" | "services" | "projects" | "partners",
  token: string,
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  for (const f of files) {
    const err = validateImageFile(f);
    if (err) throw new Error(err);
  }
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    try {
      urls.push(await uploadImage(f, target, token));
    } catch (e: any) {
      throw new Error(`${f.name}: ${e.message}`);
    }
    onProgress?.(i + 1, files.length);
  }
  return urls;
}
