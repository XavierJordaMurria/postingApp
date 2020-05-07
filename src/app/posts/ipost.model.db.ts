export default interface IPostDB {
    _id: string;
    title: string;
    content: string;
    imagePath?: string;
    creator: string;
}
