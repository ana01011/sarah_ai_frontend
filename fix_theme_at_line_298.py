# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    lines = f.readlines()

# Fix the handleThemeChange function at line 298 (index 297)
# Find line 298 and replace the function
for i in range(297, min(305, len(lines))):  # Check lines 298-305
    if 'const handleThemeChange' in lines[i]:
        # Found it, now replace the entire function
        # Find where the function ends (look for the closing brace)
        end_line = i
        brace_count = 0
        for j in range(i, min(i+10, len(lines))):
            brace_count += lines[j].count('{')
            brace_count -= lines[j].count('}')
            if brace_count == 0 and j > i:
                end_line = j
                break
        
        # Create the new function
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
        
        # Replace lines from i to end_line with new function
        lines[i:end_line+1] = [new_function]
        print(f"✅ Fixed handleThemeChange at line {i+1}")
        break

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.writelines(lines)

print("✅ Theme reload fix applied successfully!")
