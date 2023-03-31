import Post from "../model/post.js"

const create_post = async (req, res) => {
    const { category, head, body, attachments } = req.body

    const payload = {
        username: "Gek Esa",
        display_name: "Esa_",
        category,
        head,
        body,
        attachments,
        profile_picture: "none",
        created_at: new Date().toISOString(),
        is_hide: false
    }

    await Post.create(payload)

    res.status(200).json({
        status: 200,
        message: "Success Add New Post"
    })
}

const get_post = async (req, res) => {
    const result = await Post.find()

    res.status(200).json({
        status: 200,
        message: "Success Get All Post",
        data: {
            posts: result
        }
    })
}

const get_detail_post = async (req, res) => {
    const { id_post } = req.params

    const query = { _id: id_post }

    const result = await Post.findOne(query)

    res.status(200).json({
        status: 200,
        message: `Success Get Detail Post ${id_post}`,
        data: {
            post: result
        }
    })
}

const delete_post = async (req, res) => {
    const { id_post } = req.params

    const query = { _id: id_post }

    await Post.deleteOne(query)

    res.status(200).json({
        status: 200,
        message: `Success Delete Post ${id_post}`
    })
}

const edit_post = async (req, res) => {
    const { category, head, body, attachments, is_hide } = req.body
    const { id_post } = req.params

    const query = { _id: id_post }

    const payload = {
        username: "Gek Esa",
        display_name: "Esa_",
        category,
        head,
        body,
        attachments,
        profile_picture: "none",
        updated_at: new Date().toISOString(),
        is_hide: false
    }

    await Post.updateOne(query, payload)

    res.status(200).json({
        status: 200,
        message: `Success Update Post ${id_post}`
    })
}

const controller = {
    get_post,
    create_post,
    delete_post,
    edit_post,
    get_detail_post
}

export default controller