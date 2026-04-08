const fs = require('fs');
const lines = fs.readFileSync('components/OperationalDecisionCenter.tsx', 'utf8').split('\n');
const newLines = [...lines.slice(0, 280), ...lines.slice(1834)];
fs.writeFileSync('components/OperationalDecisionCenter.tsx', newLines.join('\n'));
