import { useEffect } from "react";
import Glide from "@glidejs/glide";

export default function TrendingCarousel({ data }) {
  useEffect(() => {
    new Glide(".glide", { type: "carousel", perView: 3 }).mount();
  }, []);

  return (
    <div className="glide">
      <div className="glide__track" data-glide-el="track">
        <ul className="glide__slides">
          {data.map((ai, i) => (
            <li className="glide__slide" key={i}>
              <img src={ai.iconurl} width="100%" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}