# Churned Butter UI
_Because everybody like butter_


## What is this?

It's a web user interface framework, as well as a style guide generator, meant to be included in Postmedia Network new software based on Django.
It is built with NPM and us using Gulp packet manager to manage dependencies and compiling process

## How to install

1. Install Node, this will install NPM
2. Install Gulp globally `npm install gulp-cli --global`
3. cd to the root and run `npm install`

## Gulp
Remember that you can list all the tasks by running `gulp --tasks`

### clean
Classic task to erase all /dist folder and temporary files and folders
### css
Task that compiles all the CSS from /src/framework/ and /src/websites/ and compiles it into /dist/
### js
Task that compiles all the JS from each websites. Import all the components from the framework.
