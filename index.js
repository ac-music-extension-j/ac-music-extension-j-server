const express = require('express');
const app = express();
const fs = require('fs');
const dir = require('path');
var serveIndex = require('serve-index');

app.use('/static', express.static('static'));
app.use('/static/*', express.static('static'));

// all of this is so stupid. every day i am more thankful for how FUCKING ANNOYING Jekyll can be at times
app.get('*', (req, res, next) => {
    let path;
    
    if (req.path.substring(1) == '') path = 'index.html'
    else if (!(req.path.substring(1).includes('.'))) path = `${req.path.substring(1)}.html`
    else path = req.path.substring(1)
    console.log(path)

    fs.readFile(`./website/_site/${path}`, (err, data) => {
        if (err) {
            if (fs.existsSync(`./website/_site/${req.path.substring(1)}`)) {
                if (!(fs.existsSync(`./website/_site/${req.path.substring(1)}/index.html`))) next()
                else res.sendFile(`${dir.resolve(__dirname)}/website/_site/${req.path.substring(1)}/index.html`)
            }
            else res.status(404).sendFile(`${dir.resolve(__dirname)}/website/_site/404.html`)
        } else res.sendFile(`${dir.resolve(__dirname)}/website/_site/${path}`)
    })
});
app.get('*', serveIndex(`website/_site/`));

app.listen('8080');