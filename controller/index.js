const Knex = require('knex')
const connection = require('../knexfile')
const knex = Knex(connection["development"])
const jwt = require("jsonwebtoken")

exports.cities = (req, res) => {
    knex("Cities").insert({
        name: req.body.name
    }).then(() => {
        knex("Cities").select("*")
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })

    }).catch((err) => {
        res.send(err)
    })

}

exports.post_user = (req, res) => {
    knex("user").insert({
        Name: req.body.name,
        Email_id: req.body.eMail,
        Password: req.body.password,
        Age: req.body.age,
        City_id: req.body.cityId

    }).then(() => {
        const tokon = jwt.sign({
            Email_id: req.body.eMail,
            Password: req.body.password
        }, "amishavishwakarma");
        res.cookie('jwt', tokon, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000
        });
        knex("user").select("Id", "Name", "Email_id", "City_id").where({

                City_id: req.body.cityId
            })
            .then((user_data) => {
                knex("Cities").select("*").where({
                        id: req.body.cityId
                    })
                    .then((city_data) => {
                        delete user_data[0]["City_id"]
                        user_data[0]["city"] = city_data
                        res.send(user_data)
                    })
            })
            .catch((err) => {
                res.send(err)
            })
    }).catch((err) => {
        res.send(err)
    })

}

exports.login = (req, res) => {
    knex("user").select("*").where({
        Email_id: req.body.eMail
    } && {
        Password: req.body.password
    }).then((result) => {
        if (result.length != 0) {
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
    }).catch((err) => {
        res.send(err)
    })
}


exports.get_user = (req, res) => {
    if (req.query.agemorethen != undefined) {
        console.log("hii")
        list = []
        knex("user").select("Id", "Name", "Email_id", "City_id","age").where('age', '>', req.query.agemorethen)
            .then(async (result) => {
                if (result.length != 0) {
                    for (i in result) {
                        await knex("Cities").select("*").where({
                                id: result[i]["City_id"]
                            })
                            .then((city_data) => {
                                delete result[i]["City_id"]
                                result[i]["city"] = city_data[0]
                                list.push(result)

                            })
                    }
                    if (req.query.city_id != undefined) {
                        knex("user").select("Id", "Name", "Email_id", "City_id","age").where({

                                City_id: req.query.city_id
                            })
                            .then((user_data) => {
                                knex("Cities").select("*").where({
                                        id: req.query.city_id
                                    })
                                    .then((city_data) => {
                                        if (city_data.length !=0){
                                            delete user_data[0]["City_id"]
                                            user_data[0]["city"] = city_data
                                            res.send(user_data)
                                        }
                                        else{
                                            res.send("no such data is there")
                                        }
                                        
                                    })
                                    .catch((err) => {
                                        res.send(err)
                                    })
                            })
                            .catch((err) => {
                                res.send(err)
                            })
                    } else {
                        res.send({
                            "users": list
                        })
                    }

                } else {
                    res.send("no data are there")
                }
            }).catch((err) => {
                res.send(err)
            })
    }
    if (req.query.agelessthen != undefined) {
        list = []
        knex("user").select("Id", "Name", "Email_id", "City_id","age").where('age', '<', req.query.agelessthen)
            .then(async (result) => {
                if (result.length != 0) {

                    for (i in result) {

                        await knex("Cities").select("*").where({
                                id: result[i]["City_id"]
                            })
                            .then((city_data) => {
                                delete result[i]["City_id"]
                                result[i]["city"] = city_data[0]
                                list.push(result[i])

                            })
                            .catch((err) => {
                                res.send(err)
                            })
                    }
                    if (req.query.city_id != undefined) {
                        knex("user").select("Id", "Name", "Email_id", "City_id","age").where({

                                City_id: req.query.city_id
                            })
                            .then((user_data) => {
                                knex("Cities").select("*").where({
                                        id: req.query.city_id
                                    })
                                    .then((city_data) => {
                                        if (city_data.length !=0){
                                            delete user_data[0]["City_id"]
                                            user_data[0]["city"] = city_data
                                            res.send(user_data)
                                        }
                                        else{
                                            res.send("no such data is there")
                                        }
                                        
                                    })
                                    .catch((err) => {
                                        res.send(err)
                                    })
                            })
                            .catch((err) => {
                                res.send(err)
                            })
                    } else {
                        res.send({
                            "users": list
                        })
                    }


                } else {
                    res.send("no data are there")
                }
            }).catch((err) => {
                res.send(err)
            })
    }


}

exports.get_user_by_userId = (req, res) => {
    console.log(req.params.userId)
    knex("user").select("Id", "Name", "Email_id", "City_id").where({

            Id: req.params.userId
        })
        .then((user_data) => {
            console.log(user_data)
            if (user_data.length != 0){
                knex("Cities").select("*").where({
                    id: user_data[0]["City_id"]
                })
                .then((city_data) => {
                    delete user_data[0]["City_id"]
                    user_data[0]["city"] = city_data
                    res.send({
                        "user": user_data
                    })
                })
                .catch((err) => {
                    res.send(err)
                })
            }
            else{
                res.send("no such data are there")
            }
            
        })
        .catch((err) => {
            res.send(err)
        })
}

exports.todos = (req, res) => {
    knex("todotask").insert({
            text: req.body.text,
            assignedTo: req.body.assignedTo,
            dueDate: req.body.dueDate,

        }).then(() => {
            knex("todotask").select("*").where({

                    assignedTo: req.body.assignedTo
                })
                .then((todos_data) => {
                    list = []
                    knex("user").select("Id", "Name", "Email_id", "City_id").where({
                            Id: req.body.assignedTo
                        })
                        .then((user_data) => {
                            console.log(user_data)
                            knex("Cities").select("*").where({
                                    id: user_data[0]["City_id"]
                                })
                                .then((city_data) => {
                                    for (i in todos_data) {
                                        todos_data[i]["assignedTo"] = user_data[0]
                                        delete user_data[0]["City_id"]
                                        user_data[0]["city"] = city_data[0]
                                        list.push(todos_data[i])
                                    }
                                    res.send({
                                        "todos": list
                                    })
                                })
                                .catch((err) => {
                                    res.send(err)
                                })
                        })

                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err)
        })
}

exports.mytodos = (req, res) => {
    knex("todotask").select("*")
        .then(async (todos_data) => {
            if (todos_data.length != 0) {
                list = []
                for (i in todos_data) {

                    await knex("user").select("Id", "Name", "Email_id", "City_id").where({
                            Id: todos_data[i]["assignedTo"]
                        })
                        .then(async (user_data) => {
                            await knex("Cities").select("*")
                                .where({
                                    id: user_data[0]["City_id"]
                                })
                                .then((city_data) => {

                                    todos_data[i]["assignedTo"] = user_data[0]
                                    delete user_data[0]["City_id"]
                                    user_data[0]["city"] = city_data[0]
                                    list.push(todos_data[i])
                                })
                                .catch((err) => {
                                    res.send(err)
                                })
                        })
                }
                res.send({
                    "todos": list
                })
            } else {
                res.send("no data")
            }
        })
        .catch((err) => {
            res.send(err)
        })
}