// ============================================================
//  GPU EXPLORER — Firebase Config & Database Functions
//  firebase.js  (ES module — loaded with type="module")
// ============================================================

// ---- ⚠️  PASTE YOUR CONFIG HERE ----
export const firebaseConfig = {
  apiKey: "AIzaSyA7UbARRsHCQWPIR8-7Vze9PNihD_g4so0",
  authDomain: "gpu-explore-b144d.firebaseapp.com",
  projectId: "gpu-explore-b144d",
  storageBucket: "gpu-explore-b144d.appspot.com",
  messagingSenderId: "166004737192",
  appId: "1:166004737192:web:6f31536717a93c6ef12e9d"
};
// ---- IMPORTS ----
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection, doc,
  addDoc, setDoc, getDocs,
  query, where, orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---- INIT ----
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---- COLLECTION NAMES ----
const COL_SESSIONS = "sessions";   // every individual completed run
const COL_MEMBERS  = "members";    // every member login event
const COL_TEAMS    = "teams";      // best-run aggregate per team

// ============================================================
//  SAVE MEMBER LOGIN
// ============================================================
export async function saveMemberLogin(teamId, memberName) {
  try {
    const ref = doc(db, COL_MEMBERS,
      `${teamId}_${memberName.replace(/\s+/g, '_')}_${Date.now()}`);
    await setDoc(ref, {
      teamId,
      memberName,
      joinedAt: serverTimestamp(),
      completed: false
    });
    console.log("[Firebase] Login saved:", memberName);
    return ref.id;
  } catch (e) {
    console.error("[Firebase] saveMemberLogin:", e);
    return null;
  }
}

// ============================================================
//  SAVE SESSION  (called from final.html after game ends)
// ============================================================
export async function saveSession({ teamId, teamName, memberName, score, timeMs, l1Score, l2Score }) {
  try {
    const timeSec = Math.round(timeMs / 1000);

    // 1. Write individual session document
    const sessionRef = await addDoc(collection(db, COL_SESSIONS), {
      teamId,
      teamName,
      memberName,
      score,
      l1Score,
      l2Score,
      timeSec,
      completedAt: serverTimestamp()
    });

    // 2. Update team aggregate (best score + best time)
    await _upsertTeamAggregate(teamId, teamName, score, timeSec);

    console.log("[Firebase] Session saved:", sessionRef.id);
    return sessionRef.id;
  } catch (e) {
    console.error("[Firebase] saveSession:", e);
    return null;
  }
}

// ============================================================
//  UPSERT TEAM AGGREGATE
//  Reads all sessions for this team, picks best, writes to /teams/{teamId}
// ============================================================
async function _upsertTeamAggregate(teamId, teamName, newScore, newTimeSec) {
  try {
    // Fetch all sessions for this team (single-field query = no compound index needed)
    const q    = query(collection(db, COL_SESSIONS), where("teamId", "==", teamId));
    const snap = await getDocs(q);

    let bestScore = newScore;
    let bestTime  = newTimeSec;
    let plays     = 1;

    snap.forEach(d => {
      plays++;
      const { score, timeSec } = d.data();
      if (
        score > bestScore ||
        (score === bestScore && timeSec < bestTime)
      ) {
        bestScore = score;
        bestTime  = timeSec;
      }
    });

    await setDoc(
      doc(db, COL_TEAMS, teamId),
      { teamId, teamName, bestScore, bestTime, totalPlays: plays, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.error("[Firebase] _upsertTeamAggregate:", e);
  }
}

// ============================================================
//  GET LEADERBOARD (one-time fetch)
//  Sorts client-side → avoids compound index requirement on Firestore
// ============================================================
export async function getLeaderboard() {
  try {
    const snap = await getDocs(collection(db, COL_TEAMS));
    const rows = snap.docs.map(d => d.data());
    return _sortLeaderboard(rows);
  } catch (e) {
    console.error("[Firebase] getLeaderboard:", e);
    return [];
  }
}

// ============================================================
//  LIVE LEADERBOARD (real-time listener)
//  Uses onSnapshot on the entire teams collection.
//  Sorting is done client-side — no compound index needed.
// ============================================================
export function listenLeaderboard(callback) {
  const unsubscribe = onSnapshot(
    collection(db, COL_TEAMS),
    snapshot => {
      const rows = snapshot.docs.map(d => d.data());
      callback(_sortLeaderboard(rows));
    },
    error => {
      console.error("[Firebase] listenLeaderboard error:", error);
      // Fallback: try a one-time fetch
      getLeaderboard().then(callback);
    }
  );
  return unsubscribe;   // caller can call this to stop listening
}

// ============================================================
//  GET ALL SESSIONS FOR ONE TEAM
// ============================================================
export async function getTeamSessions(teamId) {
  try {
    const q    = query(collection(db, COL_SESSIONS), where("teamId", "==", teamId));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0));
  } catch (e) {
    console.error("[Firebase] getTeamSessions:", e);
    return [];
  }
}

// ============================================================
//  GET MEMBER LIST FOR ONE TEAM
// ============================================================
export async function getTeamMembers(teamId) {
  try {
    const q    = query(collection(db, COL_MEMBERS), where("teamId", "==", teamId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error("[Firebase] getTeamMembers:", e);
    return [];
  }
}

// ============================================================
//  INTERNAL SORT HELPER
//  Primary: bestScore DESC   Secondary: bestTime ASC
// ============================================================
function _sortLeaderboard(rows) {
  return rows.slice().sort((a, b) => {
    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
    return a.bestTime - b.bestTime;
  });
}
