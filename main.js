/* =========================================================
   CONSTANTS & UTILITIES
   ========================================================= */

const STORAGE_PREFIX = "nightCutApp_";
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const oneDayMs = 24 * 60 * 60 * 1000;
const RING_RADIUS = 32;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDateHuman(d) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function parseHourFromTime(timeStr) {
  if (!timeStr) return 12;
  if (timeStr.startsWith("All")) return 12; // treat "All‑day" as mid‑day
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  return isNaN(h) ? 12 : h;
}

function getTimeBlockForTime(str) {
  const h = parseHourFromTime(str);
  if (h < 12) return "morning";
  if (h < 18) return "midday";
  return "evening";
}

/* =========================================================
   PLAN DATA (with gym flag & macros rough)
   ========================================================= */

const weeklyPlan = {
  Monday: {
    type: "PUSH DAY",
    goal: "Chest, shoulders, triceps",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + Ginseng‑Multi", gym: false },
      { time: "07:00", label: "Breakfast: Enkulal wät / firfir (3 eggs with onion, berbere, tomato) on 1 large teff injera + ½ avocado + 1 banana (≈40 g P, 60 g C, 20 g F).", gym: false },
      { time: "12:00", label: "Lunch: 1 large injera + 200 g beef tibs or sega wät (lean) + tomato‑cucumber salad (1 tbsp olive oil) (≈50 g P, 80 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: 200 g Greek yogurt, 15 g walnuts, 1 orange (≈15 g P, 25 g C, 10 g F).", gym: false },
      { time: "18:00", label: "Pre‑workout: 1 black buna (no sugar) + 250 ml water", gym: true },
      { time: "18:20", label: "Gym warm‑up: 5–10 min light cardio + shoulder mobility", gym: true },
      { time: "18:30", label: "Bench Press 4×6–8 (2–3 min rest, heavy push)", gym: true },
      { time: "18:40", label: "Overhead Press 3×8–10", gym: true },
      { time: "18:50", label: "Incline Push‑Ups 3×10–12 (weighted backpack if possible)", gym: true },
      { time: "19:00", label: "Lateral Raises 3×12–15", gym: true },
      { time: "19:10", label: "Tricep Dips 3×8–12", gym: true },
      { time: "19:20", label: "Plank 3×60 s", gym: true },
      { time: "19:30", label: "Shoulder prehab: band external rotations or face‑pull variation 2×15", gym: true },
      { time: "20:15", label: "Post‑workout: Creatine 5 g, Whey 30 g + 300 ml water", gym: true },
      { time: "20:45", label: "Dinner: 200 g grilled Nile perch or fish tibs + 200 g roasted sweet potato + 1 cup gomen (≈50 g P, 60 g C, 15 g F).", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water + phone airplane mode", gym: false }
    ]
  },
  Tuesday: {
    type: "PULL DAY",
    goal: "Back, biceps",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + Ginseng‑Multi", gym: false },
      { time: "07:00", label: "Breakfast: 60 g oats cooked + 15 g whey, 1 tbsp peanut butter, 1 sliced mango (≈40 g P, 60 g C, 20 g F).", gym: false },
      { time: "12:00", label: "Lunch: 1 large injera + ≈200 g chicken in one of: doro wät (skinless pieces), chicken tibs, or gomen besiga (chicken + greens) + cabbage‑carrot atkilt (≈45 g P, 75 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: 50 g kolo (roasted barley) + 1 guava (≈15 g P, 25 g C, 10 g F).", gym: false },
      { time: "18:00", label: "Pre‑workout: 1 black buna + 250 ml water", gym: true },
      { time: "18:20", label: "Gym warm‑up: 5–10 min walking + hip/hamstring mobility", gym: true },
      { time: "18:30", label: "Deadlift 4×4–6 (heavy; 2–3 min rest)", gym: true },
      { time: "18:45", label: "Pull‑Ups 4×6–10 (band assist if needed)", gym: true },
      { time: "18:55", label: "Barbell Rows 3×8–10", gym: true },
      { time: "19:05", label: "Face Pulls 3×12–15 (band or cable)", gym: true },
      { time: "19:15", label: "Dumbbell Curls 3×10–12", gym: true },
      { time: "19:25", label: "Hammer Curls 3×10–12", gym: true },
      { time: "19:35", label: "Core: Side Plank 2×30 s each side", gym: true },
      { time: "20:15", label: "Post‑workout: Creatine 5 g, Whey 30 g", gym: true },
      { time: "20:45", label: "Dinner: 3 scrambled eggs + 100 g egg whites as enkulal wät + 50 g dry quinoa (cooked) + grilled tomatoes & green peppers (≈45 g P, 60 g C, 15 g F).", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  },
  Wednesday: {
    type: "LEGS – VEGAN",
    goal: "Quads, hamstrings, glutes",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + B12 1000 µg (sublingual)", gym: false },
      { time: "07:00", label: "Breakfast: Ful 200 g with 1 large injera + 1 tbsp flaxseed oil + 1 papaya (≈30 g P, 70 g C, 22 g F).", gym: false },
      { time: "12:00", label: "Lunch: 1 large injera + 150 g of one vegan wät: shiro, misir wät, or kik alicha + spinach salad (1 tsp olive oil) (≈25 g P, 80 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: 50 g roasted chickpeas + 1 orange (≈10 g P, 30 g C, 8 g F).", gym: false },
      { time: "18:00", label: "Pre‑workout: 1 black buna + 250 ml water", gym: true },
      { time: "18:20", label: "Gym warm‑up: 5–10 min light cardio + dynamic leg swings", gym: true },
      { time: "18:30", label: "Back Squat 4×6–8", gym: true },
      { time: "18:45", label: "Romanian Deadlift 3×8–10", gym: true },
      { time: "18:55", label: "Walking Lunges 3×12 each leg (use load if available)", gym: true },
      { time: "19:05", label: "Glute Bridges 4×15–20 (add weight if possible)", gym: true },
      { time: "19:15", label: "Wall Sit 3×45 s", gym: true },
      { time: "19:25", label: "Core: Plank or dead bug 2–3 sets", gym: true },
      { time: "20:15", label: "Post‑workout: Creatine 5 g, Plant protein 30 g", gym: true },
      { time: "20:45", label: "Dinner: 1 medium sweet potato (~150 g) + 150 g misir wät or kik alicha + steamed kale/gomen (≈20 g P, 60 g C, 12 g F).", gym: false },
      { time: "21:30", label: "Optional: extra 15–20 g plant protein to reach ≥140–150 g protein today", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  },
  Thursday: {
    type: "UPPER VOLUME",
    goal: "Pump, endurance",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + Ginseng‑Multi", gym: false },
      { time: "07:00", label: "Breakfast: Same as Monday – enkulal wät / firfir on 1 large injera + ½ avocado + 1 banana (≈40 g P, 60 g C, 20 g F).", gym: false },
      { time: "12:00", label: "Lunch: Same structure as Tuesday – 1 large injera + ≈200 g chicken (doro wät / chicken tibs / gomen besiga) + vegetables (≈45 g P, 75 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: Same as Monday – Greek yogurt, walnuts, orange (≈15 g P, 25 g C, 10 g F).", gym: false },
      { time: "18:00", label: "Pre‑workout: 1 black buna + 250 ml water", gym: true },
      { time: "18:20", label: "Warm‑up: 5–10 min easy cardio + push‑up and band warm‑up", gym: true },
      { time: "18:30", label: "Push‑Ups 4×15–20 (weighted backpack if possible)", gym: true },
      { time: "18:40", label: "Pull‑Ups 4×8–12 (AMRAP; band if needed)", gym: true },
      { time: "18:50", label: "Pike Push‑Ups 3×10–15", gym: true },
      { time: "19:00", label: "Inverted Rows 3×12–15 (under table or low bar)", gym: true },
      { time: "19:10", label: "Plank 3×60 s", gym: true },
      { time: "19:20", label: "Shoulder prehab: band external rotations 2×15", gym: true },
      { time: "20:15", label: "Post‑workout: Creatine 5 g, Whey 30 g", gym: true },
      { time: "20:45", label: "Dinner: Same as Monday – fish (or fish tibs) + sweet potato + gomen (≈50 g P, 60 g C, 15 g F).", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  },
  Friday: {
    type: "LOWER – VEGAN",
    goal: "Glutes, hamstrings",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + B12 1000 µg", gym: false },
      { time: "07:00", label: "Breakfast: Same as Wednesday – ful 200 g with 1 large injera + flaxseed oil + fruit (≈30 g P, 70 g C, 22 g F).", gym: false },
      { time: "12:00", label: "Lunch: 1 large injera + 150 g of one vegan wät: shiro, misir wät, or kik alicha + salad or gomen (≈25 g P, 80 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: 50 g roasted chickpeas + 1 orange (≈10 g P, 30 g C, 8 g F).", gym: false },
      { time: "18:00", label: "Pre‑workout: 1 black buna + 250 ml water", gym: true },
      { time: "18:20", label: "Warm‑up: 5–10 min walk + hip/glute mobility", gym: true },
      { time: "18:30", label: "Bulgarian Split Squats 4×10–12 each leg", gym: true },
      { time: "18:45", label: "Step‑Ups 3×12–15 each leg", gym: true },
      { time: "18:55", label: "Glute Bridges 4×15–20", gym: true },
      { time: "19:05", label: "Side Lunges 3×10 each leg", gym: true },
      { time: "19:15", label: "Wall Sit 3×45 s", gym: true },
      { time: "19:25", label: "Core: Plank 2–3 sets", gym: true },
      { time: "20:15", label: "Post‑workout: Creatine 5 g, Plant protein 30 g", gym: true },
      { time: "20:45", label: "Dinner: 1 medium sweet potato + 150 g misir wät / shiro / kik alicha + steamed kale or gomen (≈20 g P, 60 g C, 12 g F).", gym: false },
      { time: "21:30", label: "Optional: extra 15–20 g plant protein to reach ≥140–150 g protein today", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  },
  Saturday: {
    type: "ACTIVE RECOVERY",
    goal: "Mobility, light movement",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + Ginseng‑Multi", gym: false },
      { time: "07:00", label: "Breakfast: Enkulal wät from 2 eggs on 1 injera + 1 banana (≈30 g P, 50 g C, 15 g F).", gym: false },
      { time: "12:00", label: "Lunch: 1 large injera + 150 g chicken tibs or sega wät (lean) + big salad (≈40 g P, 60 g C, 15 g F).", gym: false },
      { time: "15:00", label: "Snack: 50 g kolo + 1 guava (≈10 g P, 35 g C, 8 g F).", gym: false },
      { time: "18:00", label: "Yoga / mobility 20–30 min – YouTube: “Yoga With Adriene – Athlete Recovery”", gym: true },
      { time: "20:15", label: "Light dinner: small portion of any lean protein wät (fish, chicken, lentil) + vegetables + small carbs (injera piece, potato or rice) (≈30 g P, 40 g C, 10 g F, flexible).", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  },
  Sunday: {
    type: "REST / MEAL PREP",
    goal: "Recovery, organization",
    checklist: [
      { time: "06:00", label: "500 ml water + D3 2000 IU + Ginseng‑Multi", gym: false },
      { time: "07:00", label: "Breakfast: Ful 200 g + 1 injera + ½ avocado (≈25 g P, 60 g C, 20 g F).", gym: false },
      { time: "09:00", label: "Meal prep: bake injera; grill ~800 g chicken/beef for doro wät / tibs; cook big pots of shiro, misir wät and/or kik alicha; cook gomen or atkilt; roast 300 g barley (kolo); chop vegetables", gym: false },
      { time: "12:00", label: "Lunch: 1 injera with any combo of your prepped wät (one protein + one legume/veg) (≈35 g P, 70 g C, 15 g F, depends on mix).", gym: false },
      { time: "15:00", label: "Snack: 1 mango + 15 g almonds (≈5 g P, 30 g C, 10 g F).", gym: false },
      { time: "18:00", label: "Light walk ≈ 5,000+ steps around neighborhood", gym: false },
      { time: "20:00", label: "Dinner: 150 g fish or fish tibs + quinoa + spinach or gomen (≈35 g P, 50 g C, 10 g F).", gym: false },
      { time: "All‑day", label: "7,000–10,000 steps (walks between meals / to gym / errands)", gym: false },
      { time: "22:00", label: "Bed: Zinc 10 mg + 500 ml water", gym: false }
    ]
  }
};

/* =========================================================
   GROCERY DATA
   ========================================================= */

const groceryData = {
  local: [
    { id: "teff", name: "Teff flour or ready‑made injera", qty: "≈14 large injera or 1.2–1.5 kg teff flour", note: "Base for most meals (Mon–Sun)." },
    { id: "eggs", name: "Eggs", qty: "≈20 eggs", note: "Firfir/enkulal breakfasts and protein dinners." },
    { id: "chicken", name: "Chicken (breast or lean pieces for doro wät / tibs)", qty: "≈1.5–2.0 kg", note: "Lunches Tue/Thu/Sat + extra portions from meal prep." },
    { id: "beef", name: "Lean beef for sega wät / tibs", qty: "≈1.0–1.2 kg", note: "Mon lunch + extra meals if desired." },
    { id: "fish", name: "Fish (Nile perch or local white fish)", qty: "≈0.8–1.0 kg", note: "Mon/Thu/Sun dinners." },
    { id: "fava", name: "Dry fava beans (for ful)", qty: "≈400 g dry", note: "Wed/Fri/Sun breakfasts." },
    { id: "lentils", name: "Red lentils (misir)", qty: "≈500 g dry", note: "Vegan dinners & misir wät." },
    { id: "peas", name: "Yellow split peas (kik alicha)", qty: "≈300 g dry", note: "Vegan lunch/dinner option." },
    { id: "chickpeas", name: "Chickpeas / shiro flour", qty: "≈500 g total", note: "Shiro wät and roasted chickpea snacks." },
    { id: "barley", name: "Barley (for kolo)", qty: "≈350–400 g", note: "Snacks several days per week." },
    { id: "spices", name: "Onions, garlic, ginger, tomatoes, berbere, niter kibbeh/spice mix", qty: "Enough for all wät (buy in bulk)", note: "Base flavor for almost every stew." },
    { id: "leafy", name: "Spinach, kale, collard greens (gomen)", qty: "≈7–8 bunches", note: "Sides with fish, vegan dinners, lunches." },
    { id: "atkilt", name: "Cabbage + carrots + potatoes (atkilt)", qty: "1 medium cabbage + 6–8 carrots + 4 potatoes", note: "Tue lunch and extra sides." },
    { id: "saladVeg", name: "Tomatoes, cucumbers, green peppers, lettuce", qty: "≈10 tomatoes, 6 cucumbers, 4–5 peppers", note: "Salads Mon/Tue/Thu/Sat/Sun." },
    { id: "fruit", name: "Fruit mix (banana, mango, orange, guava, papaya)", qty: "Bananas ×7, mangoes ×3–4, oranges ×5–6, guava ×2–3, papaya ×2", note: "Breakfasts & snacks." },
    { id: "avocado", name: "Avocados", qty: "≈3–4", note: "Mon/Sun breakfasts + extra fats on other days." }
  ],
  supermarket: [
    { id: "oats", name: "Oats", qty: "≈500 g", note: "Tue breakfast and optional extra carbs." },
    { id: "quinoa", name: "Quinoa", qty: "≈350 g", note: "Tue and Sun dinners." },
    { id: "yogurt", name: "Greek / high‑protein yogurt", qty: "≈1.4–1.6 kg", note: "Mon/Thu snacks (200 g each)." },
    { id: "nuts", name: "Walnuts + almonds", qty: "Walnuts ≈150 g, almonds ≈100 g", note: "Snacks and healthy fats." },
    { id: "peanutButter", name: "Peanut butter", qty: "≈200 g jar", note: "Tue breakfast + optional snacks." },
    { id: "oils", name: "Olive oil + flaxseed oil", qty: "Olive oil ≈150 ml, flaxseed oil ≈50–100 ml", note: "Salads and vegan breakfasts." },
    { id: "coffee", name: "Coffee (buna)", qty: "Enough for ~5 pre‑workout cups/week", note: "Afternoon pre‑workout." },
    { id: "whey", name: "Whey protein", qty: "≈700–900 g", note: "30 g after each gym session + small amount Tue breakfast." },
    { id: "plantProtein", name: "Plant protein powder", qty: "≈500 g", note: "2 vegan post‑workout shakes/week + extra on vegan days if needed." },
    { id: "creatine", name: "Creatine monohydrate", qty: "1 tub (300–500 g)", note: "5 g/day." },
    { id: "vitamins", name: "D3, B12, zinc, ginseng‑multi", qty: "1–2 months supply", note: "Daily supplements." },
    { id: "water", name: "If needed: bottled water", qty: "≈25 L/week", note: "To help hit 3.5 L/day if tap water is not ideal." }
  ]
};

/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getDailyKey(dateStr) {
  return STORAGE_PREFIX + "daily_" + dateStr;
}

function loadDailyData(dateStr) {
  try {
    const raw = localStorage.getItem(getDailyKey(dateStr));
    if (!raw) return { checklist: {}, water: "", sleep: "", notes: "" };
    const parsed = JSON.parse(raw);
    return Object.assign({ checklist: {}, water: "", sleep: "", notes: "" }, parsed);
  } catch (e) {
    return { checklist: {}, water: "", sleep: "", notes: "" };
  }
}

function saveDailyData(dateStr, data) {
  localStorage.setItem(getDailyKey(dateStr), JSON.stringify(data));
}

// Logs
const LOG_KEY = STORAGE_PREFIX + "logs";

function loadLogs() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

// Groceries
const GROCERY_KEY = STORAGE_PREFIX + "groceries";

function loadGroceriesState() {
  try {
    const raw = localStorage.getItem(GROCERY_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveGroceriesState(state) {
  localStorage.setItem(GROCERY_KEY, JSON.stringify(state));
}

// Settings
const settingsKey = STORAGE_PREFIX + "settings";

function defaultSettings() {
  return {
    age: 24,
    gender: "male",
    height: 174.5,
    weight: 76.2,
    activity: 1.6,
    startDate: todayISO(),
    targetWeeks: 78,
    targetWeight: 68,
    lastDeloadWeek: 0,
    theme: "dark"
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(settingsKey);
    if (!raw) {
      const s = defaultSettings();
      localStorage.setItem(settingsKey, JSON.stringify(s));
      return s;
    }
    return Object.assign(defaultSettings(), JSON.parse(raw));
  } catch (e) {
    const s = defaultSettings();
    localStorage.setItem(settingsKey, JSON.stringify(s));
    return s;
  }
}

function saveSettings(s) {
  localStorage.setItem(settingsKey, JSON.stringify(s));
}

/* =========================================================
   DASHBOARD & CHECKLIST RENDERING
   ========================================================= */

const dayTitleEl = document.getElementById("dayTitle");
const dayGoalEl = document.getElementById("dayGoal");
const dayTypeChipEl = document.getElementById("dayTypeChip");
const todayDateStrEl = document.getElementById("todayDateStr");
const datePickerEl = document.getElementById("datePicker");
const waterInputEl = document.getElementById("waterInput");
const sleepInputEl = document.getElementById("sleepInput");
const dayNotesEl = document.getElementById("dayNotes");

const checklistMorningEl = document.getElementById("checklistMorning");
const checklistMiddayEl = document.getElementById("checklistMidday");
const checklistEveningEl = document.getElementById("checklistEvening");

const morningProgressLabelEl = document.getElementById("morningProgressLabel");
const middayProgressLabelEl = document.getElementById("middayProgressLabel");
const eveningProgressLabelEl = document.getElementById("eveningProgressLabel");
const morningProgressBarEl = document.getElementById("morningProgressBar");
const middayProgressBarEl = document.getElementById("middayProgressBar");
const eveningProgressBarEl = document.getElementById("eveningProgressBar");

const dayProgressEl = document.getElementById("dayProgress");
const dayProgressPercentEl = document.getElementById("dayProgressPercent");
const dayProgressSubtitleEl = document.getElementById("dayProgressSubtitle");

const viewAllBtn = document.getElementById("viewAllBtn");
const viewGymBtn = document.getElementById("viewGymBtn");

let currentDashboardDate = todayISO();
let currentViewMode = "all"; // "all" or "gym"

function getPlanForDate(dateStr) {
  const d = new Date(dateStr + "T12:00");
  const dow = d.getDay();
  return weeklyPlan[dayNames[dow]];
}

/* Compute completion for a date (for calendar, coach, progress ring) */
function getDailyCompletion(dateStr) {
  const plan = getPlanForDate(dateStr);
  if (!plan) return { completed: 0, total: 0, taskFraction: 0, waterOK: false, sleepOK: false, fullDay: false };
  const daily = loadDailyData(dateStr);
  const total = plan.checklist.length;
  let completed = 0;
  for (let i = 0; i < total; i++) {
    if (daily.checklist && daily.checklist["task_" + i]) completed++;
  }
  const fraction = total ? completed / total : 0;
  const water = parseFloat(daily.water || "0");
  const sleep = parseFloat(daily.sleep || "0");
  const waterOK = water >= 3.5;
  const sleepOK = sleep >= 7;
  const fullDay = fraction >= 0.95 && waterOK && sleepOK;
  return { completed, total, taskFraction: fraction, waterOK, sleepOK, fullDay };
}

function renderDashboard(dateStr) {
  currentDashboardDate = dateStr;

  const d = new Date(dateStr + "T12:00");
  const plan = getPlanForDate(dateStr);
  const dayName = dayNames[d.getDay()];

  dayTitleEl.textContent = dayName;
  dayGoalEl.textContent = plan.goal;
  dayTypeChipEl.textContent = plan.type;
  todayDateStrEl.textContent = formatDateHuman(d);
  datePickerEl.value = dateStr;

  const daily = loadDailyData(dateStr);

  // Clear time-block lists
  checklistMorningEl.innerHTML = "";
  checklistMiddayEl.innerHTML = "";
  checklistEveningEl.innerHTML = "";

  const blockStats = {
    morning: { completed: 0, total: 0 },
    midday: { completed: 0, total: 0 },
    evening: { completed: 0, total: 0 }
  };

  plan.checklist.forEach((item, idx) => {
    const isGym = !!item.gym;
    if (currentViewMode === "gym" && !isGym) {
      // skip non‑gym items in gym view
      return;
    }

    const block = getTimeBlockForTime(item.time);
    const listEl =
      block === "morning"
        ? checklistMorningEl
        : block === "midday"
        ? checklistMiddayEl
        : checklistEveningEl;

    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    const id = "task_" + idx;
    cb.checked = !!daily.checklist[id];
    cb.addEventListener("change", () => {
      daily.checklist[id] = cb.checked;
      saveDailyData(dateStr, daily);
      updateDayProgress(dateStr);
      updateCoachCard();
    });

    const timeSpan = document.createElement("span");
    timeSpan.className = "time-tag";
    timeSpan.textContent = item.time;

    const labelSpan = document.createElement("span");
    labelSpan.className = "label-text";
    labelSpan.textContent = item.label;

    li.appendChild(cb);
    li.appendChild(timeSpan);
    li.appendChild(labelSpan);
    listEl.appendChild(li);

    // Block stats
    blockStats[block].total++;
    if (cb.checked) blockStats[block].completed++;
  });

  // Update block progress bars
  function updateBlockUI(block, labelEl, barEl) {
    const { completed, total } = blockStats[block];
    labelEl.textContent = `${completed} / ${total}`;
    const pct = total ? (completed / total) * 100 : 0;
    barEl.style.width = pct + "%";
  }
  updateBlockUI("morning", morningProgressLabelEl, morningProgressBarEl);
  updateBlockUI("midday", middayProgressLabelEl, middayProgressBarEl);
  updateBlockUI("evening", eveningProgressLabelEl, eveningProgressBarEl);

  // Water, sleep, notes
  waterInputEl.value = daily.water || "";
  sleepInputEl.value = daily.sleep || "";
  dayNotesEl.value = daily.notes || "";

  waterInputEl.oninput = () => {
    daily.water = waterInputEl.value;
    saveDailyData(dateStr, daily);
    updateDayProgress(dateStr);
    updateCoachCard();
  };

  sleepInputEl.oninput = () => {
    daily.sleep = sleepInputEl.value;
    saveDailyData(dateStr, daily);
    updateDayProgress(dateStr);
    updateCoachCard();
  };

  dayNotesEl.oninput = () => {
    daily.notes = dayNotesEl.value;
    saveDailyData(dateStr, daily);
  };

  updateDayProgress(dateStr);
}

/* Progress ring update (Feature #1) */

function updateDayProgress(dateStr) {
  const info = getDailyCompletion(dateStr);
  const pctTasks = info.total ? Math.round(info.taskFraction * 100) : 0;
  const ringValue = document.querySelector(".progress-ring__value");

  // set stroke lengths
  ringValue.style.strokeDasharray = `${RING_CIRC}`;
  const offset = RING_CIRC * (1 - info.taskFraction);
  ringValue.style.strokeDashoffset = offset;

  dayProgressPercentEl.textContent = `${pctTasks}%`;

  if (info.fullDay) {
    dayProgressSubtitleEl.textContent = "Full day ✔";
  } else if (info.waterOK && info.sleepOK) {
    dayProgressSubtitleEl.textContent = `${info.completed}/${info.total} tasks`;
  } else {
    dayProgressSubtitleEl.textContent = `${info.completed}/${info.total} tasks`;
  }

  dayProgressEl.classList.remove("good", "ok", "bad");
  if (info.fullDay) {
    dayProgressEl.classList.add("good");
  } else if (pctTasks >= 60) {
    dayProgressEl.classList.add("ok");
  } else {
    dayProgressEl.classList.add("bad");
  }
}

datePickerEl.addEventListener("change", (e) => {
  const v = e.target.value || todayISO();
  renderDashboard(v);
});

// View toggle (Feature #3)

viewAllBtn.addEventListener("click", () => {
  if (currentViewMode === "all") return;
  currentViewMode = "all";
  viewAllBtn.classList.add("active");
  viewGymBtn.classList.remove("active");
  renderDashboard(currentDashboardDate);
});

viewGymBtn.addEventListener("click", () => {
  if (currentViewMode === "gym") return;
  currentViewMode = "gym";
  viewGymBtn.classList.add("active");
  viewAllBtn.classList.remove("active");
  renderDashboard(currentDashboardDate);
});

/* =========================================================
   PROGRESS LOG & CHART
   ========================================================= */

const logDateEl = document.getElementById("logDate");
const logWeightEl = document.getElementById("logWeight");
const logWaistEl = document.getElementById("logWaist");
const logEnergyEl = document.getElementById("logEnergy");
const logHungerEl = document.getElementById("logHunger");
const logNotesEl = document.getElementById("logNotes");
const saveLogBtn = document.getElementById("saveLogBtn");
const logTableBody = document.querySelector("#logTable tbody");
let weightChart;

function renderLogs() {
  const logs = loadLogs().sort((a, b) => a.date.localeCompare(b.date));
  logTableBody.innerHTML = "";
  logs.forEach((log) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.date}</td>
      <td>${log.weight ?? ""}</td>
      <td>${log.waist ?? ""}</td>
      <td>${log.energy ?? ""}</td>
      <td>${log.hunger ?? ""}</td>
      <td>${log.notes ? log.notes.replace(/\n/g, "<br>") : ""}</td>
    `;
    logTableBody.appendChild(tr);
  });
  renderWeightChart(logs);
  updateCoachCard();
  updateWeeklySummary();
}

function renderWeightChart(logs) {
  const ctx = document.getElementById("weightChart").getContext("2d");
  const labels = logs.map((l) => l.date);
  const data = logs.map((l) => l.weight);
  if (weightChart) weightChart.destroy();
  weightChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Weight (kg)",
          data,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.15)",
          tension: 0.25,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#22c55e"
        }
      ]
    },
    options: {
      scales: {
        x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
        y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(55,65,81,0.6)" } }
      },
      plugins: {
        legend: { labels: { color: "#e5e7eb" } }
      }
    }
  });
}

saveLogBtn.addEventListener("click", () => {
  const date = logDateEl.value || todayISO();
  const weight = logWeightEl.value ? parseFloat(logWeightEl.value) : null;
  const waist = logWaistEl.value ? parseFloat(logWaistEl.value) : null;
  const energy = logEnergyEl.value ? parseInt(logEnergyEl.value, 10) : null;
  const hunger = logHungerEl.value ? parseInt(logHungerEl.value, 10) : null;
  const notes = logNotesEl.value.trim();

  let logs = loadLogs();
  const idx = logs.findIndex((l) => l.date === date);
  const entry = { date, weight, waist, energy, hunger, notes };
  if (idx >= 0) logs[idx] = entry;
  else logs.push(entry);
  saveLogs(logs);
  renderLogs();
  alert("Check‑in saved.");
});

/* =========================================================
   PLAN OVERVIEW
   ========================================================= */

const planCardsEl = document.getElementById("planCards");

function renderPlanOverview() {
  planCardsEl.innerHTML = "";
  dayNames.forEach((dayName) => {
    const plan = weeklyPlan[dayName];
    if (!plan) return;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${dayName}<span class="chip">${plan.type}</span></h2>
      <p class="muted">Goal: ${plan.goal}</p>
      <ul class="checklist">
        ${plan.checklist
          .map(
            (item) => `
          <li>
            <span class="time-tag">${item.time}</span>
            <span class="label-text">${item.label}</span>
          </li>`
          )
          .join("")}
      </ul>
    `;
    planCardsEl.appendChild(card);
  });
}

/* =========================================================
   GROCERIES
   ========================================================= */

function renderGroceries() {
  const state = loadGroceriesState();
  const localListEl = document.getElementById("localGroceriesList");
  const superListEl = document.getElementById("superGroceriesList");
  localListEl.innerHTML = "";
  superListEl.innerHTML = "";

  function buildList(type, data, parentEl) {
    data.forEach((item) => {
      const li = document.createElement("li");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      const key = type + "_" + item.id;
      cb.checked = !!state[key];
      cb.addEventListener("change", () => {
        state[key] = cb.checked;
        saveGroceriesState(state);
      });
      const labelSpan = document.createElement("span");
      labelSpan.className = "label-text";
      labelSpan.innerHTML = `<strong>${item.name}</strong><br><span class="muted">Weekly amount: ${item.qty}${
        item.note ? " — " + item.note : ""
      }</span>`;
      li.appendChild(cb);
      li.appendChild(labelSpan);
      parentEl.appendChild(li);
    });
  }

  buildList("local", groceryData.local, localListEl);
  buildList("super", groceryData.supermarket, superListEl);
}

/* =========================================================
   SETTINGS, MACROS & THEME (Feature #5)
   ========================================================= */

const setAgeEl = document.getElementById("setAge");
const setGenderEl = document.getElementById("setGender");
const setHeightEl = document.getElementById("setHeight");
const setWeightEl = document.getElementById("setWeight");
const setActivityEl = document.getElementById("setActivity");
const setStartDateEl = document.getElementById("setStartDate");
const setTargetWeeksEl = document.getElementById("setTargetWeeks");
const setTargetWeightEl = document.getElementById("setTargetWeight");
const themeSelectEl = document.getElementById("themeSelect");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const macroSummaryEl = document.getElementById("macroSummary");
const themeToggleBtn = document.getElementById("themeToggleBtn");

function calcBMR({ weight, height, age, gender }) {
  if (gender === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove("theme-dark", "theme-light", "theme-bunna");
  let t = theme;
  if (!["dark", "light", "bunna"].includes(t)) t = "dark";
  body.classList.add("theme-" + t);
  const metaTheme = document.querySelector("meta[name='theme-color']");
  if (metaTheme) {
    metaTheme.setAttribute("content", t === "light" ? "#f5f5f5" : "#020617");
  }
  if (themeToggleBtn) {
    themeToggleBtn.textContent =
      t === "dark" ? "Dark" : t === "light" ? "Light" : "Bunna";
  }
}

function updateMacroSummary() {
  const s = loadSettings();
  const bmr = calcBMR({
    weight: s.weight,
    height: s.height,
    age: s.age,
    gender: s.gender
  });
  const tdee = bmr * s.activity;
  const cutCalories = Math.round(tdee - 500);
  const protein = s.weight * 2.1;
  const fat = s.weight * 0.7;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbsKcal = Math.max(cutCalories - proteinKcal - fatKcal, 0);
  const carbs = carbsKcal / 4;
  const weeklyGoal = s.targetWeight
    ? (s.weight - s.targetWeight) / (s.targetWeeks || 78)
    : null;
  const goalLine = s.targetWeight
    ? `<p>Planned goal: from about <strong>${s.weight} kg</strong> now towards <strong>${s.targetWeight} kg</strong> over <strong>${s.targetWeeks}</strong> weeks (≈ <strong>${weeklyGoal.toFixed(
        2
      )}</strong> kg/week on average).</p>`
    : "";

  macroSummaryEl.innerHTML = `
    <p>BMR ≈ <strong>${Math.round(bmr)}</strong> kcal/day &nbsp; | &nbsp;
       Maintenance (TDEE) ≈ <strong>${Math.round(tdee)}</strong> kcal/day</p>
    <p>Suggested cutting target: <strong>${cutCalories}</strong> kcal/day</p>
    <p>Macro guide (per day during cut):</p>
    <ul class="muted" style="padding-left:16px;">
      <li>Protein: <strong>${protein.toFixed(0)} g</strong></li>
      <li>Fat: <strong>${fat.toFixed(0)} g</strong></li>
      <li>Carbs: <strong>${carbs.toFixed(0)} g</strong> (adjust based on hunger & performance)</li>
    </ul>
    ${goalLine}
  `;
}

function renderSettings() {
  const s = loadSettings();
  setAgeEl.value = s.age;
  setGenderEl.value = s.gender;
  setHeightEl.value = s.height;
  setWeightEl.value = s.weight;
  setActivityEl.value = String(s.activity);
  setStartDateEl.value = s.startDate;
  setTargetWeeksEl.value = s.targetWeeks;
  setTargetWeightEl.value = s.targetWeight || "";
  themeSelectEl.value = s.theme || "dark";
  applyTheme(s.theme || "dark");
  updateMacroSummary();
}

saveSettingsBtn.addEventListener("click", () => {
  const old = loadSettings();
  const s = {
    age: parseInt(setAgeEl.value, 10) || old.age,
    gender: setGenderEl.value,
    height: parseFloat(setHeightEl.value) || old.height,
    weight: parseFloat(setWeightEl.value) || old.weight,
    activity: parseFloat(setActivityEl.value) || old.activity,
    startDate: setStartDateEl.value || old.startDate || todayISO(),
    targetWeeks: parseInt(setTargetWeeksEl.value, 10) || old.targetWeeks,
    targetWeight:
      parseFloat(setTargetWeightEl.value) || old.targetWeight || old.weight - 8,
    lastDeloadWeek: old.lastDeloadWeek || 0,
    theme: themeSelectEl.value || old.theme || "dark"
  };
  saveSettings(s);
  applyTheme(s.theme);
  updateMacroSummary();
  updateCoachCard();
  alert("Settings saved.");
});

// Header theme toggle cycles through themes
themeToggleBtn.addEventListener("click", () => {
  const s = loadSettings();
  const order = ["dark", "light", "bunna"];
  const idx = order.indexOf(s.theme || "dark");
  const next = order[(idx + 1) % order.length];
  s.theme = next;
  saveSettings(s);
  themeSelectEl.value = next;
  applyTheme(next);
});

/* =========================================================
   CALENDAR
   ========================================================= */

let calendarYear, calendarMonth;
const calendarTitleEl = document.getElementById("calendarTitle");
const calendarGridEl = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

function initCalendar() {
  const t = new Date();
  calendarYear = t.getFullYear();
  calendarMonth = t.getMonth();
  renderCalendar();
}

function renderCalendar() {
  if (calendarYear == null || calendarMonth == null) {
    const t = new Date();
    calendarYear = t.getFullYear();
    calendarMonth = t.getMonth();
  }
  const first = new Date(calendarYear, calendarMonth, 1);
  const last = new Date(calendarYear, calendarMonth + 1, 0);
  const firstDow = first.getDay();
  const daysInMonth = last.getDate();

  calendarTitleEl.textContent = first.toLocaleString(undefined, {
    month: "long",
    year: "numeric"
  });

  const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let html = "";
  weekdayShort.forEach((w) => {
    html += `<div class="weekday">${w}</div>`;
  });

  for (let i = 0; i < firstDow; i++) {
    html += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr =
      calendarYear +
      "-" +
      String(calendarMonth + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");
    const c = getDailyCompletion(dateStr);
    let cls = "day-cell ";
    if (c.fullDay) cls += "day-full";
    else if (c.taskFraction > 0 || c.waterOK || c.sleepOK) cls += "day-partial";
    else cls += "day-empty";

    const xMark = c.fullDay ? `<span class="x-mark">X</span>` : "";
    html += `<div class="${cls}" data-date="${dateStr}">
              <span class="day-num">${day}</span>
              ${xMark}
            </div>`;
  }

  const totalCells = firstDow + daysInMonth + 7;
  const remainder = totalCells % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      html += `<div></div>`;
    }
  }

  calendarGridEl.innerHTML = html;

  document.querySelectorAll(".day-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const dateStr = cell.dataset.date;
      document
        .querySelector("nav button[data-section='dashboard']")
        .click();
      renderDashboard(dateStr);
    });
  });
}

prevMonthBtn.addEventListener("click", () => {
  calendarMonth--;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }
  renderCalendar();
});
nextMonthBtn.addEventListener("click", () => {
  calendarMonth++;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  }
  renderCalendar();
});

/* =========================================================
   COACH, WEEKLY SUMMARY & STATUS
   ========================================================= */

const ratingBadgeEl = document.getElementById("ratingBadge");
const coachContentEl = document.getElementById("coachContent");
const deloadBtnEl = document.getElementById("deloadBtn");

// Weekly summary elements
const weeklyCompletionPctEl = document.getElementById("weeklyCompletionPct");
const weeklyFullDaysEl = document.getElementById("weeklyFullDays");
const currentStreakEl = document.getElementById("currentStreak");
const bestStreakEl = document.getElementById("bestStreak");
const weeklyWeightChangeEl = document.getElementById("weeklyWeightChange");
const weeklyAvgSleepEl = document.getElementById("weeklyAvgSleep");
const weeklyAvgWaterEl = document.getElementById("weeklyAvgWater");

function computeRecentAdherence(days = 7) {
  const today = new Date();
  let sumFraction = 0;
  let fullCount = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getTime() - i * oneDayMs);
    const dateStr = d.toISOString().slice(0, 10);
    const c = getDailyCompletion(dateStr);
    sumFraction += c.taskFraction;
    if (c.fullDay) fullCount++;
  }
  const avgPct = (sumFraction / days) * 100;
  return { avgPct, isNaN: !isFinite(avgPct), fullCount };
}

