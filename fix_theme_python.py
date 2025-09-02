# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Find and replace the handleThemeChange function
for i in range(len(lines)):
    if 'const handleThemeChange = (themeName: string) =>' in lines[i]:
        # Replace the next few lines with the fixed version
        new_function = '''  const handleThemeChange = (themeName: string) => {
    const themeId = themeNameMapping[themeName];
    if (themeId) {
      setTheme(themeId);
      playSound('notification');
      // Reload page after short delay to apply theme
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
'''
        # Find the end of the function (closing brace)
        j = i
        brace_count = 0
        for k in range(i, min(i+20, len(lines))):
            if '{' in lines[k]:
                brace_count += lines[k].count('{')
            if '}' in lines[k]:
                brace_count -= lines[k].count('}')
            if brace_count == 0 and k > i:
                j = k
                break
        
        # Replace the function
        lines[i:j+1] = [new_function + '\n']
        break

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ Fixed handleThemeChange function to reload after theme change")
