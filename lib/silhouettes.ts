// Silhouette manifest for the /process WebGL piece. Initial entry is a fully
// procedural placeholder built from primitives — no GLB. When real models
// arrive, add new entries with `glb` set and the loader code path picks them
// up via useGLTF (added then; currently we don't need drei).
//
// IP guardrail: every named silhouette must be "X-inspired" — mid-engine
// exotic shape that *reads as* the brand without trademarked details (no
// brand-specific badges, light signatures, or grille patterns). The note
// field documents the brief for the artist on each entry.

export type Silhouette = {
  id: "procedural-mid-engine" | "aventador-inspired" | "p1-inspired" | "r8-inspired";
  name: string;
  /** Path to the body-paneled GLB. Undefined means use procedural primitives. */
  glb?: string;
  /** Brief constraint note — preserved here so the manifest doubles as the artist brief. */
  ipNote: string;
  /** Maximum scroll-driven separation distance for panels in disassembled state.
   *  Larger silhouettes (Aventador) want more spread; smaller (R8) want less. */
  spread: number;
};

export const SILHOUETTES: Silhouette[] = [
  {
    id: "procedural-mid-engine",
    name: "Procedural mid-engine placeholder",
    ipNote:
      "Built from primitives — boxes, wedges, cylinders. No real-world IP. Replace with a real silhouette entry when GLB lands.",
    spread: 1.6,
  },
  // Future entries — flip these on as GLBs are produced:
  // {
  //   id: "aventador-inspired",
  //   name: "Mid-engine V12 silhouette",
  //   glb: "/3d/aventador-inspired.glb",
  //   ipNote:
  //     "Mid-engine V12 form. No Y-LED light signature, no badge, no specific grille pattern. Sharp wedge — reads Lambo without being one.",
  //   spread: 1.8,
  // },
];

export const DEFAULT_SILHOUETTE = SILHOUETTES[0];
