import React, { useState, useEffect } from 'react'
import { values, cloneDeep } from 'lodash';
import { Card } from 'ui-neumorphism';
import { createUseStyles } from 'react-jss';
import { NavTreeNode } from './NavTreeNode';

export interface NavTreeProps {
    theme: string;
    data: any;
    onSelect ?: (node: Node) => void;
    getElementToRender ?: (node: Node) => {};
}

interface Data {
    [id : string]: Node;
}

const generateNextID = (() => {
    let id = 0;
    return () => (++id).toString();
})();

const useStyles = createUseStyles({
    wrapper: {
    }
});


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
        }
        setNodes(nodes as Data);
    }
      
    const getRootNodes = () => {
        return values(nodes).filter((node: Node) => node.isRoot === true );
    }

    const getChildNodes = (node: Node) => {
        if (!node.children) return [];
        return node.children.map(id => nodes[id]);
    } 

    const onToggle = (node: Node) => {
        nodes[node.id].isOpen = !node.isOpen;
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
              onToggle={onToggle}
              onNodeSelect={onNodeSelect}
              getElementToRender={props.getElementToRender}
            />
          ))}
        </Card>
      )
}

