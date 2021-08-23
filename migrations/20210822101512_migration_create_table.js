exports.up = function (knex) {
    return knex.schema
        .createTable("Cities", (table) => {
            table.increments('id').primary();
            table.string('name', 255).notNullable();


        }).then(() => {
            return knex.schema
                .createTable('user', (table) => {
                    table.increments('Id').primary();
                    table.string('Name', 255).notNullable();
                    table.string('Email_id', 255).notNullable();
                    table.string('Password', 255).notNullable();
                    table.integer("Age", 255).notNullable();
                    table.unique("Email_id")
                    table.integer("City_id").references("id").inTable('Cities').unsigned()

                })
        })
       
    

};


exports.down = function (knex) {
    return knex.schema.dropTable("events").then(() => {
        return knex.schema.dropTable("user")
    })
};