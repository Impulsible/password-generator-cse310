# 🔐 Secure Password Generator

## CSE 310 – Applied Programming | Module 2: JavaScript

**Author:** Osuagwu Prince Henry  
**Date:** 3/20/2026  
**Instructor:** CSE 310 Faculty  
**University:** Arizona State University

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Code Structure](#code-structure)
- [Testing](#testing)
- [Time Log](#time-log)
- [Challenges & Solutions](#challenges--solutions)
- [Video Demo](#video-demo)
- [GitHub Repository](#github-repository)
- [License](#license)

---

## Project Overview

This project is a **command-line password generator** built with JavaScript and Node.js as part of CSE 310 Module 2. The tool generates cryptographically secure passwords based on user preferences, ensuring strong randomness using Node.js's built-in `crypto` module rather than `Math.random()`.

### Why This Project?

Passwords are the first line of defense in cybersecurity. Many people use weak, predictable passwords. This tool helps users create strong, customized passwords that are resistant to brute-force attacks and dictionary attacks.

### Problem Solved

- ❌ People use short, simple passwords
- ❌ People reuse the same password across sites
- ❌ Online password generators may log or steal passwords
- ✅ Local, offline password generator with true randomness
- ✅ Customizable to meet different website requirements

---

## Features

### Core Features (All Implemented)

| Feature            | Status | Description                                       |
| ------------------ | ------ | ------------------------------------------------- |
| Password Length    | ✅     | 8-32 characters, user-specified                   |
| Uppercase Letters  | ✅     | A-Z inclusion option                              |
| Lowercase Letters  | ✅     | a-z inclusion option                              |
| Numbers            | ✅     | 0-9 inclusion option                              |
| Special Characters | ✅     | ! @ # $ % ^ & \* inclusion option                 |
| Multiple Passwords | ✅     | Generate 1-10 passwords at once                   |
| File Saving        | ✅     | Save passwords to formatted text file             |
| Input Validation   | ✅     | Prevents invalid configurations                   |
| Strength Guarantee | ✅     | Ensures at least one char from each selected type |
| Help Menu          | ✅     | Usage instructions and tips                       |

### Advanced Features

- **Cryptographic Randomness**: Uses `crypto.randomBytes()` instead of `Math.random()`
- **Password Strength Rating**: Automatically rates passwords (Weak → Very Strong)
- **Session History**: Tracks all passwords generated in a session
- **File Backup**: Creates backup before overwriting password files
- **Performance Metrics**: Shows generation time for each batch
- **Comprehensive Error Handling**: Graceful handling of edge cases

---

## Technology Stack

### Runtime Environment

Node.js v18.0.0 or higher
npm v9.0.0 or higher

text

### Dependencies

| Package          | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| readline-sync    | ^1.4.10 | Synchronous user input handling |
| chalk (optional) | ^5.3.0  | Colored terminal output         |

### Built-in Node.js Modules Used

| Module   | Purpose                                    |
| -------- | ------------------------------------------ |
| `crypto` | Cryptographically secure random generation |
| `fs`     | File system operations (read/write files)  |
| `path`   | Cross-platform path handling               |

### Development Tools

- **VS Code** - Primary IDE
- **Git** - Version control
- **GitHub** - Code repository

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check Node.js version (requires v18+)
node --version

# Check npm version
npm --version
If Node.js is not installed, download it from: https://nodejs.org/ (LTS version)
```
