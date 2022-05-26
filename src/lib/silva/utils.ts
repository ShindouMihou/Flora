export default class SilvaUtils {

    public static createSignRequestBody(
        mimetype: 'image/jpeg' | 'image/png',
        type: 'content/image',
        responsiblity: string,
        entityId: string
    ) {
        let fileName;
        if (type === 'content/image') fileName = 'cover'
    
        fileName += '.'
        fileName += mimetype.replace('image/', '')
    
        let directory;
        if (type === 'content/image') directory = `posts/${entityId}/`
    
        return {
            "fileName": fileName,
            "directory": directory,
            "responsiblity": responsiblity
        }
    }

    public static mimetype(fromMimeType: string): 'image/jpeg' | 'image/png' {
        let mimetype: 'image/jpeg' | 'image/png' = 'image/jpeg';
        if (fromMimeType.toLowerCase() === 'image/png') mimetype = 'image/png'

        return mimetype;
    }
}