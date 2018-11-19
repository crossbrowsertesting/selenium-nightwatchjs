const cbt = require('cbt_tunnels');
const nwConfig = require('./nightwatch')

const spawn = require('child_process').spawn;

const tunnelOptions = {
  'username': nwConfig.test_settings.default.username,
  'authkey': nwConfig.test_settings.default.access_key
}

async function startTunnel(tunnelOptions){
  return new Promise( (resolve, reject) => {
    cbt.start(tunnelOptions, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });
  })
}

function envNames(config){
  if(config && config.test_settings){
    return Object.keys(config.test_settings);
  }
  else {
    return [];
  }
}

async function spawnNW(envName){
  return new Promise( (resolve, reject) => {
    let err;
    let proc = spawn('nightwatch', ['-e', envName], {shell:true});
    proc.stdout.on('data', data => {
      if (data.toString('utf8').replace(/\s/g, '') !== ""){
        console.log(`${envName}:\n ${data.toString('utf8')}`)
      }
    })
    proc.stderr.on('data', data => {
      if (data.toString('utf8').replace(/\s/g, '') !== ""){
        console.error(data.toString('utf8'))
      }
    })
    proc.on('close', (code) => {
      if(code === 0){
        console.log(`${envName}: Finished!`)
        resolve(code)
      }
      else {
        reject(new Error(`${envName}: failed` + err));
      }
    })
  })
}



( async () => {

  // make sure tunnel is started before starting selenium tests
  await startTunnel(tunnelOptions);

  // get environments from config file
  let names = envNames(nwConfig);

  // spawn nightwatch for each environment
  let procs = names.map(spawnNW)

  console.log(`Starting to run Nightwatch on ${names.join(', ')}`)

  // wait for all nightwatch processes to return
  Promise.all(procs)
    .then( () => {
        console.log('Nightwatch finished!')
        // stop tunnel when all tests are done
        cbt.stop()
    })
    .catch( (err) => {console.log(err)})
})()
