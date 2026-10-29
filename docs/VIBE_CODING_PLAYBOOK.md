# VIBE CODING PLAYBOOK: How We Build Together

> **For the Creator**: A simple, no-stress guide to directing this project without touching any code.

---

## 🎨 What is "Vibe Coding"?

Vibe coding means **you are the Creative Director and Product Owner**, while **I (Antigravity AI) am your Senior Engineering Team**.

* You describe what you want the app to look like, how it should feel, what features it needs, and what bugs you notice.
* You never write code, copy-paste terminal syntax, or debug errors.
* I handle all architecture, file structures, API integrations, database schemas, styling, and terminal commands.

---

## 🤝 How Our Collaboration Works

### 1. You Give Natural Language Direction
Instead of technical instructions, describe the "vibe", user experience, or outcome:
* *"I want the image generation page to feel darker, sleeker, like a modern creative tool like Linear or Runway."*
* *"When I click Generate, can we have a cool glowing animation around the button?"*
* *"The credit counter should pulse green whenever credits are refunded."*
* *"Let's build Phase 2 now."*

### 2. I Run the Technical Pipeline
Whenever you ask for a feature:
1. I check our living docs (`docs/PROJECT_PLAN.md` and `docs/PHASES_ROADMAP.md`).
2. I write and test the code end-to-end.
3. I start the local servers so you can test it directly in your browser.
4. I report back in plain English: what was built, what screen to open, and what to try.

### 3. You Test in Your Browser & Give Feedback
* You open `http://localhost:3000` (or the URL I provide).
* You click around, test the inputs, and see how it feels.
* You tell me: *"I love the layout, but the style buttons are too small on my screen"* or *"When I generated an image, it was super fast! Let's now add 4x upscaling."*

---

## 📖 Plain-English Glossary of Key Terms

| Technical Term | What it Means in Plain English |
| :--- | :--- |
| **Frontend (`apps/web`)** | The visual website you see, click, and interact with in your browser. |
| **Backend API (`services/api`)** | The invisible engine behind the scenes that talks to the database and verifies your account. |
| **Database (PostgreSQL)** | The digital filing cabinet that safely stores your user account, credit balance, and generation history. |
| **Job Queue (Redis)** | The waiting room where generation requests sit in order so your computer doesn't freeze when 5 things generate at once. |
| **Hosted AI APIs** | Pre-built AI services from Google Cloud (like Imagen or Gemini) that we can call instantly without running a huge computer. |
| **GPU Worker** | A heavy-duty rented computer with massive graphics cards (NVIDIA) where open-source AI models (like FLUX or Wan) run. |
| **Two-Phase Credit Ledger** | A safe banking system: it holds your credits when you click Generate, and only takes them if the generation succeeds. If it fails, you get them back instantly. |

---

## 🧭 Your Simple Steering Commands

You can use these plain-English commands anytime:

* **"Show me our progress"**: I will summarize what phases are done and what's next.
* **"Let's move to Phase [X]"**: I will start building the next phase step by step.
* **"I want to change the design/vibe of [Page]"**: Tell me your aesthetic vision, and I'll restyle it.
* **"Explain how [Feature] works"**: I will give you a plain-English, non-technical explanation.
