with open('src/lib/somaiya-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "export const INITIAL_RESOURCES: AcademicResource[] = ["
end_marker = "export const INITIAL_YOUTUBE_RESOURCES: YouTubeResource[] = ["

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + "export const INITIAL_RESOURCES: AcademicResource[] = [];\n\n" + content[end_idx:]
    with open('src/lib/somaiya-data.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully cleared all notes from INITIAL_RESOURCES in somaiya-data.ts!")
else:
    print(f"Markers not found: start_idx={start_idx}, end_idx={end_idx}")
