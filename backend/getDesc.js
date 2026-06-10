require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error("❌ Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);



async function generate() {
  const { data } = await supabase.from("ai_tools").select("*");

  for (const ai of data) {
    if (ai.enhanced_description) continue;

    console.log("Generating:", ai.name);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Write a detailed description of the AI tool "${ai.name}" in category "${ai.category}".`
          }
        ]
      })
    });

   const json = await res.json();

console.log("FULL RESPONSE:", JSON.stringify(json, null, 2));

if (!res.ok) {
  console.log("❌ API ERROR:", json);
  continue;
}

const description = json?.choices?.[0]?.message?.content;

if (!description) {
  console.log("❌ No description returned:", json);
  continue;
}
    await supabase
      .from("ai_tools")
      .update({ enhanced_description: description })
      .eq("id", ai.id);

    console.log("✅ Saved:", ai.name);
  }

  console.log("Done ✅");
}

generate();