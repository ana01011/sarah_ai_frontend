#!/bin/bash

# Backup the original file
cp src/components/AIChat.tsx src/components/AIChat.tsx.backup

# Create a Python script to do the replacement
cat > fix_chat.py << 'PYTHON_EOF'
import re

# Read the file
with open('src/components/AIChat.tsx', 'r') as f:
    content = f.read()

# Define the new handleSendMessage function
new_function = '''const handleSendMessage = async (e?: React.FormEvent) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!inputValue.trim()) return;

  playSound('send');

  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputValue,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    // Call your actual backend API
    const response = await fetch('http://147.93.102.165:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: inputValue,
        agent_role: 'general',
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response:', data);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: data.response,  // Use actual response from backend
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [],  // You can add suggestions if needed
      reactions: [
        { type: '👍', count: 0 },
        { type: '❤️', count: 0 },
        { type: '🚀', count: 0 }
      ]
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    playSound('receive');

  } catch (error) {
    console.error('Failed to get response:', error);
    setIsTyping(false);
    
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Sorry, I encountered an error connecting to the AI service. Please try again.',
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, errorMessage]);
    playSound('receive');
  }
};'''

# Find and replace the handleSendMessage function
# This pattern looks for the function from start to the end of setTimeout block
pattern = r'const handleSendMessage = async \(e\?\: React\.FormEvent\) => \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);\s*\};'

# Check if pattern exists
if re.search(pattern, content):
    # Replace the old function with the new one
    new_content = re.sub(pattern, new_function, content)
    
    # Write the updated content back
    with open('src/components/AIChat.tsx', 'w') as f:
        f.write(new_content)
    
    print("✅ Successfully updated handleSendMessage function!")
else:
    print("⚠️ Could not find the handleSendMessage function with setTimeout. Trying alternative approach...")
    
    # Alternative: Find the function by looking for its signature and replace until the next const
    pattern2 = r'const handleSendMessage = async[^}]*?(?:setTimeout[^}]*?\}, 1500\);\s*\};)'
    
    if re.search(pattern2, content):
        new_content = re.sub(pattern2, new_function, content)
        with open('src/components/AIChat.tsx', 'w') as f:
            f.write(new_content)
        print("✅ Successfully updated handleSendMessage function (alternative method)!")
    else:
        print("❌ Could not find the function. Manual edit required.")

PYTHON_EOF

# Run the Python script
python3 fix_chat.py

# Clean up
rm fix_chat.py

echo ""
echo "File has been updated. Now rebuilding..."

# Rebuild the frontend
npm run build

# Restart PM2
pm2 restart frontend

echo ""
echo "✅ Done! Your chat should now connect to the real backend."
echo "📝 Backup saved as: src/components/AIChat.tsx.backup"
