export default class ProductRecord {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly thumbnail: string;

    constructor(id: number, title: string, description: string, thumbnail: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
    }

    static fromAPI(record: {id: number, title: string, description: string, thumbnail: string}) {
        return new ProductRecord(record.id, record.title, record.description, record.thumbnail)
    }





}