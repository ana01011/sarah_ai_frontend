# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Find handleThemeChange and remove ALL duplicates
i = 0
while i < len(lines):
    if 'const handleThemeChange' in lines[i]:
        # Found the start, keep this one
        correct_function = [
            '  const handleThemeChange = (themeName: string) => {\n',
            '    const themeId = themeNameMapping[themeName];\n',
            '    if (themeId) {\n',
            '      setTheme(themeId);\n',
            "      playSound('notification');\n",
            '      // Reload page after short delay to apply theme\n',
            '      setTimeout(() => {\n',
            '        window.location.reload();\n',
            '      }, 500);\n',
            '    }\n',
            '  };\n',
            '\n'
        ]
        
        # Find where to stop removing (next function or const)
        j = i + 1
        while j < len(lines):
            # Stop when we find the next function/const declaration
            if ('const handleSendMessage' in lines[j] or 
                'const handleNewChat' in lines[j] or
                'const loadConversations' in lines[j] or
                'const playSound' in lines[j]):
                break
            j += 1
        
        # Replace everything from i to j with the correct function
        lines[i:j] = correct_function
        print(f"✅ Fixed handleThemeChange, removed lines {i+1} to {j}")
        break
    i += 1

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ All duplicates removed!")
