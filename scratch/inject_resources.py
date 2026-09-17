import json

# Load generated resources
with open('scratch/generated_resources.json', 'r', encoding='utf-8') as f:
    gdrive_resources = json.load(f)

# Format as TypeScript objects
ts_entries = []
for r in gdrive_resources:
    mod_line = f"    moduleId: '{r['moduleId']}',\n" if r.get('moduleId') else ""
    tags_str = ", ".join([f"'{t}'" for t in r.get('tags', [])])
    ts_entry = f"""  {{
    id: '{r['id']}',
    subjectId: '{r['subjectId']}',
{mod_line}    title: {json.dumps(r['title'])},
    type: '{r['type']}',
    filePath: '{r['filePath']}',
    fileName: {json.dumps(r['fileName'])},
    academicYear: '{r['academicYear']}',
    scheme: '{r['scheme']}',
    uploaderName: '{r['uploaderName']}',
    isVerified: true,
    downloadsCount: {r['downloadsCount']},
    tags: [{tags_str}],
    createdAt: '{r['createdAt']}',
  }},"""
    ts_entries.append(ts_entry)

new_resources_block = "\n".join(ts_entries)

# Read somaiya-data.ts
with open('src/lib/somaiya-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = "export const INITIAL_RESOURCES: AcademicResource[] = ["
if target in content:
    updated_content = content.replace(target, f"{target}\n  // --- Google Drive Sem 1 Verified Notes & Resources ---\n{new_resources_block}\n")
    with open('src/lib/somaiya-data.ts', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("Successfully injected Google Drive resources into somaiya-data.ts!")
else:
    print("Target not found in somaiya-data.ts!")
