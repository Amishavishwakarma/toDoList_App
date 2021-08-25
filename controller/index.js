const Knex = require('knex')
const connection = require('../knexfile')
const knex = Knex(connection["development"])
const jwt = require("jsonwebtoken")

exports.cities = async (req, res) => {
    try {
        let insertResult = await knex("Cities").insert({
            name: req.body.name
        })
        let getdata = await knex("Cities").select("*").where({
            name: req.body.name
        })
        res.send(getdata)
    } catch (error) {
        res.send(error)
    }
}

exports.post_user = async (req, res) => {
    try {
        let insertResult = await knex("user").insert({
            Name: req.body.name,
            Email_id: req.body.eMail,
            Password: req.body.password,
            Age: req.body.age,
            City_id: req.body.cityId
        })
        let getdata = await knex("user")
            .select("*")
            .join("Cities", "Cities.id", '=', 'user.City_id')
            .where({
                Email_id: req.body.eMail
            } && {
                Password: req.body.password
            })


        getdata[0]["Cities"] = {
            Name: getdata[0]["name"],
            id: getdata[0]["id"]
        }
        delete getdata[0]["City_id"]
        delete getdata[0]["id"]
        delete getdata[0]["name"]
        delete getdata[0]["Password"]
        const tokon = await jwt.sign({
            Email_id: req.body.eMail,
            Password: req.body.password
        }, "amishavishwakarma");
        res.cookie('jwt', tokon, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000
        });
        res.send(getdata)

    } catch (error) {
        res.send(error)
    }

}

exports.login = async (req, res) => {
    try {
        let getdata = await knex("user")
            .select("*")
            .where({
                Email_id: req.body.eMail
            } && {
                Password: req.body.password
            })
        if (getdata.length != 0) {
            const tokon = jwt.sign({
                Email_id: req.body.eMail,
                Password: req.body.password
            }, "amishavishwakarma");
            res.cookie('jwt', tokon, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000
            });
            res.status(200).send("you have login sucessfully")

        } else {
            res.send("you have to login first")
        }
    } catch (error) {
        res.send(error)
    }

}


exports.get_user = async (req, res) => {
    try {
        if (req.query.agemorethen != undefined) {
            if (req.query.city_id != undefined) {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
                    .where('age', '>', req.query.agemorethen)
                    .where("user.City_id", req.query.city_id)

            } else {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
                    .where('age', '>', req.query.agemorethen)
            }

        } else if (req.query.agelessthen != undefined) {
            if (req.query.city_id != undefined) {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
                    .where('age', '<', req.query.agelessthen)
                    .where("user.City_id", req.query.city_id)
                console.log(getdata)
            } else {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
                    .where('age', '<', req.query.agelessthen)
            }
        } else {
            if (req.query.city_id != undefined) {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
                    .where("user.City_id", req.query.city_id)
                console.log(getdata)
            } else {
                getdata = await knex("user").select("*")
                    .join("Cities", "Cities.id", '=', 'user.City_id')
            }
        }

        //if get data exist
        if (getdata.length != 0) {
            getdata[0]["Cities"] = {
                Name: getdata[0]["name"],
                id: getdata[0]["id"]
            }
            delete getdata[0]["City_id"]
            delete getdata[0]["id"]
            delete getdata[0]["name"]
            delete getdata[0]["Password"]

            res.send(getdata)
        } else {
            res.send("no such files are there")
        }
    } catch (error) {
        res.send(error)
    }

}

exports.get_user_by_userId = async (req, res) => {
    try {
        console.log(req.params.userId)
        let getdata = await knex("user")
            .select("*")
            .join("Cities", "Cities.id", '=', 'user.City_id')
            .where('user.Id', req.params.userId)

        getdata[0]["Cities"] = {
            Name: getdata[0]["name"],
            id: getdata[0]["id"]
        }
        delete getdata[0]["City_id"]
        delete getdata[0]["id"]
        delete getdata[0]["name"]
        delete getdata[0]["Password"]

        res.send(getdata)

    } catch (error) {
        res.send(error)
    }

}

exports.todos = async (req, res) => {
    try {
        let insertResult = await knex("todotask").insert({
            text: req.body.text,
            assignedTo: req.body.assignedTo,
            dueDate: req.body.dueDate
        })

        let todolist = await knex("todotask")
            .select("*")
            .join("user", "user.Id", '=', 'todotask.assignedTo')
            .join("Cities", "Cities.id", '=', 'user.City_id')
            .where('todotask.assignedTo', req.body.assignedTo)

        todolist[0]["assignedTo"] = {
            idName: todolist[0]["Id"],
            Name: todolist[0]["Name"],
            Email_id: todolist[0]["Email_id"]
        }
        todolist[0]["cities"] = {
            Name: todolist[0]["name"],
            id: todolist[0]["id"]
        }
        delete todolist[0]["City_id"]
        delete todolist[0]["id"]
        delete todolist[0]["name"]
        delete todolist[0]["Password"]
        delete todolist[0]["Id"]
        delete todolist[0]["Name"]
        delete todolist[0]["Email_id"]
        delete todolist[0]["Age"]



        res.send(todolist)
    } catch (error) {
        res.send(error)
    }




}

exports.mytodos = async (req, res) => {
    try {

        let todolist = await knex("todotask")
            .select("*")
            .join("user", "user.Id", '=', 'todotask.assignedTo')
            .join("Cities", "Cities.id", '=', 'user.City_id')

        todolist[0]["assignedTo"] = {
            idName: todolist[0]["Id"],
            Name: todolist[0]["Name"],
            Email_id: todolist[0]["Email_id"]
        }
        todolist[0]["cities"] = {
            Name: todolist[0]["name"],
            id: todolist[0]["id"]
        }
        delete todolist[0]["City_id"]
        delete todolist[0]["id"]
        delete todolist[0]["name"]
        delete todolist[0]["Password"]
        delete todolist[0]["Id"]
        delete todolist[0]["Name"]
        delete todolist[0]["Email_id"]
        delete todolist[0]["Age"]

        res.send(todolist)
    } catch (error) {
        res.send(error)
    }
}