function computeOverallAdherence(startDateISO) {
  const start = new Date(startDateISO + "T12:00");
  const today = new Date();
  if (isNaN(start)) return null;
  if (today < start) return null;
  let sumFraction = 0;
  let days = 0;
  let fullCount = 0;
  for (let t = new Date(start); t <= today; t = new Date(t.getTime() + oneDayMs)) {
    const dateStr = t.toISOString().slice(0, 10);
    const c = getDailyCompletion(dateStr);
    sumFraction += c.taskFraction;
    days++;
    if (c.fullDay) fullCount++;
  }
  const avgPct = days ? (sumFraction / days) * 100 : 0;
  return { avgPct, fullCount, days };
}

function computeWeightTrend() {
  const logs = loadLogs()
    .filter((l) => l.weight != null)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (logs.length < 2) return null;
  const first = logs[0];
  const last = logs[logs.length - 1];
  const daysDiff = (new Date(last.date) - new Date(first.date)) / oneDayMs;
  if (daysDiff <= 0) return null;
  const delta = last.weight - first.weight;
  const perWeek = (delta * 7) / daysDiff;
  return { perWeek, delta, daysDiff, latest: last.weight };
}

function computeTimelineStatus(settings) {
  const s = settings || loadSettings();
  const logs = loadLogs()
    .filter((l) => l.weight != null)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!logs.length) return null;
  const startWeight = logs[0].weight;
  const currentWeight = logs[logs.length - 1].weight;
  const targetWeight = s.targetWeight;
  if (!targetWeight) return null;

  const startDate = new Date((s.startDate || logs[0].date) + "T12:00");
  const totalWeeks = s.targetWeeks || 78;
  const today = new Date();
  if (today < startDate) return null;

  const elapsedWeeks = (today - startDate) / (7 * oneDayMs);
  const weeksLeft = Math.max(totalWeeks - elapsedWeeks, 0);
  const requiredTotalLoss = startWeight - targetWeight;
  const achievedLoss = startWeight - currentWeight;

  let progressFraction;
  if (requiredTotalLoss <= 0) {
    progressFraction = 1;
  } else {
    progressFraction = achievedLoss / requiredTotalLoss;
  }
  const timeFraction = Math.min(Math.max(elapsedWeeks / totalWeeks, 0), 1);

  return {
    startWeight,
    currentWeight,
    targetWeight,
    requiredTotalLoss,
    achievedLoss,
    progressFraction,
    timeFraction,
    weeksLeft
  };
}

