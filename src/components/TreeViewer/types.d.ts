export interface TreeNode {
    id: string; //unique id for each node
    isRoot?: boolean;
    isOpen?: boolean;
    children: Array<string>; //Array of ids
    name: string;
    partner: string;
}