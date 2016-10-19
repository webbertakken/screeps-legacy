# My take at Screeps
## Installation
### NodeJS
Install the latest version of NodeJS from [https://nodejs.org](https://nodejs.org/). 
This will also automatically install Node Package Manager.
### Dependencies
You might want to install Gulp and Webpack globally on your system.
```
npm install -g gulp webpack webpack-stream
```
Install dependencies using Node Package Manager.
```
npm install
```
### Environment Variables
Set environment variables, so you can sync your files with Screeps.  

_**Note:** If you log in through Steam or Github, you can still set 
your Screeps email address and password for this to work_
#### Linux / OS
```
export SCREEPS_EMAIL    = <your-screeps-email>
export SCREEPS_PASSWORD = <your-screeps-password>
```
To do this permanently, edit `~/.bashrc` and add above lines at the end.
#### Windows
```
set  SCREEPS_EMAIL    = <your-screeps-email>
set  SCREEPS_PASSWORD = <your-screeps-password>
```
To do this permanently, use `setx` instead of `set` and replace 
the `=` with a space.
### Editor Setup
Should you wish to continue working on this code, there are a few more 
steps. If not you can skip them.
#### IDE
##### Screeps AutoComplete
Initiate AutoComplete module for screeps, created by
[garethp](https://github.com/Garethp/ScreepsAutocomplete).
```
git submodule init
```
##### EditorConfig
Install any plugin that can work with EditorConfig.
##### ESLint
Install any plugin that works with ESLint.
##### LoDash library
Go to `Project Settings` > `Languages & Frameworks` > `Javascript` > `Libraries`  
Add LoDash library from your global installation or from the node_modules 
folder.  

_**Note:** Above instructions are WebStorm/PHPStorm specific and can differ per IDE._
## Usage
### Syncing files
Use the following command to sanity-check, compile and deploy the code.
```
gulp sync
```
### Auto-syncing files
Should you wish to auto-sync every time you save a file, use;
```
gulp watch
```
## Thanks
[garethp](https://github.com/garethp) for `autocompletion`  
[gdborton](https://github.com/gdborton) for `architectural influence`  
[brammittendorff](https://github.com/brammittendorff) for `inspiration`
