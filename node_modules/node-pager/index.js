const { writeSync } = require('fs');
const { spawnSync } = require('child_process');
const tmp = require('tmp');

module.exports = (string, options = '-R') => {
	return new Promise((resolve, reject) => {
		tmp.file((err, path, fd, cleanupCb) => {
			if (err) {
				return reject(err);
			}

			writeSync(fd, string);
			spawnSync(`less ${options} "${path}"`, { shell: true, stdio: 'inherit' });

			cleanupCb();
			resolve();
		});
	});
};
