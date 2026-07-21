import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

const RECEIPTS_PATH = "receipts";

export async function uploadReceipt(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${userId}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `${RECEIPTS_PATH}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

export async function deleteReceipt(url: string): Promise<void> {
  try {
    const path = extractPathFromUrl(url);
    if (path) {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    }
  } catch {
    // silently fail
  }
}

function extractPathFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}
