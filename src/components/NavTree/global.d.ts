interface Node {
    id: string; //unique id for each node
    isRoot: boolean;
    isOpen: boolean;
    children: Array<string>; //Array of ids
    name: string;
    [key: string]: any; //client can add random properties 
}