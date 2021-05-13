import React, { useState, useEffect } from 'react'
import { values, cloneDeep } from 'lodash';
import { Card } from 'ui-neumorphism';
import { createUseStyles } from 'react-jss';
import { NavTreeNode } from './NavTreeNode';

export interface NavTreeProps {
    theme: string;
    data: any;
    onSelect ?: (node: Node) => void;
}

interface Data {
    [id : string]: Node;
}


const useStyles = createUseStyles({
    wrapper: {
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        scrollBehavior: 'auto',
        overflow: 'auto',
    }
});

let id = 0;

export const NavTree = (props: NavTreeProps) => {
    const [ nodes, setNodes ] = useState({} as Data);
    const classes = useStyles();
    
    useEffect(() => {
        //parse the data passed from the client;
        parseJsonData(props.data);
    },[]);


    const parseJsonData = (data: any) => {
        let nodes = cloneDeep(data);
        for(let key in nodes) {
            nodes[key].isOpen = false;
            nodes[key].isRoot = nodes[key].hasOwnProperty("isRoot") ? true : false;
            id = Math.max(Number(key), id);
        }
        setNodes(nodes as Data);
    }

    const generateNextID = () => {
        return (++id).toString();
    };    
      
    const getRootNodes = () => {
        return values(nodes).filter((node: Node) => node.isRoot === true );
    }

    const getChildNodes = (node: Node) => {
        if (!node.children) return [];
        return node.children.map(id => nodes[id]);
    } 

    const getNode = (id: string) => {
        return nodes[id];
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

    const rootNodes = getRootNodes();
    return (
        <Card bordered className={classes.wrapper}>
          { rootNodes.map((node : Node) => (
            <NavTreeNode 
              node={node}
              getChildNodes={getChildNodes}
              getNode={getNode}
              onToggle={onToggle}
              onNodeSelect={onNodeSelect}
              getNextID={generateNextID}
            />
          ))}
        </Card>
      )
}

