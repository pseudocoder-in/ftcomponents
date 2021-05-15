import React, { useState, useEffect } from 'react'
import { values, cloneDeep } from 'lodash';
import { Card , TextField, Button} from 'ui-neumorphism';
import { createUseStyles } from 'react-jss';
import { NavTreeNode } from './NavTreeNode';
import * as constants from './constants';

export interface NavTreeProps {
    theme: string;
    data: any;
    onSelect ?: (node: Node) => void;
    width: string;
    height: string;
    onSave ?: (data: any) => void;
}

interface Data {
    [id : string]: Node;
}


const useStyles = createUseStyles({
    wrapper: {
        width: (props: { width: string; height: string }) => props.width,
        height: (props: { width: string; height: string }) => props.height,
        minHeight: (props: { width: string; height: string }) => props.height,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    innerWrapper: {
        width: '100vw',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        scrollBehavior: 'auto',
        overflow: 'auto',

    }
});

let id = 0;
let componentId = 122;

export const NavTree = (props: NavTreeProps) => {
    const [ nodes, setNodes ] = useState({} as Data);
    const [ orgNodes, setOrgNodes ] = useState({} as Data);
    const [ searchName, setSearchName ] = useState("");
    const [ maxID, setMaxID ] = useState(0);
    const [ theme, setTheme ] = useState("dark");

    let {width, height} = props
    const classes = useStyles({width, height});
    
    useEffect(() => {
        if(props.theme)
            setTheme(props.theme.toLowerCase());
        //parse the data passed from the client;
        parseJsonData(props.data);
    },[]);

    const replacer = (key: string, value: any) => {
        if (key=="isOpen") return undefined;
        return value;
    }
    const saveTreeData = () => {
        setOrgNodes(cloneDeep(nodes));
        let treeDataJson = JSON.stringify(nodes, replacer);
        if(props.onSave)
            props.onSave(treeDataJson);
    }

    const resetTreeData = () => {
        componentId++; //Hack because ToggleButton is not changing on active property
        id = maxID;
        setNodes(cloneDeep(orgNodes));
    }

    const parseJsonData = (data: any) => {
        let nodes = cloneDeep(data);
        for(let key in nodes) {
            nodes[key].isOpen = false;
            nodes[key].isRoot = nodes[key].hasOwnProperty("isRoot") ? nodes[key].isRoot == 'true' : false;
            id = Math.max(Number(key), id);
        }
        setNodes(nodes as Data);
        setOrgNodes(cloneDeep(nodes));
        setMaxID(id);
    }

    const generateNextID = () => {
        return (++id).toString();
    };    

    const getRootNodes = () => {
        if(searchName){
            return values(nodes).filter((node: Node) => node.name.toLowerCase().startsWith(searchName));
        }
       return values(nodes).filter((node: Node) => node.isRoot === true );
    }

    const getChildNodes = (node: Node) => {
        if (!node.children) return [];
        return node.children.map(id => nodes[id]);
    } 

    const getNode = (id: string) => {
        return nodes[id];
    }

    const updateNode = (node: Node, name : string, partnerName: string, childrenInfo: Map<string, string>) => {
        nodes[node.id].name = name;
        nodes[node.id].partner = partnerName;
        nodes[node.id].children = node.children;
        childrenInfo.forEach((value, key) => {
            if(!nodes[key])
                nodes[key] = { id:key, name:value, children:[]} as any;
            else
                nodes[key].name = value || "";
        })
        setNodes({...nodes});
    }

    const getParent = (id: string) => {
        return values(nodes).filter((node: Node) => node.children.includes(id))[0];
    }

    const removeNode = (node: Node) => {
        let parentNode = getParent(node.id);
        if(!parentNode){
            // TO DO: Handle root node deletion
            return ;
        }
        nodes[parentNode.id].children = nodes[parentNode.id].children.filter((id)=> id !== node.id);
        setNodes({...nodes});
    }

    const closeNodesRecursive = (node: Node) => {
        nodes[node.id].isOpen = false;
        getChildNodes(node).map(childNode => {
            if(childNode.isOpen){
                nodes[childNode.id].isOpen = false;
                closeNodesRecursive(childNode);
            }
        });
    }

    const onToggle = (node: Node) => {
        if(node.isOpen){ //close all open child nodes repectively
            closeNodesRecursive(node);
        } else {
            nodes[node.id].isOpen = true;
        }
        setNodes({...nodes});
    }

    const onNodeSelect = (node: Node) => {
        if(props.onSelect){
            props.onSelect(node);
        } else {

        }
    }

    const onSearching = (e: any) => {
        let searchName = e.value.toLowerCase();
        setSearchName(searchName);
    }

    const rootNodes = getRootNodes();
    return (
        <Card bordered className={classes.wrapper} dark={theme === "dark"}>
            <TextField label={"Search ..."} style={{justifyContent: 'flex-end'}} onChange={onSearching}/>
            <Card key={componentId+"view"} bordered className={classes.innerWrapper} dark={theme === "dark"}>
            { rootNodes.map((node : Node) => (
                <NavTreeNode 
                theme={theme}
                key={node.id}
                node={node}
                getChildNodes={getChildNodes}
                getNode={getNode}
                onToggle={onToggle}
                onNodeSelect={onNodeSelect}
                getNextID={generateNextID}
                updateNode={updateNode}
                removeNode={removeNode}
                />
            ))}
            </Card>
            <div style={{display:'flex', justifyContent: 'center', padding:constants.defaultPadding, columnGap:constants.defaultPadding}} >
            <Button dark={theme === "dark"} style={{width:"120px"}} onClick={resetTreeData}> Reset</Button>
            <Button dark={theme === "dark"} style={{width:"120px"}} onClick={saveTreeData}> Save</Button>
            </div>
        </Card>
      )
}

