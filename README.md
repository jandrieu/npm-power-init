# npm-power-init
A flexible alternative to .npm-init.js for customizing npm init

# Download
Download anywhere using either npm or git. You won't need to keep it around after you set it up. CD to the source files once you have it fully installed. However, you will need .

Using npm:
```bash
npm install npm-power-init -g
cd $NODE_PREFIX/node_modules/npm-power-init
```

You can also clone or download directly from Git, but then you'll need to make sure the dependencies are installed globally. I'll leave that as an exercise for the reader.
Using git clone
```bash
git clone git@github.com:jandrieu/npm-power-init.git
cd npm-power-init
```

Downloading zip from git 
https://github.com/jandrieu/npm-power-init/archive/master.zip (Right-click and select 'Save link as...')

Unzip and cd into the directory.

# Installation

1. Make npm-power-init.js your npm-init.js script.
2. Configure ~/.npm-power-init.json
3. Use **npm init** as usual

## Step 1 -- Make npm-power-init.js your npm-init.js script.

Here are two ways to do this.

A. Rename npm-power-init.js to npm-init.js and place in your home directory. **This is the recommended approach**

```bash
mv npm-power-init.js ~/.npm-init.js
```

B. Set your init module to npm-power-init.js
  You can set this in any of your .npmrc files https://docs.npmjs.com/files/npmrc or just use **npm config**. I recommend copying npm-power-init.js to your home directory, but you could provide the full path to wherever it is.
```bash
cp npm-power-init.js ~/
npm config set init-module ~/npm-power-init.js  
```

## Step 2 -- Configure npm-init.json
**npm-power-init.js** looks in your home directory for a **.npm-init.json** file for configuration data.

The config file is a template package.json with an options special property **npmPowerInitConfig** which contains the configuration settings specific to npm power init.

### Available settings
  **exec** -- An array of templated commands to run with **process.exec**
  ```json    
    "exec" : ["mkdir test && touch test/${dir}Test.js"]
  ```
  **editor** -- The path to an editor for opening the resulting package.json after npm init completes.
  ```json
    "editor" : "/usr/bin/emacs"
  ```
  **bypass** -- Boolean (defaults to false) to skip the interactive part of npm init.
  ```json
    "bypass" : true
  ```

### Template variables
Before parsing the .npm-power-init.json, we replace two special tags, ${dir} and ${path}, with their respective values.

  **${dir}** -- The name of the current working directory
  **${path}** -- The full path to the current working directory
  
${dir} is great for naming files or your package based on the directory in which you run npm init. ${path} is useful if you want to make sure you have the full absolute path for any file manipulation.      

## Step 3 -- Use **npm init** as usual

To create a new project "newProject":
```bash
mkdir newProject
cd newProject
npm init
```
Your newProject's package.json will be created, using the npm-power-init features configured in your .npm-power-init.json.
 