function evaluateStatus(settings, adherence7, overall, trend, timeline) {
  let adherenceScore = 60;
  if (overall && overall.days > 0) {
    const aAll = overall.avgPct;
    const a7 = adherence7 && !adherence7.isNaN ? adherence7.avgPct : aAll;
    adherenceScore = 0.6 * a7 + 0.4 * aAll;
  } else if (adherence7 && !adherence7.isNaN) {
    adherenceScore = adherence7.avgPct;
  } else {
    adherenceScore = 50;
  }
  adherenceScore = Math.max(0, Math.min(100, adherenceScore));

  let weightScore = 60;
  if (trend) {
    const r = trend.perWeek;
    if (r >= 0) {
      weightScore = 25;
    } else {
      const absRate = Math.abs(r);
      if (absRate < 0.25) weightScore = 45;
      else if (absRate < 0.4) weightScore = 70;
      else if (absRate <= 0.7) weightScore = 95;
      else if (absRate <= 1.0) weightScore = 80;
      else weightScore = 55;
    }
  } else {
    weightScore = 60;
  }

  let timelineScore = 60;
  if (timeline) {
    if (timeline.requiredTotalLoss <= 0) {
      timelineScore = 100;
    } else {
      const pf = Math.max(0, Math.min(1.5, timeline.progressFraction));
      const tf = Math.max(0.05, Math.min(1, timeline.timeFraction || 0.05));
      const ratio = pf / tf;
      if (ratio >= 1.1) timelineScore = 95;
      else if (ratio >= 0.9) timelineScore = 85;
      else if (ratio >= 0.7) timelineScore = 70;
      else if (ratio >= 0.4) timelineScore = 50;
      else timelineScore = 35;
    }
  } else {
    timelineScore = 60;
  }

  const finalScore = Math.round(
    0.45 * adherenceScore + 0.3 * weightScore + 0.25 * timelineScore
  );

  let level, css;
  if (finalScore >= 90) {
    level = "Excellent";
    css = "rating-excellent";
  } else if (finalScore >= 75) {
    level = "Good";
    css = "rating-good";
  } else if (finalScore >= 55) {
    level = "Normal";
    css = "rating-normal";
  } else if (finalScore >= 35) {
    level = "Bad";
    css = "rating-bad";
  } else {
    level = "Very bad";
    css = "rating-verybad";
  }

  return { finalScore, level, css, adherenceScore, weightScore, timelineScore };
}

