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
- A GitHub Personal Access Token (for increased API rate limits)

### Installation & Local Development

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/repolens.git
   cd repolens
   ```

2. **Set up the Backend:**
   ```sh
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   GITHUB_TOKEN=your_github_pat_here
   ```
   Start the backend server:
   ```sh
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*

3. **Set up the Frontend:**
   Open a new terminal and navigate to the frontend directory:
   ```sh
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_BACKEND_URL=http://localhost:5000
   ```
   Start the frontend development server:
   ```sh
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`*

---

## Usage

1. Enter a public GitHub repository URL (e.g., `https://github.com/facebook/react`).
2. Explore the structure via the graph and file tree.
3. Click files/folders for AI-powered explanations and summaries.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS v4, D3.js, Vite
- **Backend:** Node.js, Express, Octokit
- **AI:** Google Gemini API

## License

MIT
