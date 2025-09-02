# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Find and fix the handleThemeChange function (around line 298)
for i in range(297, min(320, len(lines))):
    if 'const handleThemeChange' in lines[i]:
        # Rebuild the function correctly
        new_function = [
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
        
        # Find where this function ends (look for next const or function)
        end_line = i + 1
        for j in range(i + 1, min(i + 20, len(lines))):
            if 'const ' in lines[j] or 'function ' in lines[j] or 'async ' in lines[j] or 'export ' in lines[j]:
                end_line = j
                break
            # Also stop if we find handleSendMessage which is the next function
            if 'handleSendMessage' in lines[j]:
                end_line = j
                break
        
        # Replace the broken function with the correct one
        lines[i:end_line] = new_function
        print(f"✅ Fixed handleThemeChange function at line {i+1}")
        print(f"   Replaced lines {i+1} to {end_line}")
        break

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ Syntax error fixed!")
