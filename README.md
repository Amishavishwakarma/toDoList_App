# toDoList_App_Expressjs

Here we are making a todo application. Imagine a simple application where you can login to create todos. This backend API will be used by a mobile app. You can use that mobile app to remember all the things you need to do. Also if you want to remind a friend of yours about something you can add a todo assigned to them too.

Example: You add a todo - "Buy Milk" which can be assigned to you.
Example: You add a todo  - "Get sweater from McLeodganj" and assigned it to Rishabh as you know that Rishabh would be visitng McLeodganj.

## How Authentication Works?
We will implement Basic authentication which means username/password will be sent in the Header of every request. All the requests marked as [with auth] are the ones which require authentication. The ones marked with [without authentication] are the ones without any auth requirement. The ones which require authentication should return an error if they are pinged without Authentication.


# Requirements

Installation process and Execution First, If you'are using Linux-based-OS, open your terminal and install the latest version of NodeJS and npm. You do also need to install mysql database onto your system. by writing the following commands.

## install knex
 ```npm i knex```
 
 ## install express
 ```npm i express```
 
 ## install mysql
 ```npm i mysql```
 
 ## install jwt
 ```npm i jsonwebtoken```
 
 ## install body-parser
 ```npm i body-parser```
 
 Install postman, that helps you to develop APIs and getting responses from it, by writing the following commands on your terminal.
 
 ```sudo apt-get install snap $ snap install postman```
 
