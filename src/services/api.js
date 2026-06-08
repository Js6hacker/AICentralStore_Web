const API = import.meta.env.VITE_API_URL;

let cache = null;

export async function getAI() {
  try {
    let apiData = [];
    if (cache) {
      apiData = cache;
    } else {
      const res = await fetch(`${API}/ai`);
      if (res.ok) {
        apiData = await res.json();
      } else {
        console.warn("API returned non-ok status, using local fallback");
      }
    }

    // Retrieve locally submitted tools
    const localAdded = JSON.parse(localStorage.getItem("added_tools") || "[]");
    const combined = [...localAdded, ...apiData];

    // Deduplicate by name
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      const nameKey = item.name?.toLowerCase().trim();
      if (nameKey && !seen.has(nameKey)) {
        seen.add(nameKey);
        unique.push(item);
      }
    }

    cache = unique;
    return unique;
  } catch (err) {
    console.error("API ERROR:", err);
    const localAdded = JSON.parse(localStorage.getItem("added_tools") || "[]");
    return localAdded;
  }
}

export async function submitAI(form) {
  try {
    // Generate a unique ID if not present
    const tool = {
      id: Date.now(),
      popularity: 0,
      enhanced_description: null,
      ...form
    };

    // Try to post to server
    try {
      await fetch(`${API}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tool)
      });
    } catch (e) {
      console.warn("Could not post to server, saving locally:", e);
    }

    // Save locally
    const localAdded = JSON.parse(localStorage.getItem("added_tools") || "[]");
    localAdded.unshift(tool);
    localStorage.setItem("added_tools", JSON.stringify(localAdded));

    // Clear cache to trigger re-fetch/re-merge
    cache = null;
    return true;
  } catch (err) {
    console.error("Failed to submit tool:", err);
    return false;
  }
}