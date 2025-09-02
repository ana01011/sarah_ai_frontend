# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Find and remove the reload lines
new_lines = []
skip_lines = False
skip_count = 0

for i, line in enumerate(lines):
    # Skip lines 307-309 (index 306-308)
    if i == 306 and '// Reload page after short delay' in line:
        skip_lines = True
        skip_count = 0
        continue
    
    if skip_lines:
        skip_count += 1
        if skip_count <= 3:  # Skip the setTimeout and its contents
            continue
        else:
            skip_lines = False
    
    new_lines.append(line)

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(new_lines)

print("✅ Removed reload functionality")
