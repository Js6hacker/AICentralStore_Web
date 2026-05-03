const API = import.meta.env.VITE_API_URL;

let cache = null;

export async function getAI() {
  try {
    if (cache) return cache;

    const res = await fetch(`${API}/ai`);

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();

    cache = data;

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    return []; 
  }
}