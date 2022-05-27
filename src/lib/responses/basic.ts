export default class FloraicResponses {
    public static UNAUTHORIZED: any = {
        body: {
            error: "You cannot perform this action."
        },
        status: 401
    }

    public static INTERNAL_ERROR: any = {
        body: {
            error: "An internal error occurred while trying to perform an action of this requested resource, this is something that can only be fixed by the developers."
        },
        status: 500
    }

    public static INVALID_RESOURCE_PARAMTERS: any = {
        body: {
            error: "Invalid resource query parameters."
        },
        status: 400
    }

    public static INVALID_RESOURCE_CONTENT_TYPE: any = {
        body: {
            error: "Invalid resource content-type header."
        },
        status: 400
    }

    public static INVALID_REQUEST: any = {
        body: {
            error: "Invalid request, does not meet the specifications."
        },
        status: 400
    }

    public static INVALID_RESOURCE: any = {
        body: {
            error: "Invalid resource, the resource does not exist."
        },
        status: 404
    }
}