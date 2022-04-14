export class TodoPage{
    navigate(){
        cy.visit('http://todomvc-app-for-testing.surge.sh');
    }
    addTodo(todo_Text){
        cy.get('.new-todo',{timeout : 6000}).type(todo_Text+"{enter}");
    }
}