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
    
        let{Name,Id,Email_id,Age,id,name}=getdata[0]

        const tokon = await jwt.sign({
            Email_id: req.body.eMail,
            Password: req.body.password
        }, "amishavishwakarma");
        res.cookie('jwt', tokon, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000
        });

        res.send({
            Name:Name,
            Id:Id,
            Email_id:Email_id,
            Age:Age,
            cities:{id:id,name:name}
        })


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
        list=[]
       getdata=await knex("user").select("*").join("Cities", "Cities.id", '=', 'user.City_id').modify(function(query){
        if (req.query.agemorethen) {
            if (req.query.city_id){
                query.where("user.City_id", req.query.city_id)
                query.andWhere('age', '>=', req.query.agemorethen)
            }
            else {
                query.andWhere('age', '>=', req.query.agemorethen)
                
            }
            
        }else if(req.query.agelessthen){
            if (req.query.city_id){
                query.where("user.City_id", req.query.city_id)
                query.andWhere('age', '<=', req.query.agelessthen)
            }
            else {
                query.andWhere('age', '<=', req.query.agelessthen)
                
            }
        }else if(req.query.city_id){
            query.where("user.City_id", req.query.city_id)
        }
       })
       for (i in getdata){
        var {Name,Id,Email_id,Age,id,name}=getdata[i]
        list.push({
            Name:Name,
            Id:Id,
            Email_id:Email_id,
            Age:Age,
            cities:{id:id,name:name}
        })
        }
        res.send(list)
    } catch (error) {
        res.send(error)
    }

}

exports.get_user_by_userId = async (req, res) => {
    try {
        let getdata = await knex("user")
            .select("user.Id","user.Name","user.Email_id","user.Age","Cities.id","Cities.name")
            .join("Cities", "Cities.id", '=', 'user.City_id')
            .where('user.Id', req.params.userId)
            
        let{Name,Id,Email_id,Age,id,name}=getdata[0]
        
        res.send({
            Name:Name,
            Id:Id,
            Email_id:Email_id,
            Age:Age,
            cities:{id:id,name:name}
        })

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
            .select("user.Id","user.Name","user.Email_id","user.Age","Cities.id","Cities.name","todotask.assignedTo","todotask.Id","todotask.text","todotask.dueDate")
            .join("user", "user.Id", '=', 'todotask.assignedTo')
            .join("Cities", "Cities.id", '=', 'user.City_id')
            .where({assignedTo:req.body.assignedTo})

        let {text,dueDate,Name,Id,Email_id,Age,id,name}=todolist[0]

        res.send({todo:{
            text:text,
            assignedTo:{
                Name:Name,
                Id:Id,
                Email_id:Email_id,
                Age:Age,
                cities:{id:id,name:name}
            },
            dueDate:dueDate

        }})
    } catch (error) {
        res.send(error)
    }




}

exports.mytodos = async (req, res) => {
    try {
        list=[]
        let todolist = await knex("todotask")
            .select("*")
            .join("user", "user.Id", '=', 'todotask.assignedTo')
            .join("Cities", "Cities.id", '=', 'user.City_id')

    for (i in todolist){
        let {text,dueDate,Name,Id,Email_id,Age,id,name}=todolist[i]
        list.push({
            text:text,
            assignedTo:{
                Name:Name,
                Id:Id,
                Email_id:Email_id,
                Age:Age,
                cities:{id:id,name:name}
            },
            dueDate:dueDate

        })
    }
    res.send(list)

    } catch (error) {
        res.send(error)
    }
}
