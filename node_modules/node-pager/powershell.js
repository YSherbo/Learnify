const { join } = require('path');
const { spawnSync } = require('child_process');

module.exports = (string, options = '-R') => {
	return new Promise(resolve => {
		const file = join(__dirname, './helpers/pager.ps1');
		spawnSync('powershell', ['-File', file, string]);
		resolve();
	});
};
