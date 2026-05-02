import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", margin: "20px 0" }}
      data-ad-client="ca-pub-XXXXXXXXXXXX"
      data-ad-slot="YYYYYYYYYY"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}