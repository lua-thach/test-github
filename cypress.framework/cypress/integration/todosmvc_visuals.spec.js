///<reference types ="cypress"/>
/// <reference types="@applitools/eyes-cypress" />
import { TodoPage } from "../page-objects/todo-pages";

describe ('visuals validation',()=>{
    const todoPage = new TodoPage();
    before(()=>{
        //cy.visit('http://todomvc-app-for-testing.surge.sh/?delay-new-todo=3000');
        //cy.visit('http://todomvc-app-for-testing.surge.sh');
        todoPage.navigate();
    })

    beforeEach(() =>
    cy.eyesOpen({
      
      appName: 'TAU TodoMVC',
      batchName: 'TAU TodoMVC',
      browser: [
        {name: 'chrome', width: 1024, height: 768},
        {name: 'chrome', width: 800, height: 600},
        {name: 'firefox', width: 1024, height: 768},
        {deviceName: 'iPhone X'},
      ]
    })
  )

  afterEach(() => cy.eyesClose())

        
    it('should add a new todo to the list', ()=>{
        cy.eyesCheckWindow('empty todo list')
        todoPage.addTodo("Clean Room ah 1");
        //cy.get('.new-todo',{timeout : 6000}).type("Clean Room ah 1{enter}");
        cy.get('.new-todo',{timeout : 6000}).type("Clean Room ah 2{enter}");
        cy.eyesCheckWindow('two todos')
        cy.get(':nth-child(2) > .view > .toggle').click();
    })
 })
//FBZ17fI104lH05RURdjwVor0VwId0uQah42xvZvaArDYw110
//APPLITOOLS_API_KEY="FBZ17fI104lH05RURdjwVor0VwId0uQah42xvZvaArDYw110" npm run cypress:open
//set APPLITOOLS_API_KEY='YOUR_API_KEY'
// module.exports = {
//     testConcurrency: 1,
//  //   apiKey: APPLITOOLS_API_KEY,
//     browser: [
//         // Add browsers with different viewports
//         {width: 800, height: 600, name: 'chrome'},
//         {width: 700, height: 500, name: 'firefox'},
//         {width: 1600, height: 1200, name: 'ie11'},
//         {width: 1024, height: 768, name: 'edgechromium'},
//         {width: 800, height: 600, name: 'safari'},
//         // Add mobile emulation devices in Portrait mode
//         {deviceName: 'iPhone X', screenOrientation: 'portrait'},
//         {deviceName: 'Pixel 2', screenOrientation: 'portrait'}
//     ],
//     // set batch name to the configuration
//     batchName: 'Ultrafast Batch'
// }
// describe("AppTest", () => {

//     it(`ultraFastTest`, function () {
//         // Navigate to the url we want to test
//         // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
//         // but then change the above URL to https://demo.applitools.com/index_v2.html
//         // (for the 2nd run)
//         cy.visit('https://demo.applitools.com');

//         // Call Open on eyes to initialize a test session
//         cy.eyesOpen({
//             appName: 'Demo App',
//             testName: 'Ultrafast grid demo',
//         })

//         // check the login page with fluent api, see more info here
//         // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
//         cy.eyesCheckWindow({
//             tag: "Login Window",
//             target: 'window',
//             fully: true
//         });

//         cy.get('#log-in').click()

//         // Check the app page
//         cy.eyesCheckWindow({
//             tag: "App Window",
//             target: 'window',
//             fully: true
//         });

//         // Call Close on eyes to let the server know it should display the results
//         cy.eyesClose()
//     });

// });