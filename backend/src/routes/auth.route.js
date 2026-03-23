import { Router } from "express";

import { protectedRoute } from "../middlewares/auth.middleware.js";

import registerUser from "../controllers/auth.controller.js"
import loginUser from "../controllers/auth.controller.js"
import logoutUser from "../controllers/auth.controller.js"


Router.route("/register").post(registerUser)

Router.route("/login").post(loginUser)

Router.route("/logout").post(logoutUser)



