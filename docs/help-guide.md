# Student Lab Guide

Welcome to **os-uce**! This platform is an interactive study companion and terminal simulator designed to prepare you for the Operating Systems Lab exam.

---

## Mobile vs. Laptop Layouts

The application adapts dynamically to your screen size:
- **Laptop/Desktop Layout**: Displays side-by-side panels. The left sidebar contains the syllabus topics, the center panel displays these notes, and the right panel holds your editor and terminal workspace.
- **Mobile Phone Layout**: Use the bottom tabs to toggle views:
  - **Notes**: Read concept guides and C code.
  - **Terminal**: Open Gedit, compile, and run programs.
  - **Topics Button (Header)**: Tap to slide open the menu and change topics.

---

## Lab Workflow

To complete any experiment, follow this step-by-step cycle:
1. **Choose a Topic**: Select a program from the left sidebar (e.g. *Basic fork()*).
2. **Learn the Concept**: Read the notes here. Use the inline hyperlinks to jump to specific lines of code or check [C Syntaxes](#syntax-loops) for grammar references.
3. **Open Gedit**: Type `gedit <filename>.c` in the terminal to open the editor.
4. **Edit the Code**: Make modifications as requested by your instructor. Gedit will show an asterisk (`*`) next to the filename indicating unsaved changes.
5. **Save File**: Click the **Save** button in the Gedit window (or type `Ctrl+S`).
6. **Compile & Run**: Use the Compile button in the code block to compile and run the program.

---

## Linux Shell Commands

The interactive console simulates a real Ubuntu terminal. You can run these commands:
*   `ls` — List all files on the virtual disk. Binaries (like `a`) appear in green.
*   `gedit <filename>.c` — Open or create a file in the text editor.
*   `cat <filename>` — Print a file's contents inside the terminal log.
*   `rm <filename>` — Delete a file from the virtual disk.
*   `name <new_name>` — Change your shell prompt username dynamically (e.g. `name resmi`).
*   `clear` — Clear the terminal screen.
*   `help` — Review available commands.

---

## Compiler Messages

The platform includes a simulated static analyzer that replicates standard compiler reports:
- **Red Messages (Errors)**: Compilation failed. These identify fatal syntax mistakes, such as missing semicolons (`;`) or mismatched brackets. Correct these in Gedit, save, and compile again.
- **Yellow Messages (Warnings)**: Compilation succeeded, but with code smell or potential bugs. These identify implicit declaration warnings (e.g. forgetting `#include <unistd.h>` when using `fork()`) or uninitialized variables.