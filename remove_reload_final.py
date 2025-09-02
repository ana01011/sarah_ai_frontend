# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Remove lines 306-309 (the comment and setTimeout with reload)
# These are index 305-308
lines_to_remove = []
for i in range(305, 310):
    if i < len(lines):
        if 'Reload page' in lines[i] or 'setTimeout' in lines[i] or 'window.location.reload' in lines[i] or '}, 500);' in lines[i]:
            lines_to_remove.append(i)

# Remove lines in reverse order to maintain indices
for i in sorted(lines_to_remove, reverse=True):
    if i < len(lines):
        print(f"Removing line {i+1}: {lines[i].strip()}")
        del lines[i]

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ Removed all reload-related lines")
