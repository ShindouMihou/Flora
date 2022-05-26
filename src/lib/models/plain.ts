import type { DeleteResult, UpdateResult } from "mongodb";

export default interface FloraModel {
    _id: string;
    without: (...elements: string[]) => FloraModel;
    update: ($set: any) => Promise<UpdateResult>;
    delete: () => Promise<DeleteResult>;
}