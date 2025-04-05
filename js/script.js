// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
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
});

// Create the background container
function createBackgroundContainer() {
    const body = document.body;
    
    // Remove any existing pipeline background
    const existingPipeline = document.getElementById('pipelineBg');
    if (existingPipeline) {
        existingPipeline.remove();
    }
    
    // Create the container
    const container = document.createElement('div');
    container.id = 'background-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    
    // Set a dark background gradient
    container.style.background = 'var(--background-color)';
    
    // Insert at the beginning of the body
    body.insertBefore(container, body.firstChild);
    
    // Global variables for animation tracking
    window.activeLines = [];
    window.backgroundAnimationInterval = null;
}

// Set up parallax scrolling effect for background
function setupParallaxEffect() {
    const container = document.getElementById('background-container');
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const parallaxRate = scrollPosition * 0.1;
        
        // Move the background upward as user scrolls down
        container.style.transform = `translateY(-${parallaxRate}px)`;
    });
}

// Background animation functions
function initBackground() {
    clearInterval(backgroundAnimationInterval);
    const lineContainer = document.getElementById('background-container');
    lineContainer.innerHTML = '';
    activeLines = [];
    
    // Create initial flowing lines - increased from 8 to 12
    for (let i = 0; i < 12; i++) {
        createFlowingLine();
    }
    
    // Periodically create new lines - increased max lines from 15 to 25 and probability from 0.3 to 0.5
    backgroundAnimationInterval = setInterval(() => {
        if (activeLines.length < 25 && Math.random() < 0.5) {
            createFlowingLine();
        }
    }, 1000);
}

function createFlowingLine() {
    const container = document.getElementById('background-container');
    const containerRect = container.getBoundingClientRect();
    const lineElement = document.createElement('div');
    lineElement.className = 'flowing-line';
    container.appendChild(lineElement);
    
    // Always start from the left side at a random y position
    const startY = Math.random() * (containerRect.height - 100) + 50;
    const speed = Math.random() * 1.5 + 0.5; // pixels per frame
    const maxSegments = Math.floor(Math.random() * 5) + 8; // Increased from 5-10 to 8-13 segments
    
    // Pick a color
    const colors = [
        'var(--primary-color)', 
        'var(--secondary-color)', 
        'var(--tertiary-color)',
        'var(--quaternary-color)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const line = {
        element: lineElement,
        segments: [],
        currentSegment: 0,
        x: 0,
        y: startY,
        color: color,
        opacity: (Math.random() * 0.3) + 0.3, // 0.3-0.6
        speed: speed,
        direction: 'right', // Start moving right
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
    activeLines.push(line);
}

function createLineSegment(line) {
    if (line.currentSegment >= line.maxSegments) {
        line.completed = true;
        return;
    }
    
    // For the initial segment, always move right
    if (line.currentSegment === 0) {
        line.direction = 'right';
    } else {
        // For subsequent segments, only change direction 90 degrees
        // If moving horizontally, can only change to up or down
        // If moving vertically, can only change to right
        if (line.direction === 'right') {
            // When moving right, can change to up or down or continue right
            // Reduced chance to change direction to favor right movement
            const rand = Math.random();
            if (rand < 0.2) {
                line.direction = 'up';
            } else if (rand < 0.4) {
                line.direction = 'down';
            }
            // Otherwise keep going right
        } else {
            // When moving up or down, can only change to right
            if (Math.random() < 0.8) { // Increased chance to go right from 0.7 to 0.8
                line.direction = 'right';
            }
            // Otherwise keep going in the same vertical direction
        }
    }
    
    // Increased segment length for longer lines
    const segmentLength = Math.random() * 200 + 100; // 100-300 pixels (was 50-200)
    const container = document.getElementById('background-container');
    const containerRect = container.getBoundingClientRect();
    
    const segment = document.createElement('div');
    segment.className = 'line-segment';
    segment.style.position = 'absolute';
    segment.style.backgroundColor = line.color;
    segment.style.opacity = line.opacity;
    segment.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
    segment.style.zIndex = '0';
    
    // Set the start position of the segment
    segment.style.left = `${line.x}px`;
    segment.style.top = `${line.y}px`;
    
    let endX = line.x;
    let endY = line.y;
    
    // Calculate end position based on direction
    if (line.direction === 'right') {
        endX = line.x + segmentLength;
        segment.style.width = `${segmentLength}px`;
        segment.style.height = '2px';
    } else if (line.direction === 'up') {
        endY = line.y - segmentLength;
        segment.style.width = '2px';
        segment.style.height = `${segmentLength}px`;
        // For vertical segments, we need to adjust the start position to the top
        segment.style.top = `${endY}px`;
    } else if (line.direction === 'down') {
        endY = line.y + segmentLength;
        segment.style.width = '2px';
        segment.style.height = `${segmentLength}px`;
    }
    
    // Boundary checks - now we don't restrict the right boundary to let lines go all the way to the edge
    // Only check if we're going beyond the container width for cleanup purposes
    if (endX > containerRect.width + 300) { // Allow to go 300px beyond viewport
        endX = containerRect.width + 300;
        segment.style.width = `${endX - line.x}px`;
        
        // If we've reached far beyond the right edge, mark as completed
        line.completed = true;
    }
    
    if (endY < 0) {
        endY = 20;
        segment.style.height = `${line.y - endY}px`;
        segment.style.top = `${endY}px`;
    } else if (endY > containerRect.height) {
        endY = containerRect.height - 20;
        segment.style.height = `${endY - line.y}px`;
    }
    
    // Update line position for next segment
    line.x = endX;
    line.y = endY;
    
    // Store segment properties for animation
    const segmentObj = {
        element: segment,
        startX: parseFloat(segment.style.left),
        startY: parseFloat(segment.style.top),
        width: parseFloat(segment.style.width || 0),
        height: parseFloat(segment.style.height || 0),
        direction: line.direction,
        progress: 0,
        animationDuration: segmentLength / line.speed // Duration based on length and speed
    };
    
    line.segments.push(segmentObj);
    container.appendChild(segment);
    
    // Check for potential merges with other lines
    checkForPotentialMerges(line);
    
    line.currentSegment++;
}

function checkForPotentialMerges(line) {
    if (line.merged) return;
    
    for (const otherLine of activeLines) {
        if (line === otherLine || otherLine.merged) continue;
        
        const distance = Math.sqrt(Math.pow(line.x - otherLine.x, 2) + Math.pow(line.y - otherLine.y, 2));
        
        if (distance < 15 && Math.random() < 0.5) {
            // Merge the lines - make this line continue from the other line's position
            line.x = otherLine.x;
            line.y = otherLine.y;
            line.direction = otherLine.direction;
            
            // Mark the other line as merged so it stops growing
            otherLine.merged = true;
            otherLine.completed = true;
            
            // Create a visual merge point
            createMergePoint(line.x, line.y, line.color);
            break;
        }
    }
}

function createMergePoint(x, y, color) {
    const container = document.getElementById('background-container');
    const mergePoint = document.createElement('div');
    mergePoint.className = 'merge-point';
    mergePoint.style.position = 'absolute';
    mergePoint.style.width = '4px';
    mergePoint.style.height = '4px';
    mergePoint.style.borderRadius = '50%';
    mergePoint.style.backgroundColor = color;
    mergePoint.style.left = `${x - 2}px`;
    mergePoint.style.top = `${y - 2}px`;
    mergePoint.style.boxShadow = `0 0 8px ${color}`;
    mergePoint.style.zIndex = '1';
    container.appendChild(mergePoint);
    
    // Remove the merge point after animation
    setTimeout(() => {
        mergePoint.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(mergePoint);
        }, 500);
    }, 1500);
}

