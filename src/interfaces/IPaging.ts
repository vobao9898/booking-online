export interface IPaging<T> {
    data: T[];
    count: number;
    pages: number;
}