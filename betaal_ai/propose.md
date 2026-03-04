# How Our Custom Interruption AI Works (For Judges)

When pitching Betaal AI, the judges will want to know *how* our custom model works. This document breaks down the machine learning pipeline in simple terms so you can confidently explain the architecture.

## 1. The Core Concept
Instead of a static "app blocked" screen, our AI acts as an adaptive digital rehab coach. We built and trained a custom Machine Learning model that calculates exactly *when* to interrupt the user and *how annoying* that interruption should be, based on their real-time behavior.

## 2. The Data (What the AI Learns From)
Because real-world addiction data is highly protected, we generated a robust synthetic dataset modeled after Gen Z screen time statistics. 

We feed the model four key **Inputs (Features)**:
1.  **Daily Limit:** How many minutes the user is allowed today.
2.  **Total Usage Today:** How much time they've already burned.
3.  **Current Session:** How long they've been staring at the screen in this exact sitting.
4.  **Addiction Level:** A baseline score (1-10) of the user's dependency.

## 3. The Brain (The Algorithm)
We use a **Random Forest** architecture. Think of it like a massive flowchart of decision trees voting on the best outcome. We chose this because it is lightning-fast, highly accurate for behavioral thresholds, and lightweight enough to run without requiring massive cloud compute.

It makes two simultaneous predictions **(The Targets)**:
* **Regression:** Predicts the `next_interval` (e.g., "interrupt them in 4 minutes").
* **Classification:** Predicts the `interruption_type` (e.g., "Type 7: Shrink Screen").

## 4. The Output (The Schedule)
The backend takes these predictions and constructs a session array dynamically. 
If a user starts doomscrolling, the AI generates a sequence like this:
`[ [10, "blur_screen"], [5, "reverse_scroll"], [2, "grayscale_filter"] ]`

As the session goes on, the intervals get shorter, and the interruptions get more aggressive. 

## 5. The Safety Net (Plan B)
We built this system for resilience. If the AI model ever fails to load, the backend instantly detects the fault and shifts to a pure mathematical curve (a sigmoid function) to calculate the schedule. The frontend never crashes, and the user never escapes the rehab protocol.