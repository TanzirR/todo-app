import express from "express"
import path, {dirname} from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/authModdleware.js"

const app = express()
const PORT = process.env.PORT || 8000

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)

console.log("filename:", __filename)
console.log("__dirname:", __dirname)

// Middleware
app.use(express.json()) //for post method 

app.use(express.static(path.join(__dirname, '../public')))

// Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

//Routes
app.use("/auth", authRoutes)
app.use("/auth", authMiddleware, todoRoutes)

app.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT}`)
})

