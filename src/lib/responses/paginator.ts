import type FloraModel from "$lib/models/plain";

export interface PaginateResult<T> {
    data: T[],
    paginator: Paginator
}

export interface Paginator {
    first: string | null,
    last: string | null
}

export async function paginate(result: Promise<FloraModel[]>): Promise<PaginateResult<FloraModel>> {
    return result.then(models => {
        let last = null;
        let first = null;

        if (models.length > 0) {
            last = models[models.length - 1]._id;
            first = models[0]._id;
        }

        return {
            data: models,
            paginator: {
                first: first,
                last: last
            }
        }
    })
}