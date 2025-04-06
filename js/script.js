// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handle page loading animation
    handlePageLoading();
    
    // Create background container
    createBackgroundContainer();
    
    // Initialize background animation
    initBackground();
    
    // Start animation loop
    animateFlowingLines();
    
    // Set up parallax scrolling for background
    setupParallaxEffect();
    
    // Create day of life chart if the canvas exists
    const dayChartCanvas = document.getElementById('dayChart');
    if (dayChartCanvas) {
        createDayOfLifeChart();
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            // Get the target section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the section smoothly
            window.scrollTo({
                top: targetSection.offsetTop - 70, // Offset for navbar height
                behavior: 'smooth'
            });
        });
    });
    
    // Highlight active section in navbar
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add active class for styling in CSS
    document.querySelector('nav ul').innerHTML += `
        <style>
            nav ul li a.active {
                color: var(--primary-color);
                font-weight: 600;
                position: relative;
            }
            
            nav ul li a.active::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: var(--primary-color);
                border-radius: 3px;
            }
        </style>
    `;
    
    // Initialize scroll animations for sections
    initScrollAnimations();
    
    // Add hover effects for skill items
    addSkillItemsHoverEffect();
    
    // Add typewriter effect to hero heading
    animateHeroHeading();
});

// Handle page loading animation
function handlePageLoading() {
    const pageTransition = document.querySelector('.page-transition');
    const body = document.body;
    
    // Prevent scrolling while loading
    body.style.overflow = 'hidden';
    
    // Hide the loader after a short delay
    setTimeout(() => {
        pageTransition.classList.add('loaded');
        body.style.overflow = 'auto';
        
        // Remove the loader from the DOM after transition completes
        setTimeout(() => {
            pageTransition.style.display = 'none';
        }, 500);
    }, 1200);
}

// Create the background container
function createBackgroundContainer() {
    const body = document.body;
    
    // Remove any existing pipeline background
    const existingPipeline = document.getElementById('pipelineBg');
    if (existingPipeline) {
        existingPipeline.remove();
    }
    
    // Remove existing background container if it exists
    const existingContainer = document.getElementById('background-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create the container
    const container = document.createElement('div');
    container.id = 'background-container';
    
    // We'll rely on CSS styles for positioning and z-index
    // This ensures consistency with the CSS rules we've defined
    
    // Insert at the beginning of the body
    body.insertBefore(container, body.firstChild);
    
    // Add a noise texture overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.id = 'noise-overlay';
    noiseOverlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
    
    // Insert overlay
    body.insertBefore(noiseOverlay, body.firstChild);
    
    // Global variables for animation tracking
    window.activeLines = [];
    window.backgroundAnimationInterval = null;
    
    // Also set body and html background to match
    document.documentElement.style.backgroundColor = 'var(--dark-color)';
    body.style.backgroundColor = 'var(--dark-color)';
    
    // Ensure background covers entire document, not just viewport
    function updateBackgroundSize() {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        container.style.height = `${docHeight}px`;
        noiseOverlay.style.height = `${docHeight}px`;
    }
    
    // Update size initially and on resize
    updateBackgroundSize();
    window.addEventListener('resize', updateBackgroundSize);
    
    // Also update after content load events might change page height
    window.addEventListener('load', updateBackgroundSize);
    document.addEventListener('DOMContentLoaded', updateBackgroundSize);
    
    console.log("Background container created with ID:", container.id);
}

// Set up parallax scrolling effect for background
function setupParallaxEffect() {
    const container = document.getElementById('background-container');
    
    if (!container) return; // Make sure container exists
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const parallaxRate = scrollPosition * 0.1; // Parallax movement rate (slower than scroll)
        
        // Move the background upward as user scrolls down
        container.style.transform = `translateY(-${parallaxRate}px)`;
        container.style.position = 'fixed';
        container.style.top = '0';
        
        // Update noise overlay to match
        const noiseOverlay = document.getElementById('noise-overlay');
        if (noiseOverlay) {
            noiseOverlay.style.transform = `translateY(-${parallaxRate}px)`;
            noiseOverlay.style.position = 'fixed';
            noiseOverlay.style.top = '0';
        }
    });
    
    // Update background size on page content changes
    function updateBackgroundSize() {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        container.style.height = `${docHeight}px`;
        
        const noiseOverlay = document.getElementById('noise-overlay');
        if (noiseOverlay) {
            noiseOverlay.style.height = `${docHeight}px`;
        }
    }
    
    // Resize event to ensure background covers full document
    window.addEventListener('resize', updateBackgroundSize);
    
    // Call it initially to ensure proper size
    updateBackgroundSize();
}

