import request from "axios"

// PYTHON SERVER INSTANCE
export let instance = request.create({
            baseURL:"https://app-inventory.herokuapp.com",
            headers:{}
        })