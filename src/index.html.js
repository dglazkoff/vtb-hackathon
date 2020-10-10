const DEFAULT_PATHS = {
  styles: { path: 'styles.css', sri: '' },
  production: { path: 'bundle.js', sri: '' },
}

module.exports = (initialHtml = '', paths = DEFAULT_PATHS) =>
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="theme-color" content="#FFFFFF">
  <title>Skeptical Beavers</title>
</head>
<body>
  <div id="root" />
  <script src="/${paths.production.path}"></script>
</body>
</html>`
