import connectDB from "@/lib/mongodb";
import items from "@/models/items";
import { getSession } from 'next-auth/react'

export default async function item(req, res) {
    await connectDB()
    if (req.method === 'POST') {
        const { name, price } = req.body
        if (!name || !price) {
            return res.status(400).json({ message: "provide all values" })
        }
        const newitem = new items({ name, price })
        await newitem.save()
        return res.status(201).json({ message: 'items created' })
    }
    if (req.method === 'GET') {
        const item = await items.find({})
        return res.status(200).json(item)
    }
    if (req.method === 'PUT') {
        const { _id, name, price } = req.body
        if (!name || !price || !_id) {
            return res.status(400).json({ message: "provide all values" })
        }
        const item = await items.findOne({ _id })
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        item.name = name
        item.price = price
        await item.save()
        return res.status(200).json({ message: 'Product Updated' })
    }
    if (req.method === 'DELETE') {
        const id = req.query.id
        console.log(id)
        try {
            await items.deleteOne({ _id: id })
            return res.status(200).json({ message: 'Deleted' })
        } catch (err) {
            return res.status(200).json({ message: 'Something went wrong ' })
        }
    }
}