function updateCoachCard() {
  const s = loadSettings();
  const today = new Date();
  const startDateISO = s.startDate || todayISO();
  const startDate = new Date(startDateISO + "T12:00");
  const msDiff = today - startDate;
  const weekNumber = msDiff >= 0 ? Math.floor(msDiff / (7 * oneDayMs)) + 1 : 0;
  const totalWeeks = s.targetWeeks || 78;

  const adherence7 = computeRecentAdherence(7);
  const overall = computeOverallAdherence(startDateISO);
  const trend = computeWeightTrend();
  const timeline = computeTimelineStatus(s);
  const evalRes = evaluateStatus(s, adherence7, overall, trend, timeline);

  ratingBadgeEl.innerHTML = `<span class="rating-badge ${evalRes.css}">Status: ${evalRes.level} (${evalRes.finalScore}/100)</span>`;

  let trendText;
  if (!trend) {
    trendText =
      "Not enough weight logs yet. Log weight at least once per week for fat‑loss speed feedback.";
  } else {
    const rate = trend.perWeek;
    const absRate = Math.abs(rate);
    let status;
    if (rate >= 0) {
      status =
        "Weight is not decreasing yet. Improve adherence and consider tightening food if this continues.";
    } else if (absRate < 0.25) {
      status =
        "Fat loss is quite slow. If this continues for 2–3 weeks, reduce daily calories by ~150–200 kcal.";
    } else if (absRate <= 0.7) {
      status =
        "Fat loss pace is on track. Keep calories and training the same.";
    } else if (absRate <= 1.0) {
      status =
        "You are losing quickly. Make sure performance and energy stay good; add some calories if strength drops.";
    } else {
      status =
        "You are losing very fast. Increase calories slightly to protect muscle and recovery.";
    }
    trendText = `Average change ≈ <strong>${rate.toFixed(
      2
    )} kg/week</strong> (negative = loss). ${status}`;
  }

  const currentWeek = weekNumber > 0 ? weekNumber : 0;
  const lastDeloadWeek = s.lastDeloadWeek || 0;
  const nextDeloadWeek = lastDeloadWeek + 8;
  let deloadText = "";
  if (currentWeek >= nextDeloadWeek && currentWeek > 0) {
    if (currentWeek === nextDeloadWeek) {
      deloadText =
        "This is a good week for a <strong>deload</strong>: reduce weights to 60–70% or halve sets for one week.";
    } else {
      deloadText = `You are ${
        currentWeek - lastDeloadWeek
      } weeks since the last recorded deload. Plan one as soon as practical.`;
    }
  } else if (currentWeek > 0) {
    const weeksToNext = nextDeloadWeek - currentWeek;
    if (weeksToNext > 0) {
      deloadText = `Next recommended deload in about <strong>${weeksToNext}</strong> week(s).`;
    }
  }

  const weekLine =
    currentWeek > 0
      ? `You are in <strong>week ${currentWeek}</strong> of <strong>${totalWeeks}</strong> planned weeks.`
      : "Set your program start date in Settings to track weeks.";

  const overallLine =
    overall && overall.days > 0
      ? `Since start (${overall.days} days), average checklist completion ≈ <strong>${overall.avgPct.toFixed(
          0
        )}%</strong> with <strong>${overall.fullCount}</strong> fully completed days (all tasks + water + sleep).`
      : "No history yet – today will be your first logged day.";

  const recentLine = adherence7.isNaN
    ? "Last 7 days: not enough data yet."
    : `Last 7 days: average checklist completion ≈ <strong>${adherence7.avgPct.toFixed(
        0
      )}%</strong>, with <strong>${adherence7.fullCount}</strong> full days.`;

  let timelineText;
  if (!timeline) {
    timelineText =
      "Set a realistic target weight in Settings (for example, around 66–68 kg for an 8% BF cut) and keep logging weight to see if you are ahead or behind schedule.";
  } else {
    const {
      startWeight,
      currentWeight,
      targetWeight,
      requiredTotalLoss,
      achievedLoss,
      progressFraction,
      timeFraction,
      weeksLeft
    } = timeline;

    if (requiredTotalLoss <= 0) {
      timelineText = `Your target weight (${targetWeight} kg) is at or above your starting logged weight (${startWeight} kg). If your goal is an 8% body‑fat cut, consider setting a lower target weight.`;
    } else {
      const pctProg = Math.max(0, Math.min(100, progressFraction * 100));
      const pctTime = Math.max(0, Math.min(100, timeFraction * 100));
      const weeksLeftRounded = Math.max(0, weeksLeft).toFixed(1);
      const ratio = progressFraction / (timeFraction || 0.01);
      let scheduleStatus;
      if (ratio >= 1.1) scheduleStatus = "You are ahead of schedule for your goal.";
      else if (ratio >= 0.9)
        scheduleStatus = "You are roughly on schedule for your goal.";
      else if (ratio >= 0.7)
        scheduleStatus =
          "You are slightly behind schedule. Stay consistent or tighten food a bit.";
      else
        scheduleStatus =
          "You are behind schedule. Improve adherence and consider a small calorie reduction.";

      if (trend) {
        const currentWeeklyLoss = trend.perWeek < 0 ? -trend.perWeek : 0;
        const requiredFromNow =
          (currentWeight - targetWeight) / Math.max(weeksLeft, 0.01);
        timelineText = `Since your first log you have lost <strong>${achievedLoss.toFixed(
          1
        )} kg</strong> out of about <strong>${requiredTotalLoss.toFixed(
          1
        )} kg</strong> needed (${pctProg.toFixed(
          0
        )}% of the way) while about <strong>${pctTime.toFixed(
          0
        )}%</strong> of the planned time has passed. ${scheduleStatus} To reach <strong>${targetWeight} kg</strong> in roughly <strong>${weeksLeftRounded}</strong> weeks, you need about <strong>${requiredFromNow.toFixed(
          2
        )} kg/week</strong> loss from now; your current trend is about <strong>${currentWeeklyLoss.toFixed(
          2
        )} kg/week</strong>.`;
      } else {
        timelineText = `Since your first log you have lost <strong>${achievedLoss.toFixed(
          1
        )} kg</strong> out of about <strong>${requiredTotalLoss.toFixed(
          1
        )} kg</strong> needed (${pctProg.toFixed(
          0
        )}% of the way) while about <strong>${pctTime.toFixed(
          0
        )}%</strong> of the planned time has passed. ${scheduleStatus} Log weight regularly so the app can estimate the weekly loss you need from here.`;
      }
    }
  }

  coachContentEl.innerHTML = `
    <p>${weekLine}</p>
    <p>${overallLine}</p>
    <p>${recentLine}</p>
    <p>${trendText}</p>
    <p>${timelineText}</p>
    <p>System scores (0–100): Adherence <strong>${evalRes.adherenceScore.toFixed(
      0
    )}</strong>, Weight trend <strong>${evalRes.weightScore.toFixed(
    0
  )}</strong>, Schedule <strong>${evalRes.timelineScore.toFixed(0)}</strong>.</p>
    <p>${deloadText}</p>
  `;

  renderCalendar();
  updateWeeklySummary();
}

