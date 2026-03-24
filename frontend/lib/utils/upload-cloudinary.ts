import { SelectedMedia } from "@/types";

export async function uploadToCloudinary(
  media: SelectedMedia,
  token: string,
  baseUrl: string,
  onProgress: (percent: number) => void,
) {
  // 1️⃣ Get signature from backend
  const signatureResponse = await fetch(`${baseUrl}/signature`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!signatureResponse.ok) {
    throw new Error("Failed to generate upload signature");
  }

  const signatureData = await signatureResponse.json();

  const resourceType = media.type === "video" ? "video" : "image";
  const formData = new FormData();

  formData.append("file", {
    uri: media.uri,
    type: media.mimeType,
    name: media.fileName,
  } as unknown as Blob);

  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp.toString());
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  // 2️⃣ Use XMLHttpRequest for progress
  return new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.response);
          resolve({ url: data.secure_url });
        } else {
          try {
            const err = JSON.parse(xhr.response);
            reject(
              new Error(err?.error?.message ?? "Cloudinary upload failed"),
            );
          } catch {
            reject(new Error("Cloudinary upload failed"));
          }
        }
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
    );
    xhr.send(formData);
  });
}
