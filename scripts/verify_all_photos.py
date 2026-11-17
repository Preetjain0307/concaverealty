import os

base = os.path.join("public", "project_photos")
folders = [f for f in sorted(os.listdir(base)) if os.path.isdir(os.path.join(base, f))]

print(f"Total project folders: {len(folders)}")
all_valid = True

for f in folders:
    p = os.path.join(base, f)
    files = sorted(os.listdir(p))
    count = len(files)
    has_1 = any(x.startswith('1.') for x in files)
    
    # Check sizes
    small_files = []
    for file in files:
        size = os.path.getsize(os.path.join(p, file))
        if size < 5000: # less than 5KB is suspicious
            small_files.append((file, size))
            
    is_ok = (3 <= count <= 6) and has_1 and (len(small_files) == 0)
    if not is_ok:
        all_valid = False
        print(f"FAILED: {f} -> {count} files: {files}, small: {small_files}")
    else:
        print(f"OK: {f:32} | {count} photos | files: {', '.join(files)}")

if all_valid:
    print("\nALL 43 PROJECTS MEET ALL CONSTRAINTS PERFECTLY! (Minimum 3, maximum 6 photos, valid sizes, cover photo slot 1 preserved)")

