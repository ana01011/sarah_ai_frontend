# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Find handleThemeChange and add console logs
for i in range(len(lines)):
    if 'const handleThemeChange' in lines[i]:
        # Add console.log statements
        for j in range(i, min(i+15, len(lines))):
            if 'const themeId = themeNameMapping[themeName];' in lines[j]:
                lines.insert(j+1, '    console.log("Theme change requested:", themeName);\n')
                lines.insert(j+2, '    console.log("Mapped to theme ID:", themeId);\n')
            elif 'setTheme(themeId);' in lines[j]:
                lines.insert(j+1, '      console.log("Called setTheme with:", themeId);\n')
            elif 'window.location.reload()' in lines[j]:
                lines[j] = lines[j].replace('window.location.reload();', 
                    'console.log("Reloading page..."); window.location.reload();')
        break

# Also add logging where theme_changed is checked
for i in range(len(lines)):
    if 'if (data.theme_changed)' in lines[i]:
        lines.insert(i, '      console.log("Response from backend:", data);\n')
        lines.insert(i+2, '        console.log("Theme changed detected:", data.theme_changed);\n')
        break

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ Added debug logging")
