var path = require('path');
var fs = require('fs');
var child = require('child_process');
var exec = child.exec;

var util = require('util');

// if debug is enabled, we require('debug') later in the process
// we define an empty function here as a stub
var Debug;
var debug = function() { };


// helpers
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// e escaped for RegExp
// support RegExp.escape https://github.com/benjamingr/RegExp.escape
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var e = function(s) {return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');}

// ex executes an array of commands
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function ex(cmds) {
  var len = cmds.length;
  for(var i=0; i< len; i++) {
    console.log('=> '+cmds[i]);
    exec(cmds[i]); // all async. nothing to be done about it.
  }
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function bypass() {
  console.log('Bypassing npm init confirmation');
  var args = process.argv;
  var redoEnv = process.env;
  redoEnv['BYPASSED']='bypassed';

  var command = 'npm init --force ' + args.join(' ');

  process.on('SIGINT', function(){
  debug('restarting npm init for bypass');
    exec(command, {env:redoEnv});
  });

  process.kill(process.pid, 'SIGINT');
  return false;
}

// launchEditor opens the editor from the config if it exists
// if it doesn't find it, it's because the user canceled the init
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function launchEditor(editor) {
  var packageFilename=path.join(process.cwd(), 'package.json');
  var command = editor + ' ' + packageFilename + ' &';
  console.log('launching ' + command);
  process.on('exit', function() {
    process.stdout.write('Opening editor for ' + packageFilename+'\n');
    if(fs.existsSync(packageFilename)) {
      ex([command]);
    } 
  });
}


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function handleConfig(parsed) {
  var config = parsed.npmPowerInitConfig;

  if ('debug' in confg && config.debug) {
    Debug = require('debug');    
    Debug.enable('npm-power-init');
    debug = new Debug('npm-power-init');
   } 

  if('bypass' in config && !('BYPASSED' in process.env) ) {
    bypass();
    if('editor' in config) 
      console.log('Opening package.json in editor');
    return false;
  }

  if('exec' in config) {
    ex(config.exec);
  }

  // remove the npmPowerInitConfig
  delete parsed.npmPowerInitConfig;

  // finally, attach to the editor if specified
  // until we can count on node 11+, we can only do an async editor
  // (todo: deasync the execs and for opening an editor for confirmation
  if('editor' in config) {
    launchEditor(config.editor);
  }

  return true;
}


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Now do the work
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// load the config file
var defaultsFileName = path.resolve(process.env.HOME, '.npm-power-init.json');
var rawDefaults = fs.readFileSync(defaultsFileName, 'UTF8');

// replace $path and $dir
var dirRx = new RegExp(e('${dir}'), 'g');
var pathRx = new RegExp(e('${path}'), 'g');
var replacedDefaults = rawDefaults.replace(pathRx, process.cwd());
replacedDefaults = replacedDefaults.replace(dirRx, path.basename(process.cwd()));

// parse and process
var parsed = JSON.parse(replacedDefaults);


if('npmPowerInitConfig' in parsed) {
  if(!handleConfig(parsed))
    parsed = null;
}

// and return what we have
module.exports = parsed;