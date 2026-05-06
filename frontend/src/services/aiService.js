import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
	apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
});

/**
 * Safely parses AI JSON responses.
 * Handles cases where Gemini wraps JSON in markdown code blocks.
 */
function safeJsonParse(text) {
	try {
		return JSON.parse(text);
	} catch {
		const cleaned = text
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		return JSON.parse(cleaned);
	}
}

export const aiService = {
	/**
	 * Analyze complete repository structure
	 */
	async analyzeRepo(
		owner,
		repo,
		structure,
	) {
		const fileList = structure.map((f) => f.path).join("\n");

		const prompt = `
Analyze this GitHub repository structure for ${owner}/${repo}.

FILES:
${fileList}

Generate a highly technical repository analysis.

Return ONLY valid JSON.

Requirements:
1. overview → A concise 2-sentence project summary.
2. techStack → Array of languages/frameworks/tools detected.
3. architecture → Explain architecture and folder organization.
4. keyFiles → Most important files and why they matter.
5. howItWorks → Step-by-step internal execution flow.
`;

		try {
			const response = await ai.models.generateContent({
				model: "gemini-3-flash-preview",
				contents: prompt,
				generationConfig: {
					responseMimeType: "application/json",
					responseSchema: {
						type: Type.OBJECT,
						properties: {
							overview: {
								type: Type.STRING,
							},

							techStack: {
								type: Type.ARRAY,
								items: {
									type: Type.STRING,
								},
							},

							architecture: {
								type: Type.STRING,
							},

							keyFiles: {
								type: Type.ARRAY,
								items: {
									type: Type.OBJECT,
									properties: {
										file: {
											type: Type.STRING,
										},
										reason: {
											type: Type.STRING,
										},
									},
									required: ["file", "reason"],
								},
							},

							howItWorks: {
								type: Type.STRING,
							},
						},

						required: [
							"overview",
							"techStack",
							"architecture",
							"keyFiles",
							"howItWorks",
						],
					},
				},
			});

			return safeJsonParse(response.text);
		} catch (error) {
			console.error("Repository analysis failed:", error);
			throw new Error("Failed to analyze repository");
		}
	},

	/**
	 * Analyze single source file
	 */
	async analyzeFile(
		fileName,
		content,
	) {
		const prompt = `
EXHAUSTIVE TECHNICAL AUDIT REQUEST: ${fileName}

Analyze the provided source code and generate a deep technical explanation.

CODE:
${content.substring(0, 12000)}

Return ONLY valid JSON.

Required fields:
1. summary
2. purpose
3. complexity
4. detailedExplanation

DetailedExplanation must:
- Include "Logic & Flow"
- Include "Pattern Recognition"
- Explain major functions/classes
- Mention performance concerns
- Mention technical debt
- Use markdown formatting
`;

		try {
			const response = await ai.models.generateContent({
				model: "gemini-3-flash-preview",
				contents: prompt,

				generationConfig: {
					responseMimeType: "application/json",

					responseSchema: {
						type: Type.OBJECT,

						properties: {
							summary: {
								type: Type.STRING,
							},

							purpose: {
								type: Type.STRING,
							},

							complexity: {
								type: Type.STRING,
								enum: ["Low", "Medium", "High"],
							},

							detailedExplanation: {
								type: Type.STRING,
							},
						},

						required: [
							"summary",
							"purpose",
							"complexity",
							"detailedExplanation",
						],
					},
				},
			});

			return safeJsonParse(response.text);
		} catch (error) {
			console.error("File analysis failed:", error);
			throw new Error("Failed to analyze file");
		}
	},
};
