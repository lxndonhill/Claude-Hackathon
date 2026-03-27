# Hackathon Project

## Team Setup Guide

Follow these steps to get Claude Code set up on your machine.

---

## Mac Setup

### Step 1: Install Claude Code
Open Terminal (Cmd+Space → type "Terminal") and run:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Then add it to your PATH:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

Verify it worked:
```bash
claude --version
```

### Step 2: Authenticate
```bash
claude
```
This opens your browser — log in with your Claude Pro account and click Approve.

### Step 3: Clone this repo
```bash
git clone https://github.com/lxndonhill/Claude-Hackathon.git
cd Claude-Hackathon
```

### Step 4: Install the plugin
Inside Claude Code, run:
```
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

### Step 5: Install rules
Back in Terminal:
```bash
npm install
npx ecc python
```

---

## Windows (Dell) Setup

### Step 1: Install Git for Windows
Download and install from: https://git-scm.com/download/win

### Step 2: Install Node.js
Download and install from: https://nodejs.org (choose the LTS version)

### Step 3: Install Claude Code
Open PowerShell and run:
```powershell
irm https://claude.ai/install.ps1 | iex
```

### Step 4: Authenticate
```powershell
claude
```
This opens your browser — log in with your Claude Pro account and click Approve.

### Step 5: Clone this repo
```powershell
git clone <your-repo-url>
cd <your-repo-name>
```

### Step 6: Install the plugin
Inside Claude Code, run:
```
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

### Step 7: Install rules
Back in PowerShell:
```powershell
npm install
npx ecc python
```

---

## Useful Commands Once Set Up

| Command | What it does |
|---|---|
| `/plan "your idea"` | Plan a feature before building |
| `/code-review` | Review code before committing |
| `/tdd` | Test-driven development workflow |
| `/build-fix` | Fix a broken build |

---

## Project Info

**Case:** TBD — will update once revealed

**Tech Stack:** TBD

**Google Doc (notes):** [add link here]
