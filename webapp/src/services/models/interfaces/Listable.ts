export interface Listable {
    getId() : string;
    getColumns() : string[]
    getEntriesValues() : string[]
    getSmallEntriesValues() : string[]
    getTitle() : string
}