import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/sem1_full_drive_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

for code, data in catalog.items():
    print(f"\n==========================================")
    print(f"Subject: {code} - {data['name']}")
    print(f"Google Drive Link: https://drive.google.com/drive/folders/{data['id']}")
    print(f"Direct Files ({len(data['direct_items'])}):")
    for f in data['direct_items']:
        print(f"  - {f['title']}: https://drive.google.com/file/d/{f['id']}/view")
    print(f"Subfolders ({len(data['subfolders'])}):")
    for sname, sinfo in data['subfolders'].items():
        print(f"  [Folder] {sname} ({len(sinfo['items'])} items): https://drive.google.com/drive/folders/{sinfo['id']}")
        for f in sinfo['items']:
            print(f"     * {f['title']} (https://drive.google.com/file/d/{f['id']}/view)")
