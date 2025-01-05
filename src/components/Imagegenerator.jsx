import React, { useState } from "react";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("a scary cat");
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [seed, setSeed] = useState("5");

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl(null);

    try {
      // We send JSON to our backend. The backend will transform it into FormData for Vyro.ai
      const response = await fetch("https://text-to-image-backend-two.vercel.app/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          aspect_ratio: aspectRatio,
          seed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error generating image");
      }

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setImageUrl(localUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label className="block mb-1 text-gray-700" htmlFor="prompt">
            Prompt
          </label>
          <input
            id="prompt"
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700" htmlFor="style">
            Style
          </label>
          <input
            id="style"
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700" htmlFor="aspectRatio">
            Aspect Ratio
          </label>
          <input
            id="aspectRatio"
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700" htmlFor="seed">
            Seed
          </label>
          <input
            id="seed"
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="AI generated" className="mx-auto" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
