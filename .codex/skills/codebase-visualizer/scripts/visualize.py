import os
import json
import argparse
import webbrowser
from pathlib import Path

def get_file_info(path):
    """Get size and type info for a file."""
    try:
        stat = os.stat(path)
        size = stat.st_size
        ext = Path(path).suffix.lower() or 'no-ext'
        return {'size': size, 'ext': ext}
    except Exception:
        return {'size': 0, 'ext': 'unknown'}

def scan_directory(root_path):
    """Recursively scan directory structure."""
    structure = {'name': os.path.basename(root_path) or root_path, 'type': 'dir', 'children': []}
    
    try:
        with os.scandir(root_path) as entries:
            for entry in sorted(entries, key=lambda e: (not e.is_dir(), e.name.lower())):
                if entry.name.startswith('.') or entry.name == '__pycache__':
                    continue
                    
                if entry.is_dir(follow_symlinks=False):
                    child = scan_directory(entry.path)
                    if child:
                        structure['children'].append(child)
                else:
                    info = get_file_info(entry.path)
                    structure['children'].append({
                        'name': entry.name,
                        'type': 'file',
                        'size': info['size'],
                        'ext': info['ext']
                    })
    except PermissionError:
        pass
        
    return structure

def generate_html(data):
    """Generate interactive HTML visualization."""
    return f"""
<!DOCTYPE html>
<html>
<head>
    <title>Codebase Map</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; display: flex; height: 100vh; }}
        #sidebar {{ width: 300px; background: #f5f5f7; border-right: 1px solid #ddd; padding: 20px; box-shadow: 2px 0 5px rgba(0,0,0,0.05); overflow-y: auto; }}
        #main {{ flex: 1; padding: 40px; overflow-y: auto; background: #fff; }}
        .node {{ margin-left: 20px; }}
        .folder {{ cursor: pointer; user-select: none; display: flex; align-items: center; padding: 4px 0; }}
        .folder:hover {{ color: #0066cc; }}
        .folder::before {{ content: '📁'; margin-right: 8px; font-size: 1.2em; }}
        .file {{ margin-left: 24px; padding: 2px 0; color: #555; display: flex; justify-content: space-between; font-size: 0.9em; }}
        .file::before {{ content: '📄'; margin-right: 8px; }}
        .hidden {{ display: none; }}
        .size {{ color: #999; font-size: 0.85em; margin-left: 10px; }}
        h1 {{ margin-top: 0; color: #333; }}
        .stat-card {{ background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .bar-container {{ margin-top: 10px; }}
        .bar-row {{ display: flex; align-items: center; margin-bottom: 4px; font-size: 0.85em; }}
        .bar-label {{ width: 60px; }}
        .bar {{ height: 8px; background: #0066cc; border-radius: 4px; }}
    </style>
</head>
<body>
    <div id="sidebar">
        <div class="stat-card">
            <h3>Summary</h3>
            <div id="stats">Loading...</div>
        </div>
        <div class="stat-card">
            <h3>File Types</h3>
            <div id="type-chart"></div>
        </div>
    </div>
    <div id="main">
        <h1>Codebase Structure</h1>
        <div id="tree"></div>
    </div>

    <script>
        const data = {json.dumps(data)};
        
        function formatSize(bytes) {{
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }}

        function buildTree(node, container) {{
            const el = document.createElement('div');
            el.className = 'node';
            
            if (node.type === 'dir') {{
                const title = document.createElement('div');
                title.className = 'folder';
                title.textContent = node.name;
                
                const childrenContainer = document.createElement('div');
                // Auto-expand mostly root, collapse deep
                if (depth > 2) childrenContainer.classList.add('hidden');
                
                title.onclick = () => childrenContainer.classList.toggle('hidden');
                
                el.appendChild(title);
                el.appendChild(childrenContainer);
                
                // Sort folders top
                node.children.sort((a, b) => (a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1));
                
                node.children.forEach(child => {{
                    depth++;
                    buildTree(child, childrenContainer);
                    depth--;
                }});
            }} else {{
                const file = document.createElement('div');
                file.className = 'file';
                file.innerHTML = `<span>${{node.name}}</span><span class="size">${{formatSize(node.size)}}</span>`;
                el.appendChild(file);
            }}
            
            container.appendChild(el);
        }}

        // Stats calculation
        let totalFiles = 0;
        let totalSize = 0;
        const typeStats = {{}};

        function calculateStats(node) {{
            if (node.type === 'file') {{
                totalFiles++;
                totalSize += node.size;
                typeStats[node.ext] = (typeStats[node.ext] || 0) + 1;
            }} else if (node.children) {{
                node.children.forEach(calculateStats);
            }}
        }}

        // Init
        let depth = 0;
        calculateStats(data);
        buildTree(data, document.getElementById('tree'));
        
        document.getElementById('stats').innerHTML = `
            Files: ${{totalFiles}}<br>
            Size: ${{formatSize(totalSize)}}
        `;

        const sortedTypes = Object.entries(typeStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
            
        const maxType = sortedTypes[0][1];
        
        document.getElementById('type-chart').innerHTML = sortedTypes.map(([ext, count]) => `
            <div class="bar-row">
                <span class="bar-label">${{ext}}</span>
                <div class="bar" style="width: ${{count/maxType * 100}}px"></div>
                <span style="margin-left:8px">${{count}}</span>
            </div>
        `).join('');
    </script>
</body>
</html>
"""

def main():
    parser = argparse.ArgumentParser(description='Generate codebase visualization')
    parser.add_argument('path', nargs='?', default='.', help='Root path to generate map for')
    args = parser.parse_args()
    
    root_path = os.path.abspath(args.path)
    print(f"Scanning {{root_path}}...")
    
    data = scan_directory(root_path)
    html_content = generate_html(data)
    
    output_path = os.path.join(os.getcwd(), 'codebase-map.html')
    with open(output_path, 'w') as f:
        f.write(html_content)
        
    print(f"Map generated at: {{output_path}}")
    webbrowser.open('file://' + output_path)

if __name__ == '__main__':
    main()
