"""Git patch parser to identify lines added in PR diff."""

import re


def parse_patch_added_lines(patch: str) -> set[int]:
    added_lines: set[int] = set()
    current_line = 0

    for line in patch.splitlines():
        if line.startswith("@@"):
            match = re.search(r"\+(\d+)(?:,(\d+))?", line)
            if match:
                current_line = int(match.group(1))
        elif line.startswith("+") and not line.startswith("+++"):
            if current_line > 0:
                added_lines.add(current_line)
                current_line += 1
        elif line.startswith("-") and not line.startswith("---"):
            continue
        elif line.startswith(" ") or line == "" or line.startswith("\\"):
            if current_line > 0:
                current_line += 1

    return added_lines
