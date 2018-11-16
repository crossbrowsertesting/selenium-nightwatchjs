this.toDos = function(browser) {
      browser
      .url('http://crossbrowsertesting.github.io/todo-app.html')
      .useXpath()
      .click('/html/body/div/div/div/ul/li[4]/input')
      .click('/html/body/div/div/div/ul/li[5]/input')
      .setValue('//*[@id="todotext"]', 'run your second selenium test')
      .click('//*[@id="addbutton"]')
      .click('/html/body/div/div/div/a')
      .useCss()
      .assert.containsText('li:nth-child(4) > span', 'run your second selenium test')
      .end();
};
