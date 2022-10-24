import express from "express"
import { 
    user_signup, 
    user_signin, 
    get_all_users,
    get_single_user,
    update_single_user,
    delete_single_user
} from "../controllers/userController.js"
import { userProtect } from "../middlewares/auth-handler.js"

const user_router = express.Router()

user_router.route("/")//Getting all users and creating a user
    .post(user_signup)
    .get(get_all_users)
user_router.post("/user-signin", user_signin)//Signing in a user
user_router.route("/:id")//getting, updating and deleting a single user
    .get(userProtect, get_single_user)
    .patch(userProtect, update_single_user)
    .delete(userProtect, delete_single_user)


export default user_router