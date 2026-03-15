// Creates a shortcut to the built executable in the project root

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Paths
const projectRoot = path.resolve(__dirname, '..');
const exePath = path.join(__dirname, 'dist', 'win-unpacked', 'Daily Clock Planner.exe');
const shortcutPath = path.join(projectRoot, 'Daily Clock Planner.lnk');

// Check if executable exists
if (!fs.existsSync(exePath)) {
  console.log('❌ Executable not found at:', exePath);
  process.exit(1);
}

// PowerShell script to create shortcut
const psScript = `
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}")
$Shortcut.TargetPath = "${exePath.replace(/\\/g, '\\\\')}"
$Shortcut.WorkingDirectory = "${path.dirname(exePath).replace(/\\/g, '\\\\')}"
$Shortcut.Save()
`;

// Execute PowerShell command
exec(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`, (error) => {
  if (error) {
    console.log('❌ Error creating shortcut:', error.message);
    process.exit(1);
  }
  console.log('✓ Shortcut created successfully at:', shortcutPath);
});