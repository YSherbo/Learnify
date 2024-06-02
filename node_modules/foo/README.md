## Foo

An opinionated git cli for OSS.

### How to install

```js
npm install -g foo | yarn global add foo
```

### Checkout

Gets a remote branch. This will add a remote origin if it does not exist, fetches it and checkouts the specified PR branch.

```bash
foo checkout <id|url|branch>
foo co <id|url|branch>
```
- `branch` - The username and branch e.g `@[user]/[branch]` or `@[user]:[branch]`
- `id` - The pull request id e.g `4381` or `#4381` (in development)
- `url` - The pull request url e.g `https://github.com/devtools-html/debugger.html/pull/4381` (in development)


### Diff

Shows changes between commits, commit and working tree, etc

```bash
foo diff
```

### Log

Shows the commit logs.

```bash
foo log
```

### Push

Pushes your local branch to GH, regardless of remote.

```bash
foo push
```


## Todo
* **delete** delete local branches
* **remote** add a new remote
* **new** create a new branch
* **update** update a branch
* **squash** squash local commits
