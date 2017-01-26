# Getting started with Nightwatch.JS and CrossBrowserTesting

[Nightwatch.JS](http://nightwatchjs.org/) provides a powerful commandline tool that allows you to run end-to-end [Selenium](http://www.seleniumhq.org/) tests with Javascripts language bindings, all the while avoiding asynchronous commands and racing conditions. To get started, you'll need NPM. It comes with Node, and you can find setup instructions for the [whole package here](https://nodejs.org/en/). Once you have NPM, create a directory where you'd like your test projects to be stored. Navigate to that directory. From there, we'll initialize it as a Node Package by using the following:

`user$ npm init`

From there, we'll need to install Nightwatch as well as [cbt_tunnels](https://github.com/crossbrowsertesting/cbt-tunnel-nodejs) for initializing a local connection. Run the following command from that directory.

```
user$ npm install nightwatch
user$ npm install cbt_tunnels
```

Next, we need to create JSON object that Nightwatch will point to when deciding how to configure the environment we'll be testing on. In our case, we'll be setting it up to test in CBT's cloud. Create a file called 'nightwatch.json', and copy to following environment configuration therein:

```
{
  "src_folders" : ["tests"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "", 				// can leave this blank for now. we'll use it later for local connection setup.

  "selenium" : {
    "start_process" : false,
    "server_path" : "",
    "log_path" : "",
    "host" : "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "",
      "webdriver.ie.driver" : ""
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "<launch_url_of_choice",
      "selenium_port"  : 80,
      "selenium_host"  : "hub.crossbrowsertesting.com",
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : ""
      },
      "username": "<your_cbt_username>",
      "access_key": "<your_cbt_authkey>",
      "desiredCapabilities": {
        "acceptSslCerts": "1",
        "browserName": "internet explorer",
        "browser_api_name": "IE10",
        "build": "1.0",
        "javascriptEnabled": "1",
        "name": "NightwatchJSExample",
        "os_api_name" : "Win7x64-C2",
        "platform": "ANY",
        "record_network" : "true",
        "record_video" : "true",
        "screen_resolution" : "1024x768"
      }
    }
  }
}

```

As you can see, you'll need to setup the configuration object to include your CBT username and authorization key, which can be found in our [API](https://crossbrowsertesting.com/apidocs/v3/) as well as on the [Selenium dashboard](https://app.crossbrowsertesting.com/selenium/run).

Finally, we'll create a 'tests' directory where all of our actual test scripts will reside. While in your current directory, create a folder called 'tests.' Within it, create a file called first_test.js and copy to following code:

```
this.toDos = function(browser) {
      browser
      .url('http://crossbrowsertesting.github.io/todo-app.html')
      .useXpath()
      .click('/html/body/div/div/div/ul/li[4]/input')
      .click('/html/body/div/div/div/ul/li[5]/input')
      .setValue('//*[@id="todotext"]', 'run your first selenium test')
      .click('//*[@id="addbutton"]')
      .click('/html/body/div/div/div/a')
      .useCss()
      .assert.containsText('li:nth-child(4) > span', 'run your first selenium test')
      .end();
};

```

Back up to 'tests' parent directory, and run the following command:

`user$ nightwatch`

Head over to CBT's dashboard, and you should see a test starting up on a Windows 7x64 / Internet Explorer 10 configuration. We can start adding more tests to tests to the 'tests' directory, and Nightwatch will take care of the rest. Be sure to have a look at [Nightwatch's API](http://nightwatchjs.org/api) to ensure you're making use of their best practices. If at any point, you have trouble getting your tests running with us, don't hesitate to [get in touch](mailto: support@crossbrowsertesting.com). We're always happy to help. 

##Local Connection Usage

If you're interested in testing behind your firewall, CBT definitely supports that. We'll just need to make a few changes to how Nightwatch starts tests. Before each test, we'll start a tunnel, and we'll stop it afterward. Alternatively, you can make a few small changes to make cbt_tunnels start before each suite. We'll cover that as well. 

Within your current directory, create a file called 'globals.js'. In this file, copy the following code:

```
var cbt = require('cbt_tunnels');
module.exports = {
  beforeEach : function(done) {
    console.log('Starting up tunnel');
    cbt.start({
      'username': '<your_cbt_username>',
      'authkey': '<your_auth_key>'
    }, function(err, data) {
      if (err) {
        done(err);
      } else {
        done(data);
      }
    });
  },
  afterEach : function(done) {
    console.log('Closing Down Tunnel');
    cbt.stop();
    done();
  }
}
```

If you installed cbt_tunnels earlier, this beforeEach and afterEach functions should work fine. If you'd like to run them before each suite of tests, just change these to general 'before' and 'after' functions. We need to make one more change to our nightwatch.json file. Remember that globals path from before? Now we need to have it point to the path of this 'globals.js' file. Once that's been completed, you're good to go. Cbt_tunnels will start before and after each test, and you can test pages behind your firewall or proxy across all of CBT's OS/Device/Browser combinations. 

If you have any trouble establishing a local connection or would like to know more about how it works, we have a separate repository for cbt_tunnels [which can be found here](https://github.com/crossbrowsertesting/cbt-tunnel-nodejs). 