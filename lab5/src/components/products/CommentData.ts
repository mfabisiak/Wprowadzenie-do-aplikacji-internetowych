import type User from "./User.ts";

export default interface CommentData {
    readonly id: number;
    readonly body: string;
    readonly postId: number;
    readonly likes: number;
    readonly user: User;
}

