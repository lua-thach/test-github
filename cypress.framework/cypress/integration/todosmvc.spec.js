///<reference types ="cypress"/>

import { TodoPage } from "../page-objects/todo-pages";

describe('todo-actions:',()=>{
    const todoPage = new TodoPage();
    beforeEach(()=>{
        //cy.visit('http://todomvc-app-for-testing.surge.sh/?delay-new-todo=3000');
        //cy.visit('http://todomvc-app-for-testing.surge.sh');
        todoPage.navigate();
    })
        
    it('should add a new todo to the list', ()=>{
        todoPage.addTodo("Clean Room ah 1");
        //cy.get('.new-todo',{timeout : 6000}).type("Clean Room ah 1{enter}");
        cy.get('.new-todo',{timeout : 6000}).type("Clean Room ah 2{enter}");
    
        cy.get(':nth-child(2) > .view > .toggle').click();
        cy.contains("Clear completed").click();

        cy.get('label').should("have.text","Clean Room ah 2")
        cy.get('.toggle').should("not.be.checked")
        cy.get('.todo-list li').should('have.length',1)

        cy.get('.toggle').click();
        cy.get('label').should('have.css','text-decoration-line','line-through')
        cy.contains("Clear completed").click();
        cy.get('.todo-list').should('not.have.descendants','li')
    })
})
