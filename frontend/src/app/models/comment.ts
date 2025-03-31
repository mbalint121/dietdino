export class Comment{
    ID?: number;
    authorID?: number;
    author!: string;
    recipeID!: number;
    text!: string;
    commentDateTime!: Date;
}