deloadBtnEl.addEventListener("click", () => {
  const s = loadSettings();
  const today = new Date();
  const start = new Date((s.startDate || todayISO()) + "T12:00");
  const weekNumber = Math.floor((today - start) / (7 * oneDayMs)) + 1;
  s.lastDeloadWeek = Math.max(weekNumber, 1);
  saveSettings(s);
  updateCoachCard();
  alert("Deload week recorded.");
});

/* -------- Weekly summary & streaks (Feature #4) -------- */

function updateWeeklySummary() {
  const today = new Date();
  let sumFraction = 0;
  let fullDays = 0;
  let sleepSum = 0;
  let waterSum = 0;
  let sleepCount = 0;
  let waterCount = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() - i * oneDayMs);
    const dateStr = d.toISOString().slice(0, 10);
    const c = getDailyCompletion(dateStr);
    sumFraction += c.taskFraction;
    if (c.fullDay) fullDays++;

    const daily = loadDailyData(dateStr);
    if (daily.sleep) {
      sleepSum += parseFloat(daily.sleep) || 0;
      sleepCount++;
    }
    if (daily.water) {
      waterSum += parseFloat(daily.water) || 0;
      waterCount++;
    }
  }

  const avgPct = (sumFraction / 7) * 100;
  weeklyCompletionPctEl.textContent = `${isFinite(avgPct) ? avgPct.toFixed(0) : "0"}%`;
  weeklyFullDaysEl.textContent = fullDays;

  const avgSleep = sleepCount ? sleepSum / sleepCount : 0;
  const avgWater = waterCount ? waterSum / waterCount : 0;
  weeklyAvgSleepEl.textContent = `${avgSleep.toFixed(1)} h`;
  weeklyAvgWaterEl.textContent = `${avgWater.toFixed(1)} L`;

  // Streaks
  let currentStreak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today.getTime() - i * oneDayMs);
    const dateStr = d.toISOString().slice(0, 10);
    const c = getDailyCompletion(dateStr);
    if (c.fullDay) currentStreak++;
    else break;
  }

  let bestStreak = 0;
  // approximate: scan last 180 days
  for (let offset = 0; offset < 180; offset++) {
    let streak = 0;
    for (let i = offset; ; i++) {
      const d = new Date(today.getTime() - i * oneDayMs);
      const dateStr = d.toISOString().slice(0, 10);
      const c = getDailyCompletion(dateStr);
      if (c.fullDay) streak++;
      else break;
    }
    if (streak > bestStreak) bestStreak = streak;
  }

  currentStreakEl.textContent = `${currentStreak} day${currentStreak === 1 ? "" : "s"}`;
  bestStreakEl.textContent = bestStreak;

  // Weight change vs ~7 days ago
  const logs = loadLogs()
    .filter((l) => l.weight != null)
    .sort((a, b) => a.date.localeCompare(b.date));
  let weightChange = 0;
  if (logs.length >= 2) {
    const last = logs[logs.length - 1];
    const lastDate = new Date(last.date + "T12:00");
    const targetDate = new Date(lastDate.getTime() - 7 * oneDayMs);
    let prev = null;
    for (let i = logs.length - 2; i >= 0; i--) {
      const d = new Date(logs[i].date + "T12:00");
      if (d <= targetDate) {
        prev = logs[i];
        break;
      }
    }
    if (!prev) prev = logs[0];
    weightChange = last.weight - prev.weight;
  }
  weeklyWeightChangeEl.textContent = `${weightChange >= 0 ? "+" : ""}${weightChange.toFixed(
    1
  )} kg`;
}

