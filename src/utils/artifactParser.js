export function parseArtifacts(content) {
  const artifacts = [];
  let currentArtifact = { html: '', css: '', js: '' };

  const htmlRegex = /```(?:html|xml)\s*([\s\S]*?)\s*```/gi;
  const cssRegex = /```css\s*([\s\S]*?)\s*```/gi;
  const jsRegex = /```javascript\s*([\s\S]*?)\s*```/gi;
  const svgRegex = /<svg[\s\S]*?<\/svg>/gi;

  let match;

  while ((match = htmlRegex.exec(content)) !== null) {
    if (currentArtifact.html) {
      artifacts.push({ ...currentArtifact });
      currentArtifact = { html: '', css: '', js: '' };
    }
    currentArtifact.html = match[1];
  }

  while ((match = cssRegex.exec(content)) !== null) {
    currentArtifact.css = match[1];
  }

  while ((match = jsRegex.exec(content)) !== null) {
    currentArtifact.js = match[1];
  }

  while ((match = svgRegex.exec(content)) !== null) {
    if (currentArtifact.html) {
      artifacts.push({ ...currentArtifact });
      currentArtifact = { html: '', css: '', js: '' };
    }
    currentArtifact.html = match[0];
  }

  if (currentArtifact.html || currentArtifact.css || currentArtifact.js) {
    artifacts.push(currentArtifact);
  }

  return artifacts;
}
