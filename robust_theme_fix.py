# Read the file
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'r') as f:
    content = f.read()

# Find and replace the theme checking section
old_check = '''      if (data.theme_changed) {
        console.log("Theme changed detected:", data.theme_changed);
        handleThemeChange(data.theme_changed);
      }'''

new_check = '''      // Check for theme change in multiple places
      let themeToApply = null;
      
      // Check direct theme_changed field
      if (data.theme_changed) {
        themeToApply = data.theme_changed;
        console.log("Theme changed (direct):", themeToApply);
      }
      
      // Check in user_context.theme_action
      if (data.user_context && data.user_context.theme_action) {
        // Extract theme name from "Switched to [Theme Name]"
        const match = data.user_context.theme_action.match(/Switched to (.+)/);
        if (match) {
          themeToApply = match[1];
          console.log("Theme changed (from context):", themeToApply);
        }
      }
      
      // Apply theme if found
      if (themeToApply) {
        console.log("Applying theme:", themeToApply);
        handleThemeChange(themeToApply);
      }'''

content = content.replace(old_check, new_check)

# Write back
with open('/root/sarah_ai_frontend/src/components/AIChat.tsx', 'w') as f:
    f.write(content)

print("✅ Added robust theme detection")
