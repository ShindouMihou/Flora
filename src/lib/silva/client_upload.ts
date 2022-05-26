import type Post from "$lib/models/post";
import axios from "axios";
import SilvaUtils from "./utils";

export async function uploadPost(file: File, post: Post) {
    return axios.post('/api/media', {
        type: "content/image",
        mimetype: file.type,
        postId: post._id
    }).then(result => result.data.reportTo).then(presignedUrl => {
        const form = new FormData()
        form.append("file", file, file.name)

        return axios.put(presignedUrl, form)
    }).then(_ => axios.post('/api/posts/' + post._id, {
        image: SilvaUtils.createSignRequestBody(SilvaUtils.mimetype(file.type), "content/image", "", post._id).fileName
    }))
}