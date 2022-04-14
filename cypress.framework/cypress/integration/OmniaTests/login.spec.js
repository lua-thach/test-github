///<reference types ="cypress"/>
import {login} from "D:/Automation/cypress/cypress.framework/cypress/support/auth.js";


context("fetchData", ()=>{
    beforeEach('login', () => {
        login().visit("/");
    });
    it("should show", ()=>{
        
    })
}
);
    