/* =========================================================
   EXPORT / IMPORT (Feature #6)
   ========================================================= */

const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const importFileInput = document.getElementById("importFileInput");
const importStatusEl = document.getElementById("importStatus");

exportDataBtn.addEventListener("click", () => {
  const settings = loadSettings();
  const logs = loadLogs();
  const groceries = loadGroceriesState();

  const daily = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX + "daily_")) {
      const date = key.substring((STORAGE_PREFIX + "daily_").length);
      try {
        daily[date] = JSON.parse(localStorage.getItem(key));
      } catch (e) {}
    }
  }

  const data = { settings, logs, groceries, daily };
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ts = new Date().toISOString().slice(0, 10);
  a.download = `night-cut-backup-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

importDataBtn.addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.settings) localStorage.setItem(settingsKey, JSON.stringify(data.settings));
      if (data.logs) localStorage.setItem(LOG_KEY, JSON.stringify(data.logs));
      if (data.groceries)
        localStorage.setItem(GROCERY_KEY, JSON.stringify(data.groceries));
      if (data.daily) {
        Object.keys(data.daily).forEach((date) => {
          localStorage.setItem(
            getDailyKey(date),
            JSON.stringify(data.daily[date])
          );
        });
      }
      importStatusEl.textContent = "Import successful. Reloading view…";
      renderSettings();
      renderGroceries();
      renderLogs();
      renderDashboard(todayISO());
      updateCoachCard();
      importFileInput.value = "";
    } catch (err) {
      console.error(err);
      importStatusEl.textContent = "Import failed: invalid file.";
    }
  };
  reader.readAsText(file);
});

/* =========================================================
   NAVIGATION
   ========================================================= */

const navButtons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("main section");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;
    navButtons.forEach((b) => b.classList.toggle("active", b === btn));
    sections.forEach((sec) => sec.classList.toggle("active", sec.id === target));
  });
});

/* =========================================================
   INIT
   ========================================================= */

(function init() {
  const today = todayISO();
  // Settings & theme first
  renderSettings();
  // Dashboard
  renderDashboard(today);
  // Calendar
  initCalendar();
  // Plan & groceries
  renderPlanOverview();
  renderGroceries();
  // Logs
  logDateEl.value = today;
  renderLogs();
  // Coach & weekly summary
  updateCoachCard();
})();