// Scroll animations
function initScrollAnimations() {
    // Create the IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Add the fade-in class
        section.classList.add('fade-in');
        // Observe the section
        observer.observe(section);
    });
    
    // Add CSS for the animations
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes slide-up {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add hover effects to skill items
function addSkillItemsHoverEffect() {
    const skillItems = document.querySelectorAll('.skill-list li');
    
    // Skill descriptions - brief explanations for each technology
    const skillDescriptions = {
        // Programming Languages
        "Python": "Versatile language for ML, data analysis, and web development. Key for AI/ML due to its rich ecosystem of data science libraries.",
        "YAML": "Human-readable data serialization standard used for configuration files in CI/CD pipelines, Kubernetes, and cloud infrastructure.",
        "Markdown": "Lightweight markup language for creating formatted documentation with plain text, widely used in GitHub and project documentation.",
        "Java": "Robust, object-oriented language powering enterprise applications with 'write once, run anywhere' capability via the JVM.",
        "Kotlin": "Modern JVM language offering concise syntax and null safety, popular for Android development with full Java interoperability.",
        "JavaScript": "Essential web programming language enabling dynamic content and interactivity in browsers, forming the core of modern web development.",
        "TypeScript": "JavaScript superset adding static typing for improved developer experience, enhanced code quality, and enterprise-scale maintainability.",
        
        // Cloud & DevOps
        "Databricks": "Unified analytics platform built on Apache Spark that simplifies big data processing and ML model deployment on cloud platforms.",
        "AWS": "Leading cloud provider with 200+ services for computing, storage, database, ML and analytics, powering millions of applications worldwide.",
        "Docker": "Containerization platform that standardizes application packaging, making software portable across different environments and infrastructure.",
        "Linux": "Open-source OS kernel providing stability and security for servers, embedded systems, and cloud infrastructure worldwide.",
        "Terraform": "Infrastructure as Code tool enabling declarative resource provisioning across all major cloud providers with version-controlled configuration.",
        "Azure": "Microsoft's cloud computing service with integrated tools for app development, ML, analytics, and seamless Microsoft ecosystem integration.",
        "Google Cloud": "Cloud platform emphasizing data analytics, ML, and containers with advanced AI capabilities and a global network infrastructure.",
        
        // Data Science
        "Pandas": "Python data manipulation library providing DataFrame structures for efficient data cleaning, transformation, and analysis workflows.",
        "NumPy": "Fundamental scientific computing package for Python with powerful n-dimensional array objects and mathematical function libraries.",
        "Scikit-learn": "Python ML library featuring consistent API for classification, regression, and clustering with robust preprocessing and model selection tools.",
        "Apache Spark": "Unified distributed computing engine for large-scale data processing, enabling batch, streaming, and machine learning workloads with fault-tolerance.",
        "Power BI": "Microsoft's business analytics platform offering interactive data visualization with drag-and-drop simplicity and AI-powered insights for enterprise reporting.",
        "Matplotlib": "Comprehensive Python visualization library for creating static, animated, and interactive plots with publication-quality output.",
        "Plotly": "Interactive visualization library creating web-based charts and dashboards with easy integration into Python, R, and JavaScript applications.",        
        
        // AI & ML
        "MLflow": "Open-source platform for ML lifecycle management including experiment tracking, reproducible runs, model packaging and registry.",
        "Hugging Face": "AI community platform providing tools, datasets, and pre-trained models for NLP applications with simple API access and fine-tuning capabilities.",
        "PyTorch": "Dynamic deep learning framework emphasizing flexibility and intuitive design with strong GPU acceleration and research community adoption.",
        "TensorFlow": "Google's open-source ML platform supporting deep learning with flexible architecture for deployment across CPUs, GPUs, and TPUs.",
        
        // LLMs & Generative AI
        "OpenAI": "Leading provider of AI models and APIs for natural language processing, including GPT-4, DALL-E, and Whisper.",
        "DeepSeek": "Chinese AI company offering a range of AI models and APIs for natural language processing.",
        "Claude": "AI assistant developed by Anthropic, offering a chat-based interface with advanced reasoning capabilities.",
        "Gemini": "Google's AI model family offering diverse capabilities including search, translation, and image generation.",
        "ollama": "Open-source alternative to OpenAI's API, offering a range of AI models and APIs for natural language processing.",
        
        // Databases
        "PostgreSQL": "Powerful open-source object-relational database with strong SQL compliance, extensive data types, and robust transaction support.",
        "MongoDB": "Document-oriented NoSQL database optimized for flexibility, scalability, and performance with JSON-like document storage and query capabilities.",
        "MySQL": "Popular open-source relational database system known for reliability, performance, and ease of use in web applications and enterprise environments.",
        
        // Web Development
        "Django": "High-level Python web framework emphasizing reusability, rapid development, and the DRY principle with built-in admin interface.",
        "Flask": "Lightweight WSGI web framework in Python designed for rapid development with flexibility, simplicity, and fine-grained control.",
        "React": "JavaScript library for building user interfaces with a component-based architecture, enabling efficient development of dynamic single-page applications.",
        "Streamlit": "Python library for rapidly creating and sharing data apps with minimal code, turning data scripts into shareable web applications.",
        "CSS": "Style sheet language used for describing the presentation of a document written in HTML, controlling layout, colors, and responsive design.",
        
        // Version Control & CI/CD
        "GitLab": "DevOps platform providing version control, CI/CD pipelines, and project management tools in a single integrated application with self-hosting options.",
        "GitHub": "Web-based platform for Git repositories offering collaboration features, issue tracking, CI/CD integration, and extensive community projects.",
        "GitHub Actions": "GitHub's integrated CI/CD solution allowing automated workflow creation directly in repositories for testing, building, and deploying code.",
        
        // Tools & Productivity
        "Jira": "Issue tracking and project management tool by Atlassian designed for agile development teams with customizable workflows and reporting.",
        "Confluence": "Team workspace by Atlassian for creating, sharing, and collaborating on projects, documentation, and company knowledge bases.",
        "Cursor": "AI-powered code editor built on VSCode that enhances productivity with advanced code generation, explanation, and refactoring capabilities.",
        "Figma": "Cloud-based design and prototyping tool enabling collaborative interface design with real-time editing and comprehensive component libraries.",
        "Postman": "API platform for building and using APIs with features for request building, testing, documentation, mocking, and monitoring.",
        "Obsidian": "Knowledge management application using markdown files and graph visualization to create a connected personal knowledge base.",
        "Anaconda": "Python/R distribution platform that simplifies package management and deployment for data science with pre-configured environments.",
    };
    
    // Process each skill item
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Get the skill name and find its description
            const skillName = item.querySelector('.skill-name').textContent;
            const description = skillDescriptions[skillName] || `${skillName} - Technology used in software development`;
            
            // Set the tooltip to show the description
            item.setAttribute('data-tooltip', description);
            
            // Emphasize the filled stars
            const filledStars = item.querySelectorAll('.filled');
            filledStars.forEach(star => {
                star.style.color = 'var(--primary-color)';
                star.style.transform = 'scale(1.2)';
                star.style.transition = 'transform 0.3s ease-out, color 0.3s ease-out';
            });
        });
        
        item.addEventListener('mouseleave', () => {
            // Restore normal state
            const filledStars = item.querySelectorAll('.filled');
            filledStars.forEach(star => {
                star.style.transform = 'scale(1)';
            });
        });
    });
    
    // Calculate average skill level for each category
    updateCategorySkillLines();
}

