const API = "https://ai-central-store.vercel.app";

export const getAI = async () => {
  const res = await fetch(`${API}/ai`);
  return res.json();
};