#!/usr/bin/env python3
"""Stamp local css/js references with a content hash, to defeat the
one-year immutable cache vercel.json puts on them.

vercel.json serves every .css and .js with `max-age=31536000, immutable`,
which is only safe when the URL changes with the contents. None of these
filenames carry a hash, so a returning visitor keeps the copy their browser
cached — for a year — and never sees a style or script change.

This rewrites every local reference to `file.css?v=<8 hex of its sha256>`,
so the URL moves whenever the bytes do, and stays put when they do not.
Run it after changing anything under css/ or js/, then commit the result:

    python3 tools/stamp-assets.py

Idempotent: running it twice in a row changes nothing.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
REF = re.compile(r'((?:href|src)=")((?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')

def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]

def main() -> int:
    cache: dict[str, str] = {}
    missing: list[str] = []
    changed: list[str] = []

    for page in sorted(ROOT.glob("*.html")):
        src = page.read_text()

        def stamp(m: re.Match) -> str:
            rel = m.group(2)
            if rel not in cache:
                target = ROOT / rel
                if not target.exists():
                    missing.append(f"{page.name} -> {rel}")
                    cache[rel] = ""
                else:
                    cache[rel] = digest(target)
            v = cache[rel]
            return f"{m.group(1)}{rel}{'?v=' + v if v else ''}{m.group(3)}"

        out = REF.sub(stamp, src)
        if out != src:
            page.write_text(out)
            changed.append(page.name)

    for m in missing:
        print(f"  WARNING missing asset: {m}", file=sys.stderr)
    print(f"stamped {len(cache) - len(set(m.split(' -> ')[1] for m in missing))} assets "
          f"across {len(changed)} page(s)" if changed else "already up to date")
    return 1 if missing else 0

if __name__ == "__main__":
    raise SystemExit(main())
