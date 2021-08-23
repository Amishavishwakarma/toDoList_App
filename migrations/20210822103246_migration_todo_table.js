
exports.up = function(knex) {
    return knex.schema
    .createTable("todotask",(table)=>{
        table.increments('Id').primary();
        table.string('text',255).notNullable();
        table.string('assignedTo',255).notNullable();
        table.string('dueDate',255).notNullable();
        
  
    })

};


exports.down = function(knex) {
    return knex.schema.dropTable("todotask")
};