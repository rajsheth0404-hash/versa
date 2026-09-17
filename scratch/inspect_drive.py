import urllib.request
import re
import json
import time
import sys

# Ensure UTF-8 output if possible
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fetch_folder_items(folder_id):
    url = f"https://drive.google.com/drive/folders/{folder_id}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract folder or file items
            pattern = r'\\x5b\\x22([a-zA-Z0-9_-]{20,50})\\x22,\\x5b\\x22[a-zA-Z0-9_-]{20,50}\\x22\\x5d,\\x22(.*?)\\x22(?:,\\x22(.*?)\\x22)?'
            matches = re.findall(pattern, html)
            items = []
            seen = set()
            for item_id, title, mime in matches:
                title = title.replace('\\/', '/')
                try:
                    title = bytes(title, 'utf-8').decode('unicode_escape', errors='ignore')
                except:
                    pass
                if item_id in seen or not title or title.startswith('http'):
                    continue
                seen.add(item_id)
                is_folder = 'folder' in (mime or '') or (not '.' in title)
                items.append({
                    'id': item_id,
                    'title': title,
                    'is_folder': is_folder,
                    'mime': mime
                })
            return items
    except Exception as e:
        print(f"Error fetching folder {folder_id}: {e}")
        return []

sem1_subjects = [
    {"code": "AM-1", "name": "Applied Mathematics - I", "id": "15fAcQWYUkYCvxC70hvyEKgLylykQPYYa"},
    {"code": "BE", "name": "Basic Electronics", "id": "1a9aC61SdNhfT7m2-xviDYNAtWeSAUFzr"},
    {"code": "BEE", "name": "Basic Electrical Engineering", "id": "1xqPi9bmThNNmTuz7rnbtA293WD_Sb6a_"},
    {"code": "EC", "name": "Engineering Chemistry", "id": "1-KQRv2MT7XW9KJVrDnJ98Ey9JKASSCMi"},
    {"code": "ED", "name": "Engineering Drawing", "id": "1YYlq9MPoPa430XBUpJAsIHbn00HJ2Zzl"},
    {"code": "EP", "name": "Engineering Physics", "id": "1RdTJhQmbOgBiEvUTTJB3OjvXoYiPBwhD"},
    {"code": "SPM", "name": "Structured Programming Methodology", "id": "1Mf21AaFpLEVvYNO0KEex0KUPyJuAz_oK"}
]

full_structure = {}

for subj in sem1_subjects:
    print(f"\nScanning {subj['code']} - {subj['name']}...")
    subj_items = fetch_folder_items(subj['id'])
    subj_data = {
        'id': subj['id'],
        'name': subj['name'],
        'direct_items': [],
        'subfolders': {}
    }
    
    for item in subj_items:
        if item['is_folder']:
            print(f"  [Folder] {item['title']} ({item['id']})")
            sub_items = fetch_folder_items(item['id'])
            subj_data['subfolders'][item['title']] = {
                'id': item['id'],
                'items': sub_items
            }
            for si in sub_items:
                print(f"     [File] {si['title']} ({si['id']})")
            time.sleep(0.15)
        else:
            print(f"  [File] {item['title']} ({item['id']})")
            subj_data['direct_items'].append(item)
            
    full_structure[subj['code']] = subj_data
    time.sleep(0.2)

with open('scratch/sem1_full_drive_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(full_structure, f, indent=2, ensure_ascii=False)

print("\nFinished crawling all Sem 1 folders! Saved to scratch/sem1_full_drive_catalog.json")
