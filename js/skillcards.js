// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Customize skill category cards
    customizeSkillCards();
});

// Customize skill category cards with emojis and fixed line width
function customizeSkillCards() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    // Define emoji mapping for different categories
    const categoryEmojis = {
        "Programming Languages": "</>",
        "Cloud & DevOps": "☁️",
        "Data Science": "📊",
        "AI & ML": "🧠",
        "LLMs & Generative AI": "🤖",
        "Databases": "🗃️",
        "Web Development": "🌐",
        "Version Control & CI/CD": "⚙️",
        "Tools and Productivity": "🔧"
    };
    
    // Define colors for emojis
    const emojiColors = [
        "#ff7675", // Soft red
        "#74b9ff", // Light blue
        "#55efc4", // Mint green
        "#ffeaa7", // Pale yellow
        "#a29bfe", // Lavender
        "#fd79a8", // Pink
        "#e17055", // Terracotta
        "#00cec9"  // Teal
    ];
    
    // Add CSS for emoji styling
    const style = document.createElement('style');
    style.textContent = `
        .emoji-icon {
            font-size: 1.2em;
            margin-right: 0.5rem;
        }
        
        .skill-level-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 50% !important;
            background: linear-gradient(90deg, var(--primary-color) 0%, transparent 100%);
        }
    `;
    document.head.appendChild(style);
    
    skillCategories.forEach((category, index) => {
        const headerElement = category.querySelector('h3');
        if (!headerElement) return;
        
        // Remove any existing icons (Font Awesome or emojis)
        const existingIcons = headerElement.querySelectorAll('i, .emoji-icon');
        existingIcons.forEach(icon => icon.remove());
        
        // Clean the text to remove any leftover spaces at the beginning
        headerElement.innerHTML = headerElement.innerHTML.trim();
        
        // Add emoji to category header
        const headerText = headerElement.textContent.trim();
        console.log("Processing header:", headerText); // Debug log
        let emojiToUse = null;
        
        // Find matching category
        for (const [categoryName, emoji] of Object.entries(categoryEmojis)) {
            // Use more precise matching by checking if the category name is exactly in the header
            // or if it's a substantial part of the header (to avoid "Web" matching multiple categories)
            const exactMatch = headerText === categoryName;
            const substringMatch = headerText.includes(categoryName) && 
                                  (categoryName.length > 3 || // Avoid matching short strings like "Web" too loosely
                                   headerText.startsWith(categoryName) || 
                                   headerText.endsWith(categoryName));
            
            if (exactMatch || substringMatch) {
                console.log(`  Matched "${categoryName}" → ${emoji}`); // Debug log
                emojiToUse = emoji;
                break;
            }
        }
        
        // If we don't have a specific match, use a unique emoji based on index
        if (!emojiToUse) {
            console.log("  No match found, using fallback based on index", index);
            // Unique emoji set that has enough distinct characters
            const uniqueEmojis = ["🧩", "☁️", "📊", "🧰", "🤖", "🛠️", "🗃️", "🌐", "⚙️", "⏱️", "🔧", "📱", "📡", "🧠", "📈", "🔍", "🔌", "💾", "🔐"];
            emojiToUse = uniqueEmojis[index % uniqueEmojis.length];
            console.log(`  Assigned fallback emoji: ${emojiToUse}`);
        }
        
        // Create emoji span and add it to header
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'emoji-icon';
        emojiSpan.textContent = emojiToUse;
        
        // Set a color from our palette based on index to ensure different colors
        const colorIndex = index % emojiColors.length;
        emojiSpan.style.color = emojiColors[colorIndex];
        
        // Insert at the beginning of the header
        headerElement.insertBefore(emojiSpan, headerElement.firstChild);
        
        // Add or update the blue line indicator
        let indicator = category.querySelector('.skill-level-indicator');
        if (!indicator) {
            // Create the indicator
            indicator = document.createElement('span');
            indicator.className = 'skill-level-indicator';
            headerElement.appendChild(indicator);
        }
    });
} 