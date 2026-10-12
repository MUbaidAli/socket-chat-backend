const exporess = require("express");
const router = exporess.Router()
const {registerUser, loginUser,me} = require("../controllers/user.controller")
const validation = require("../middleware/validation");
const {userSchema ,loginSchema} = require("../validations/userValidation");
const protect = require("../middleware/protect");

router.post("/register",validation(userSchema) , registerUser);
router.post("/login",validation(loginSchema) , loginUser);
router.get("/me",protect , me);

module.exports = router;