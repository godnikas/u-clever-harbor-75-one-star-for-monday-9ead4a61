// One Star for Monday — make.fun bounty
// u-clever-harbor-75-one-star-for-monday-9ead4a61
//
// A one-star review of Monday, written as if Monday were a restaurant.
// The program drafts a few candidate lines of its own, scores each one
// against the judge's published brief (real diner's complaint, Monday
// specifically, short and quotable, at most 25 words), and writes the
// best line to /output/entry.txt.
//
// Node 22, standard library only. No network, no input files.

import { mkdirSync, writeFileSync } from "node:fs";

// Every candidate below is an original line written for this entry.
// Each one is a single sentence (or two short ones) of plain text:
// a diner complaining about a restaurant that happens to be Monday.
const candidates: string[] = [
  // Diner books a table for the weekend, gets seated on Monday instead.
  // Table, special, bill — and Monday named outright.
  "Booked a table for the weekend, got seated on Monday instead. The special was a 9 a.m. meeting; the bill was my whole week.",
  // Weekend special, a waiter serving a meeting as the dish, billed a week.
  "Came for the weekend special, got seated on Monday instead. The waiter served a 9 a.m. meeting and billed me for the whole week.",
  // Waiter, dish (a plate of unread emails), and a bill for the week.
  "The waiter seated me at 9 a.m., served me a plate of unread emails, then charged me for the entire week.",
  // Table wait, a shrugging waiter, and Monday saying hello.
  "Sat down at nine, still waiting for coffee at noon; the waiter shrugged and said, 'Welcome to Monday.'",
  // A cold inbox as the dish, a deadline as the course.
  "Waited forty minutes for a table, then the server brought me a cold inbox and billed me for the whole week.",
];

// The judge's brief wants a real diner's complaint: a table, a server,
// a dish or a bill that went wrong. Each kind of restaurant furniture
// present earns its own points, so a line that stacks several of them
// beats a line that leans on only one.
const dinerCategories: string[][] = [
  ["table", "seated", "reservation", "booked", "reserved"], // the table
  ["waiter", "server", "host"], // the server
  ["special", "served", "plate", "dish", "menu", "order", "coffee"], // the dish
  ["bill", "billed", "charged", "charge"], // the bill
];

function wordCount(line: string): number {
  return line.split(/\s+/).filter(Boolean).length;
}

function score(line: string): number {
  const words = wordCount(line);
  if (words > 25 || words < 5) return -1000;
  let points = 0;
  // Monday must be named: the joke has to be about Monday alone.
  if (/\bmonday\b/i.test(line)) points += 40;
  // One bonus per kind of restaurant furniture the line manages to use.
  const lower = line.toLowerCase();
  for (const category of dinerCategories) {
    if (category.some((w) => lower.includes(w))) points += 10;
  }
  // Short and quotable beats long: every word past 18 costs a point.
  points -= Math.max(0, words - 18);
  // A concrete time of day (9 a.m.) roots the complaint in a Monday.
  if (/\b9 a\.m\./.test(line)) points += 5;
  return points;
}

function passesGate(line: string): boolean {
  const text = line.trim();
  if (text.length < 1 || text.length > 180) return false;
  if (text.split("\n").length !== 1) return false;
  if (wordCount(text) > 25) return false;
  return /\S/.test(text);
}

function main(): void {
  // Rank every candidate, best first, and take the first one that
  // passes the same gate the sealed scorer applies (1-180 chars,
  // one line, at most 25 words, not only white space).
  const ranked = [...candidates].sort((a, b) => score(b) - score(a));
  const best = ranked.find(passesGate) ?? candidates[0];
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", best.trim() + "\n", "utf8");
}

main();
