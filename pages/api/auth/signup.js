import connectDB from "@/lib/mongodb";
import users from "@/models/users";
const bcrypt = require('bcryptjs')

export default async function sign(req, res) {
    await connectDB()
    if (req.method === 'POST') {
        const { name, email, password } = req.body
        console.log(req.body)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Enter all values" })
        }
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' })
        }
        const user = new users({ name, email, password: await bcrypt.hashSync(password, 10) })
        await user.save()
        return res.status(200).json({ message: "Signup success" })
    }
}