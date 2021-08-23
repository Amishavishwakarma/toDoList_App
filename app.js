const express=require("express")
const app=express()
const bodyParser=require("body-parser")
const route=require("../ToDOList/route")
app.use(bodyParser.json())
app.use(route)
app.listen(3000,()=>{
    console.log("listning")
})
