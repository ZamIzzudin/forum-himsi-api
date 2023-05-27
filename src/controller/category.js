import Category from "../model/category.js";

const get_category = async (req, res) => {
    try {
        const categories = await Category.find({ posts: { $gt: 0 } }).sort({ posts: -1 })

        const data = categories.map(category => {
            return {
                name: category.name,
                count_posts: category.posts
            }
        })

        res.status(200).json({
            status: 200,
            message: 'Success get category list',
            data
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const controller = {
    get_category
}

export default controller