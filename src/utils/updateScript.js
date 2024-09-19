const { execFile } = require('child_process');
const path = require('path');

exports.executeUpdateScript = () => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', '..', 'update_ollama_models.sh');
    execFile('bash', [scriptPath], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing update script: ${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
      }
      console.log(`Script output: ${stdout}`);
      resolve(stdout);
    });
  });
};
