# `node-pager`
> A super simple module that outputs text into `less`.

# Usage
Install
```sh
$ npm install --save node-pager
```

Require
```js
const fs = require('fs')
const pager = require('node-pager')

// read file contents and print to a pager
fs.readFile('somefile.txt', (err, data) => {
  pager(data.toString('utf8')).then(() => {
    console.log('pager exited')
  })
})
```

You can specify options to be passed to `less` (only if your platform is not windows).

```js
pager('my string', '-F'); // less -F
pager('my string'); // by default less -R (allows colors)
```
