# My take at Screeps
## Installation
### NodeJS
Install the latest version of NodeJS from [https://nodejs.org/en/]. 
This will also automatically install Node Package Manager.
### Dependencies
You might want to install Gulp and Webpack globally on your system.
```
npm install -g gulp webpack webpack-stream
```
Install dependencies using Node Package Manager, asuming you're using the latest version of NodeJS.
```
npm install
```
### Environment Variables
Set environment variables, so you can sync your files with Screeps.  
_**Note:** If you log in through Steam or Github, you can still set your Screeps email address and password for this to work_
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
To do this permanently, use `setx` instead of `set` and replace the `=` with a space.
### Editor Setup
Should you wish to continue working on this code, there are a few more steps. If not you can skip them.
#### IDE
##### EditorConfig
Install any plugin that can work with EditorConfig, so you dont have to set up the particular settings for this project yourself.
##### ESLint
Install any plugin that works with ESLint. It should automatically search for `.eslintrc.*`. This will help you keep quality up to the current standards.
### Syncing files
Use the following command to sanity-check and compile the code and deploy it to your Screeps account.
```
gulp sync
```
Any errors will cancel deployment of the code.
### Auto-syncing files
Should you wish to auto-sync everytime you save a file, you can use below command.
```
gulp watch
```
###Credits
gdborton - `architectural influence` `inspiration`  
brammittendorff - `inspiration`
