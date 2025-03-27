"use client";

import { useState } from "react";

/**
 * AIAnalysisPage provides a text area for users to input a journal entry,
 * and an "Analyze" button that calls the AI analysis API.
 * The page then displays sentiment, key themes, and writing suggestions.
 */
export default function AIAnalysisPage() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<{
    sentiment?: string;
    themes?: string[];
    suggestions?: string[];
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError("");
    setAnalysis(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
            <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">AI Journal Analysis</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your journal entry here..."
                className="w-full p-3 border rounded h-40 mb-4"
            />
            <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                {loading ? "Analyzing..." : "Analyze Entry"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {analysis && (
                <div className="mt-6 border p-4 rounded">
                    <h2 className="text-2xl font-semibold mb-2">Analysis Results</h2>
                    <p>
                        <strong>Sentiment:</strong> {analysis.sentiment}
                    </p>
                    <div className="mt-2">
                        <strong>Themes:</strong>
                        {analysis.themes && analysis.themes.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {analysis.themes.map((theme, index) => (
                            <li key={index}>{theme}</li>
                            ))}
                        </ul>
                        ) : (
                        <p>None detected.</p>
                        )}
                    </div>
                    <div className="mt-2">
                        <strong>Writing Suggestions:</strong>
                        {analysis.suggestions && analysis.suggestions.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                        ) : (
                        <p>No suggestions available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>
    </section>
  );
}
