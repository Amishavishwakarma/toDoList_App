const express = require("express")
const router = new express.Router()
const serve=require("../controller/index")
const auth=require("../auth")

router.post("/cities",serve.cities)

router.post("/user",serve.post_user)

router.post("/login",serve.login)

router.get("/all_user",auth,serve.get_user)

router.get("/users/:userId",auth,serve.get_user_by_userId)

router.post("/todos",serve.todos)

router.get("/mytodos",auth,serve.mytodos)

module.exports = router