// Calculate and update the blue line width based on average skill level
function updateCategorySkillLines() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        // Add skill level indicator if needed
        let indicator = category.querySelector('.skill-level-indicator');
        if (!indicator) {
            // Create the indicator
            indicator = document.createElement('span');
            indicator.className = 'skill-level-indicator';
            
            // Append to h3
            const headerElement = category.querySelector('h3');
            if (headerElement) {
                headerElement.appendChild(indicator);
            }
        }
    });
}

// Animate the hero heading with a typewriter effect
function animateHeroHeading() {
    const heroHeading = document.querySelector('.hero-text h2 span');
    if (!heroHeading) return;
    
    const text = heroHeading.textContent;
    heroHeading.textContent = '';
    heroHeading.style.borderRight = '0.08em solid var(--primary-color)';
    heroHeading.style.animation = 'blinkCursor 0.7s steps(1) infinite';
    
    // Add the cursor blink animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blinkCursor {
            50% { border-color: transparent; }
        }
    `;
    document.head.appendChild(style);
    
    // Type out each character
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            heroHeading.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroHeading.style.borderRight = 'none';
                heroHeading.style.animation = 'none';
            }, 1500);
        }
    }, 100);
}

// Background animation functions
function initBackground() {
    console.log("Initializing background animation");
    clearInterval(window.backgroundAnimationInterval);
    const lineContainer = document.getElementById('background-container');
    if (!lineContainer) {
        console.error("Background container not found!");
        return;
    }
    
    lineContainer.innerHTML = '';
    window.activeLines = [];
    
    // Create initial flowing lines - increased to 40
    for (let i = 0; i < 40; i++) {
        createFlowingLine();
    }
    
    console.log(`Created ${window.activeLines.length} initial background lines`);
    
    // Periodically create new lines
    window.backgroundAnimationInterval = setInterval(() => {
        if (window.activeLines.length < 60 && Math.random() < 0.7) {
            createFlowingLine();
        }
    }, 600);
}

function createFlowingLine() {
    const container = document.getElementById('background-container');
    if (!container) {
        console.error("Background container not found when creating line!");
        return;
    }
    
    const containerRect = container.getBoundingClientRect();
    const lineElement = document.createElement('div');
    lineElement.className = 'flowing-line';
    container.appendChild(lineElement);
    
    // Start position can be on any side of the screen
    let startX, startY;
    const side = Math.floor(Math.random() * 4); // 0: left, 1: top, 2: right, 3: bottom
    
    switch (side) {
        case 0: // left
            startX = 0;
            startY = Math.random() * containerRect.height;
            break;
        case 1: // top
            startX = Math.random() * containerRect.width;
            startY = 0;
            break;
        case 2: // right
            startX = containerRect.width;
            startY = Math.random() * containerRect.height;
            break;
        case 3: // bottom
            startX = Math.random() * containerRect.width;
            startY = containerRect.height;
            break;
    }
    
    const speed = Math.random() * 1.5 + 0.7; // pixels per frame, slightly faster
    const maxSegments = Math.floor(Math.random() * 7) + 10; // 10-17 segments
    
    // Pick a color
    const colors = [
        'var(--primary-color)', 
        'var(--secondary-color)', 
        'var(--tertiary-color)',
        'var(--quaternary-color)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Initial direction based on starting side
    let initialDirection;
    switch (side) {
        case 0: initialDirection = 'right'; break;
        case 1: initialDirection = 'down'; break;
        case 2: initialDirection = 'left'; break;
        case 3: initialDirection = 'up'; break;
    }
    
    const line = {
        element: lineElement,
        segments: [],
        currentSegment: 0,
        x: startX,
        y: startY,
        color: color,
        opacity: (Math.random() * 0.3) + 0.3, // 0.3-0.6
        speed: speed,
        direction: initialDirection,
        width: 0,
        height: 0,
        maxSegments: maxSegments,
        completed: false,
        merged: false
    };
    
    // Set initial element properties
    lineElement.style.backgroundColor = color;
    lineElement.style.opacity = line.opacity;
    lineElement.style.left = `${line.x}px`;
    lineElement.style.top = `${line.y}px`;
    
    createLineSegment(line);
    window.activeLines.push(line);
}

function createLineSegment(line) {
    if (line.currentSegment >= line.maxSegments) {
        line.completed = true;
        return;
    }
    
    // Direction logic - more varied for all directions
    if (line.currentSegment === 0) {
        // Keep initial direction for first segment
    } else {
        // For subsequent segments, allow changing direction based on current direction
        const rand = Math.random();
        
        if (line.direction === 'right') {
            if (rand < 0.2) {
                line.direction = 'up';
            } else if (rand < 0.4) {
                line.direction = 'down';
            }
            // Otherwise keep going right
        } else if (line.direction === 'left') {
            if (rand < 0.2) {
                line.direction = 'up';
            } else if (rand < 0.4) {
                line.direction = 'down';
            }
            // Otherwise keep going left
        } else if (line.direction === 'up') {
            if (rand < 0.4) {
                line.direction = Math.random() < 0.5 ? 'right' : 'left';
            }
            // Otherwise keep going up
        } else if (line.direction === 'down') {
            if (rand < 0.4) {
                line.direction = Math.random() < 0.5 ? 'right' : 'left';
            }
            // Otherwise keep going down
        }
    }
    
    // Longer segment lengths for better coverage
    const segmentLength = Math.random() * 250 + 100; // 100-350 pixels
    const container = document.getElementById('background-container');
    const containerRect = container.getBoundingClientRect();
    
    const segment = document.createElement('div');
    segment.className = 'line-segment';
    
    // Set base styles directly to ensure they're applied
    segment.style.position = 'absolute';
    segment.style.backgroundColor = line.color;
    segment.style.opacity = line.opacity;
    segment.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
    segment.style.zIndex = '0';
    segment.style.pointerEvents = 'none';
    
    // Set the start position of the segment
    segment.style.left = `${line.x}px`;
    segment.style.top = `${line.y}px`;
    
    let endX = line.x;
    let endY = line.y;
    
    // Calculate end position based on direction
    if (line.direction === 'right') {
        endX = line.x + segmentLength;
        segment.style.width = '0px'; // Start at 0 and animate to full width
        segment.style.height = '2px';
    } else if (line.direction === 'left') {
        endX = line.x - segmentLength;
        segment.style.width = '0px'; // Start at 0 and animate to full width
        segment.style.height = '2px';
        segment.style.left = `${line.x}px`; // Keep original start position for animation
    } else if (line.direction === 'up') {
        endY = line.y - segmentLength;
        segment.style.width = '2px';
        segment.style.height = '0px'; // Start at 0 and animate to full height
        segment.style.top = `${line.y}px`; // Keep original start position for animation
    } else if (line.direction === 'down') {
        endY = line.y + segmentLength;
        segment.style.width = '2px';
        segment.style.height = '0px'; // Start at 0 and animate to full height
    }
    
    // Boundary checks with more generous limits
    // Allow lines to go 500px beyond viewport in any direction
    if (endX > containerRect.width + 500) {
        endX = containerRect.width + 500;
        segment.style.width = `${endX - line.x}px`;
        line.completed = true;
    } else if (endX < -500) {
        endX = -500;
        segment.style.width = `${line.x - endX}px`;
        segment.style.left = `${endX}px`;
        line.completed = true;
    }
    
    if (endY < -500) {
        endY = -500;
        segment.style.height = `${line.y - endY}px`;
        segment.style.top = `${endY}px`;
        line.completed = true;
    } else if (endY > containerRect.height + 500) {
        endY = containerRect.height + 500;
        segment.style.height = `${endY - line.y}px`;
        line.completed = true;
    }
    
    // Add segment to the container and update line position
    container.appendChild(segment);
    
    // Final width/height values for animation targets
    let finalWidth = 0;
    let finalHeight = 0;
    
    if (line.direction === 'right') {
        finalWidth = Math.abs(endX - line.x);
    } else if (line.direction === 'left') {
        finalWidth = Math.abs(line.x - endX);
        // For left-directed segments, set the left position to the endpoint
        segment.style.left = `${endX}px`;
    } else if (line.direction === 'up') {
        finalHeight = Math.abs(line.y - endY);
        // For up-directed segments, set the top position to the endpoint
        segment.style.top = `${endY}px`;
    } else if (line.direction === 'down') {
        finalHeight = Math.abs(endY - line.y);
    }
    
    // Update segment with animation data
    const segmentData = {
        element: segment,
        direction: line.direction,
        width: finalWidth,
        height: finalHeight,
        progress: 0,
        animationDuration: segmentLength / line.speed
    };
    
    // Force a reflow to ensure styles are applied before animation starts
    segment.offsetHeight;
    
    line.segments.push(segmentData);
    line.currentSegment++;
    
    // Update line's current position
    line.x = endX;
    line.y = endY;
    
    // Log for debugging
    console.log(`Created ${line.direction} segment: ${finalWidth}x${finalHeight}px`);
}

function animateFlowingLines() {
    if (!document.hidden) {
        const container = document.getElementById('background-container');
        if (!container) return; // Exit if container doesn't exist
        
        for (let i = window.activeLines.length - 1; i >= 0; i--) {
            const line = window.activeLines[i];
            
            // Skip if line is undefined or has no segments
            if (!line || !line.segments || line.segments.length === 0) continue;
            
            // If the line is not completed, create a new segment
            if (!line.completed && !line.merged && line.segments.length > 0) {
                const lastSegment = line.segments[line.segments.length - 1];
                
                // If the current segment is fully drawn
                if (lastSegment && lastSegment.progress >= lastSegment.animationDuration) {
                    createLineSegment(line);
                }
            }
            
            // Animate all segments of the line
            for (const segment of line.segments) {
                if (!segment || !segment.element) continue;
                
                if (segment.progress < segment.animationDuration) {
                    // Increment progress
                    segment.progress += 1;
                    
                    // Calculate the visibility percentage
                    const visibilityPercentage = Math.min(1, segment.progress / segment.animationDuration);
                    
                    // Update the segment visibility based on its direction
                    if (segment.direction === 'right') {
                        segment.element.style.width = `${segment.width * visibilityPercentage}px`;
                    } else if (segment.direction === 'left') {
                        const newWidth = segment.width * visibilityPercentage;
                        segment.element.style.width = `${newWidth}px`;
                    } else if (segment.direction === 'up') {
                        const newHeight = segment.height * visibilityPercentage;
                        segment.element.style.height = `${newHeight}px`;
                    } else if (segment.direction === 'down') {
                        segment.element.style.height = `${segment.height * visibilityPercentage}px`;
                    }
                }
            }
            
            // Remove completed lines after a delay
            if (line.completed && line.segments.every(s => s.progress >= s.animationDuration)) {
                // Schedule removal with a delay
                setTimeout(() => {
                    // First fade out
                    for (const segment of line.segments) {
                        if (segment.element && segment.element.parentNode) {
                            segment.element.style.opacity = '0';
                            segment.element.style.transition = 'opacity 0.5s ease';
                        }
                    }
                    
                    // Then remove from DOM
                    setTimeout(() => {
                        const container = document.getElementById('background-container');
                        if (!container) return;
                        
                        if (line.element && line.element.parentNode) {
                            try {
                                for (const segment of line.segments) {
                                    if (segment.element && segment.element.parentNode) {
                                        container.removeChild(segment.element);
                                    }
                                }
                                container.removeChild(line.element);
                                
                                // Remove line from array
                                const index = window.activeLines.indexOf(line);
                                if (index > -1) {
                                    window.activeLines.splice(index, 1);
                                }
                            } catch (e) {
                                console.error('Error removing line elements:', e);
                            }
                        }
                    }, 500);
                }, 3000);
                
                // Mark as fading so we don't try to remove it again
                line.fading = true;
            }
        }
    }
    
    requestAnimationFrame(animateFlowingLines);
}

// Create Day of Life chart
function createDayOfLifeChart() {
    const ctx = document.getElementById('dayChart').getContext('2d');
    
    // Data for the pie chart (hours per activity)
    const data = {
        labels: [
            'Working',
            'Gaming',
            'Studying',
            'Sleeping',
            'Exercising',
            'Time with friends and family'
        ],
        datasets: [{
            data: [8, 3, 2, 7, 1, 3], // Hours per day for each activity
            backgroundColor: [
                '#9575cd', // Working - purple
                '#ba68c8', // Gaming - pink/purple
                '#7986cb', // Studying - blue
                '#673ab7', // Sleeping - deep purple
                '#5e35b1', // Exercising - purple
                '#512da8'  // Time with friends - purple
            ],
            borderColor: '#121212',
            borderWidth: 2,
            hoverOffset: 10
        }]
    };
    
    // Configuration for the pie chart
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '40%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#242424',
                    titleColor: '#f0f0f0',
                    bodyColor: '#e0e0e0',
                    displayColors: false,
                    caretSize: 0,
                    cornerRadius: 4,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} hours`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
} 