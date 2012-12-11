# SlowHost

A very simple and slow static resources host.

---

## Install

```
$ sudo npm install slowhost -g
```

## Usage

You can upload your files(images, txt, js, css, py, swf...) to a github repository, and then you could visit it!

```
$ slowhost test.jpg
```
 
```
Ready to upload your file -> test.jpg
Uploading slowly...
Upload test.jpg successed!
- https://raw.github.com/slowhost/upload/1354160941968/test.jpg
```

You can see details by add `-e` or `--verbose`.

```
$ slowhost test.jpg -v
```

You can also host the web resource to github.

```
$ slowhost https://npmjs.org/static/npm.png
```
