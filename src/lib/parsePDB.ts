export interface CAAtom {
  chainId: string;
  resSeq: number;
  x: number;
  y: number;
  z: number;
}

export interface HelixRange {
  chainId: string;
  startSeq: number;
  endSeq: number;
}

export interface SheetRange {
  chainId: string;
  startSeq: number;
  endSeq: number;
}

export interface ParsedPDB {
  caAtoms: CAAtom[];
  helices: HelixRange[];
  sheets: SheetRange[];
}

export type SecondaryType = "helix" | "sheet" | "coil";

export function parsePDB(text: string): ParsedPDB {
  const lines = text.split("\n");
  const caAtoms: CAAtom[] = [];
  const helices: HelixRange[] = [];
  const sheets: SheetRange[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (line.length < 6) continue;
    const record = line.substring(0, 6).trim();

    if (record === "ATOM") {
      const name = line.substring(12, 16).trim();
      if (name !== "CA") continue;

      // Skip alternate conformations (keep only blank or 'A')
      const altLoc = line.substring(16, 17);
      if (altLoc !== " " && altLoc !== "A") continue;

      const chainId = line.substring(21, 22);
      const resSeq = parseInt(line.substring(22, 26), 10);
      const key = `${chainId}:${resSeq}`;
      if (seen.has(key)) continue;
      seen.add(key);

      caAtoms.push({
        chainId,
        resSeq,
        x: parseFloat(line.substring(30, 38)),
        y: parseFloat(line.substring(38, 46)),
        z: parseFloat(line.substring(46, 54)),
      });
    } else if (record === "HELIX") {
      helices.push({
        chainId: line.substring(19, 20),
        startSeq: parseInt(line.substring(21, 25), 10),
        endSeq: parseInt(line.substring(33, 37), 10),
      });
    } else if (record === "SHEET") {
      sheets.push({
        chainId: line.substring(21, 22),
        startSeq: parseInt(line.substring(22, 26), 10),
        endSeq: parseInt(line.substring(33, 37), 10),
      });
    }
  }

  return { caAtoms, helices, sheets };
}

export function getSecondaryType(
  resSeq: number,
  chainId: string,
  helices: HelixRange[],
  sheets: SheetRange[]
): SecondaryType {
  for (const h of helices) {
    if (h.chainId === chainId && resSeq >= h.startSeq && resSeq <= h.endSeq)
      return "helix";
  }
  for (const s of sheets) {
    if (s.chainId === chainId && resSeq >= s.startSeq && resSeq <= s.endSeq)
      return "sheet";
  }
  return "coil";
}
