# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    content = f.read()

# Find the handleThemeChange function and add the reload
import re

# Pattern to find the function
pattern = r'(const handleThemeChange = \(themeName: string\) => \{[^}]+)(playSound\(\'notification\'\);)([^}]*\})'

# Check if pattern exists
if re.search(pattern, content):
    # Replace with the fixed version
    replacement = r'\1\2\n      // Reload page after short delay to apply theme\n      setTimeout(() => {\n        window.location.reload();\n      }, 500);\3'
    content = re.sub(pattern, replacement, content)
    print("✅ Added reload to handleThemeChange")
else:
    # Try simpler approach - just add the line after playSound('notification')
    if "playSound('notification');" in content and "handleThemeChange" in content:
        # Find the specific playSound within handleThemeChange context
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'handleThemeChange' in line:
                # Found the function, now find playSound within next 10 lines
                for j in range(i, min(i+10, len(lines))):
                    if "playSound('notification');" in lines[j]:
                        # Add the reload after this line
                        indent = len(lines[j]) - len(lines[j].lstrip())
                        reload_code = ' ' * indent + '// Reload page after short delay to apply theme\n'
                        reload_code += ' ' * indent + 'setTimeout(() => {\n'
                        reload_code += ' ' * (indent + 2) + 'window.location.reload();\n'
                        reload_code += ' ' * indent + '}, 500);'
                        lines[j] = lines[j] + '\n' + reload_code
                        content = '\n'.join(lines)
                        print("✅ Added reload after playSound")
                        break
                break

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.write(content)

print("File updated successfully")
