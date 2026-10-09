// Security-rules tests for Dolev.
// Run (from the repo root):
//   firebase emulators:exec --only firestore,storage "node security-tests/rules.test.mjs"
// Every case prints PASS/FAIL; the process exits with code 1 if any case fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, query, where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const env = await initializeTestEnvironment({
  projectId: "demo-dolev-rules",
  firestore: { rules: fs.readFileSync(path.join(root, "firestore.rules"), "utf8"), host: "127.0.0.1", port: 8080 },
  storage: { rules: fs.readFileSync(path.join(root, "storage.rules"), "utf8"), host: "127.0.0.1", port: 9199 },
});

// ---------- seed data (rules disabled) ----------
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, "users/parentA"), { uid: "parentA", role: "patient", firstName: "A" });
  await setDoc(doc(db, "users/parentB"), { uid: "parentB", role: "patient", firstName: "B" });
  await setDoc(doc(db, "users/ther1"), { uid: "ther1", role: "therapist", firstName: "T" });
  await setDoc(doc(db, "users/admin1"), { uid: "admin1", role: "admin", firstName: "M" });
  await setDoc(doc(db, "children/c1"), { parentId: "parentA", therapistId: "ther1", firstName: "Kid" });
  await setDoc(doc(db, "children/c2"), { parentId: "parentB", therapistId: "ther1", firstName: "Kid2" });
  await setDoc(doc(db, "diagnoses/d1"), { childId: "c1", therapistId: "ther1" });
  await setDoc(doc(db, "inquiries/i1"), { fullname: "x", message: "y", status: "pending" });
  const st = ctx.storage();
  await uploadBytes(ref(st, "questionnaires/c1/seed.pdf"), new Uint8Array([1, 2, 3]), { contentType: "application/pdf" });
});

const anon = env.unauthenticatedContext();
const pA = env.authenticatedContext("parentA");
const pB = env.authenticatedContext("parentB");
const th = env.authenticatedContext("ther1");
const ad = env.authenticatedContext("admin1");
const ghost = env.authenticatedContext("ghost"); // Auth account with no users doc

const pdf = new Uint8Array([37, 80, 68, 70]);
const big = new Uint8Array(11 * 1024 * 1024);
const validInquiry = () => ({
  fullname: "Test Parent", email: "p@example.com", phone: "0500000000",
  message: "hello", status: "pending", createdAt: serverTimestamp(),
});

let failures = 0;
async function check(name, expectAllowed, fn) {
  try {
    await (expectAllowed ? assertSucceeds(fn()) : assertFails(fn()));
    console.log("PASS  " + name);
  } catch (e) {
    failures++;
    console.log("FAIL  " + name + "  ->  " + (e?.message || e));
  }
}

// ---------- users ----------
await check("anon cannot read a user", false, () => getDoc(doc(anon.firestore(), "users/parentA")));
await check("parent reads own profile", true, () => getDoc(doc(pA.firestore(), "users/parentA")));
await check("parent cannot read another profile", false, () => getDoc(doc(pA.firestore(), "users/parentB")));
await check("parent cannot list users", false, () => getDocs(collection(pA.firestore(), "users")));
await check("account without profile cannot list users", false, () => getDocs(collection(ghost.firestore(), "users")));
await check("therapist lists users", true, () => getDocs(collection(th.firestore(), "users")));
await check("admin queries staff", true, () => getDocs(query(collection(ad.firestore(), "users"), where("role", "in", ["therapist", "admin"]))));
await check("nobody self-registers as patient", false, () => setDoc(doc(ghost.firestore(), "users/ghost"), { uid: "ghost", role: "patient" }));
await check("nobody self-registers as admin", false, () => setDoc(doc(ghost.firestore(), "users/ghost"), { uid: "ghost", role: "admin" }));
await check("parent cannot change own role", false, () => updateDoc(doc(pA.firestore(), "users/parentA"), { role: "admin" }));
await check("admin cannot write users from browser", false, () => updateDoc(doc(ad.firestore(), "users/parentA"), { firstName: "Z" }));

// ---------- inquiries ----------
await check("anon creates a valid inquiry", true, () => addDoc(collection(anon.firestore(), "inquiries"), validInquiry()));
await check("inquiry with child details", true, () => addDoc(collection(anon.firestore(), "inquiries"), { ...validInquiry(), childFirstName: "K", childLastName: "L", childBirthDate: "2018-05-01" }));
await check("inquiry with extra field rejected", false, () => addDoc(collection(anon.firestore(), "inquiries"), { ...validInquiry(), role: "admin" }));
await check("inquiry with other status rejected", false, () => addDoc(collection(anon.firestore(), "inquiries"), { ...validInquiry(), status: "handled" }));
await check("inquiry with fake createdAt rejected", false, () => addDoc(collection(anon.firestore(), "inquiries"), { ...validInquiry(), createdAt: new Date(2000, 1, 1) }));
await check("parent cannot read inquiries", false, () => getDocs(collection(pA.firestore(), "inquiries")));
await check("therapist cannot read inquiries", false, () => getDocs(collection(th.firestore(), "inquiries")));
await check("admin reads inquiries", true, () => getDocs(collection(ad.firestore(), "inquiries")));
await check("admin cannot edit inquiry from browser", false, () => updateDoc(doc(ad.firestore(), "inquiries/i1"), { status: "handled" }));

// ---------- everything else is API-only ----------
await check("parent cannot read children from browser", false, () => getDoc(doc(pA.firestore(), "children/c1")));
await check("therapist cannot read diagnoses from browser", false, () => getDoc(doc(th.firestore(), "diagnoses/d1")));
await check("admin cannot write diagnoses from browser", false, () => setDoc(doc(ad.firestore(), "diagnoses/d2"), { x: 1 }));

// ---------- storage ----------
await check("parent uploads PDF for own child", true, () => uploadBytes(ref(pA.storage(), "questionnaires/c1/a.pdf"), pdf, { contentType: "application/pdf" }));
await check("parent uploads JPEG for own child", true, () => uploadBytes(ref(pA.storage(), "questionnaires/c1/a.jpg"), pdf, { contentType: "image/jpeg" }));
await check("parent cannot upload for another child", false, () => uploadBytes(ref(pA.storage(), "questionnaires/c2/a.pdf"), pdf, { contentType: "application/pdf" }));
await check("other content type rejected", false, () => uploadBytes(ref(pA.storage(), "questionnaires/c1/a.exe"), pdf, { contentType: "application/x-msdownload" }));
await check("file over 10MB rejected", false, () => uploadBytes(ref(pA.storage(), "questionnaires/c1/big.pdf"), big, { contentType: "application/pdf" }));
await check("anon cannot upload", false, () => uploadBytes(ref(anon.storage(), "questionnaires/c1/x.pdf"), pdf, { contentType: "application/pdf" }));
await check("parent reads own child file", true, () => getBytes(ref(pA.storage(), "questionnaires/c1/seed.pdf")));
await check("other parent cannot read file", false, () => getBytes(ref(pB.storage(), "questionnaires/c1/seed.pdf")));
await check("therapist reads file", true, () => getBytes(ref(th.storage(), "questionnaires/c1/seed.pdf")));
await check("parent cannot overwrite existing file", false, () => uploadBytes(ref(pA.storage(), "questionnaires/c1/seed.pdf"), pdf, { contentType: "application/pdf" }));
await check("nothing outside questionnaires/", false, () => uploadBytes(ref(ad.storage(), "other/x.pdf"), pdf, { contentType: "application/pdf" }));

await env.cleanup();
console.log(failures === 0 ? "\nALL RULE TESTS PASSED" : `\n${failures} RULE TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
