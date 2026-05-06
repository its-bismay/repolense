<h1 align="center">RepoLens</h1>

**RepoLens** is an interactive GitHub repository visualizer and AI-powered code explainer. It helps you explore, analyze, and understand any public GitHub repository using a force-directed graph, interactive file tree, and AI-generated explanations for the project and its files.

---

## Features

- **Visualize Repository Structure:** See the entire file/folder structure as an interactive force-directed graph and file tree.
- **AI-Powered Analysis:** Get high-level overviews, tech stack, architecture, and key file explanations using Google Gemini AI.
- **File Summaries:** Click any file to get a detailed, AI-generated summary and explanation.
- **GitHub Integration:** Fetches real-time data (stars, forks, license, etc.) for any public repo.
- **Modern UI:** Built with React, Tailwind CSS, D3.js, and Vite for a fast, responsive experience.

---

## Getting Started (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation & Local Development

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/repolens.git
   cd repolens
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a file named `.env.local` in the project root.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage

1. Enter a public GitHub repository URL (e.g., `https://github.com/facebook/react`).
2. Explore the structure via the graph and file tree.
3. Click files/folders for AI-powered explanations and summaries.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, D3.js
- **Backend:** Express, Vite
- **AI:** Google Gemini API

---

## License

MIT
