const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
class ArtifactManager {
  constructor() {
    this.sessionId = `AI_Artifacts_${new Date().toISOString().replace(/[:T.]/g, '')}`;
    this.baseDir = path.join(process.cwd(), 'artifacts', this.sessionId);
    this.artifactsDir = path.join(this.baseDir, 'Artifacts');
    this.metadataDir = path.join(this.baseDir, 'Metadata');
    this.databaseDir = path.join(this.baseDir, 'Database');
    this.previewsDir = path.join(this.baseDir, 'Previews');
    this.databaseFile = path.join(this.databaseDir, 'artificial_creations.json');
    this.summaryFile = path.join(this.baseDir, 'session_summary.txt');
    this.artifactCount = 0;

    this.initializeFolders();
  }

  initializeFolders() {
    [this.baseDir, this.artifactsDir, this.metadataDir, this.databaseDir, this.previewsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    if (!fs.existsSync(this.databaseFile)) {
      fs.writeFileSync(this.databaseFile, JSON.stringify([], null, 2));
    }
  }

  saveArtifact(content, type, modelInfo, provider) {
    this.artifactCount++;
    const artifactId = `Artifact_${this.artifactCount.toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    // Save artifact
    const artifactPath = path.join(this.artifactsDir, artifactId);
    fs.writeFileSync(artifactPath, content);

    // Save metadata
    const metadata = {
      artifact_id: artifactId,
      timestamp,
      model_info: modelInfo,
      provider,
      debug_info: {} // Add relevant debug info here
    };
    const metadataPath = path.join(this.metadataDir, `${artifactId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Update database
    const databaseEntry = {
      artifact_id: artifactId,
      file_path: `./Artifacts/${artifactId}`,
      metadata_path: `./Metadata/${artifactId}.json`,
      creation_date: timestamp,
      model: modelInfo,
      provider,
      tags: this.generateTags(content, type),
      description: this.generateDescription(content, type)
    };
    const database = JSON.parse(fs.readFileSync(this.databaseFile, 'utf-8'));
    database.push(databaseEntry);
    fs.writeFileSync(this.databaseFile, JSON.stringify(database, null, 2));

    // Generate preview (placeholder implementation)
    this.generatePreview(artifactId, content, type);

    return artifactId;
  }

  generateTags(content, type) {
    // Implement tag generation logic based on content and type
    return ['AI-generated', type];
  }

  generateDescription(content, type) {
    // Implement description generation logic
    return `AI-generated ${type} artifact`;
  }

  generatePreview(artifactId, content, type) {
    // Placeholder implementation - in a real app, you'd generate actual previews
    const previewPath = path.join(this.previewsDir, `${artifactId}_preview.txt`);
    fs.writeFileSync(previewPath, `Preview of ${type} artifact`);
  }

  generateSessionSummary() {
    const summary = `
      Session ID: ${this.sessionId}
      Total artifacts: ${this.artifactCount}
      Timestamp: ${new Date().toISOString()}
    `;
    fs.writeFileSync(this.summaryFile, summary);
    console.log(`Session summary saved to ${this.summaryFile}`);
  }

  addArtifact(artifact) {
    const { type, model, content } = artifact;
    const provider = this.getProviderFromModel(model);
    
    // Check if the content contains SVG
    const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/);
    if (svgMatch) {
      const svgContent = svgMatch[0];
      this.saveSvgArtifact(svgContent, model, provider);
    }

    // Always save the full content as a regular artifact
    this.saveArtifact(content, type, model, provider);
  }

  saveSvgArtifact(svgContent, modelInfo, provider) {
    this.artifactCount++;
    const artifactId = `SVG_${this.artifactCount.toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    // Save SVG artifact
    const artifactPath = path.join(this.artifactsDir, `${artifactId}.svg`);
    fs.writeFileSync(artifactPath, svgContent);

    // Save metadata
    const metadata = {
      artifact_id: artifactId,
      timestamp,
      model_info: modelInfo,
      provider,
      type: 'svg',
      debug_info: {} // Add relevant debug info here
    };
    const metadataPath = path.join(this.metadataDir, `${artifactId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Update database
    const databaseEntry = {
      artifact_id: artifactId,
      file_path: `./Artifacts/${artifactId}.svg`,
      metadata_path: `./Metadata/${artifactId}.json`,
      creation_date: timestamp,
      model: modelInfo,
      provider,
      type: 'svg',
      tags: ['AI-generated', 'SVG'],
      description: 'AI-generated SVG artifact'
    };
    const database = JSON.parse(fs.readFileSync(this.databaseFile, 'utf-8'));
    database.push(databaseEntry);
    fs.writeFileSync(this.databaseFile, JSON.stringify(database, null, 2));

    console.log(`SVG artifact saved: ${artifactPath}`);
  }
  getProviderFromModel(model) {
    if (model.startsWith('claude-')) {
      return 'anthropic';
    } else if (model.startsWith('gpt-')) {
      return 'openai';
    } else {
      return 'ollama';
    }
  }
}
module.exports = ArtifactManager;