function animateFlowingLines() {
    if (!document.hidden) {
        for (let i = activeLines.length - 1; i >= 0; i--) {
            const line = activeLines[i];
            
            // If the line is not completed, create a new segment
            if (!line.completed && !line.merged && line.segments.length > 0) {
                const lastSegment = line.segments[line.segments.length - 1];
                
                // If the current segment is fully drawn
                if (lastSegment.progress >= lastSegment.animationDuration) {
                    createLineSegment(line);
                }
            }
            
            // Animate all segments of the line
            for (const segment of line.segments) {
                if (segment.progress < segment.animationDuration) {
                    // Increment progress
                    segment.progress += 1;
                    
                    // Calculate the visibility percentage
                    const visibilityPercentage = Math.min(1, segment.progress / segment.animationDuration);
                    
                    // Update the segment visibility based on its direction
                    if (segment.direction === 'right') {
                        segment.element.style.width = `${segment.width * visibilityPercentage}px`;
                    } else if (segment.direction === 'up' || segment.direction === 'down') {
                        segment.element.style.height = `${segment.height * visibilityPercentage}px`;
                    }
                }
            }
            
            // Remove completed lines after a delay
            if (line.completed && line.segments.every(s => s.progress >= s.animationDuration)) {
                setTimeout(() => {
                    for (const segment of line.segments) {
                        if (segment.element.parentNode) {
                            segment.element.style.opacity = '0';
                        }
                    }
                    
                    setTimeout(() => {
                        if (line.element.parentNode) {
                            const container = document.getElementById('background-container');
                            for (const segment of line.segments) {
                                if (segment.element.parentNode) {
                                    container.removeChild(segment.element);
                                }
                            }
                            container.removeChild(line.element);
                            activeLines.splice(activeLines.indexOf(line), 1);
                        }
                    }, 500);
                }, 3000);
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