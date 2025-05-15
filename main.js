document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and parse README.md content
    try {
        const response = await fetch('https://raw.githubusercontent.com/jaykmarBCET/mybook/main/README.md');
        const markdown = await response.text();
        const content = parseMarkdown(markdown);
        document.getElementById('content-container').innerHTML = content;
        
        // Initialize Prism.js for code highlighting
        Prism.highlightAll();
        
        // Add smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error loading documentation:', error);
        document.getElementById('content-container').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Documentation</h2>
                <p>Please check your internet connection and try again.</p>
            </div>
        `;
    }
});

function parseMarkdown(markdown) {
    // Convert markdown to HTML
    let html = markdown
        // Headers
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 id="$1">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 id="$1">$1</h3>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            return `<pre><code class="language-${language || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
        })
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Lists
        .replace(/^\s*[-*+]\s+(.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Paragraphs
        .replace(/^\s*(\n)?(.+)/gm, function(m) {
            return /\<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
        })
        
        // Line breaks
        .replace(/\n/g, '<br />');

    // Process API documentation
    html = processApiDocs(html);
    
    // Process environment variables
    html = processEnvVars(html);
    
    // Process screenshots
    html = processScreenshots(html);

    return html;
}

function processApiDocs(html) {
    // Convert API documentation to styled blocks
    return html.replace(
        /<h3>([A-Z]+) (.*?)<\/h3>\s*<p>(.*?)<\/p>/g,
        (match, method, endpoint, description) => {
            return `
                <div class="api-endpoint">
                    <span class="endpoint-method ${method.toLowerCase()}">${method}</span>
                    <code>${endpoint}</code>
                    <p>${description}</p>
                </div>
            `;
        }
    );
}

function processEnvVars(html) {
    // Convert environment variables to styled blocks
    return html.replace(
        /<pre><code class="language-env">([\s\S]*?)<\/code><\/pre>/g,
        (match, content) => {
            const formattedContent = content
                .split('\n')
                .map(line => {
                    if (line.startsWith('#')) {
                        return `<div class="env-comment">${line}</div>`;
                    }
                    return `<div>${line}</div>`;
                })
                .join('');
            
            return `<div class="env-block">${formattedContent}</div>`;
        }
    );
}

function processScreenshots(html) {
    // Convert screenshots to styled grid
    return html.replace(
        /<h3>(.*?)<\/h3>\s*<img src="(.*?)" alt="(.*?)">/g,
        (match, title, src, alt) => {
            return `
                <div class="screenshot">
                    <img src="${src}" alt="${alt}">
                    <div class="screenshot-caption">${title}</div>
                </div>
            `;
        }
    );
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add active state to navigation
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}); 