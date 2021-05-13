import React, { useState, useEffect, useRef } from 'react'
import { ToggleButton , IconButton, overrideThemeVariables} from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import Icon from '@mdi/react'
import {mdiArrowDownBold, mdiArrowRightBold, mdiAccountPlus, mdiAccountEdit, mdiCloseThick} from '@mdi/js'

interface NavTreeNodeProps {
    node : Node;
    margin : number;
    getChildNodes : (node: Node) => Array<Node>;
    onToggle : (node: Node) => void;
    onNodeSelect: (node: Node) => void;
    getElementToRender ?: (node: Node) => {};
    level : number;
    elementStyle : any;
    editButtonStyle : any;
}

const defaultMargin = 10;

export const NavTreeNode = (props: NavTreeNodeProps) => {
    const { node, getChildNodes, level, onToggle, onNodeSelect, margin, elementStyle, editButtonStyle} = props;
    const [activeNodeID, setActiveNodeID ] = useState("0");

    useEffect(()=>{
        overrideThemeVariables({  
            '--light-bg': '#e4ebf5',
            '--light-bg-dark-shadow': '#bec8e4',
            '--light-bg-light-shadow': '#ffffff',
          
            '--dark-bg': '#444444',
            '--dark-bg-dark-shadow': '#363636',
            '--dark-bg-light-shadow': '#525252',
            })
    },[])

    const handleStandaloneChange = (e: any) => {
        setActiveNodeID(e.value);
        onToggle(node);
    }


    const getElementToRender = (node: Node) => {
        if(props.getElementToRender){
            return (
                <div style={{ paddingLeft: level*margin+"px"}}>
                    { props.getElementToRender(node) }
                </div>
            )
        }
        else { 
            return (
                <div style={{ marginLeft: level*margin+"px", display: "flex", flexDirection: "row", padding: "10px"}}>
                    <div style={{ display: "flex" , alignItems: "center"}}>
                        {node.isOpen ? <Icon path={mdiArrowDownBold} size={0.5}/> : <Icon path={mdiArrowRightBold} size={0.5}/>}
                    </div>
                    <ToggleButton 
                        style={{...elementStyle}}
                        key={node.id}
                        value={node.id}
                        color='var(--primary)'
                        selected={activeNodeID === node.id}
                        size='small'
                        onClick={(e : Event) => handleStandaloneChange(e)}>
                    {node.name}
                    </ToggleButton>
                    <div style={{...editButtonStyle}}>
                        <IconButton rounded text={false} size='small'>
                            <Icon path={mdiAccountEdit} size={0.8} />
                        </IconButton>
                        <IconButton rounded text={false} size='small'>
                            <Icon path={mdiAccountPlus} size={0.8} />
                        </IconButton>
                        <IconButton rounded text={false} size='small'>
                            <Icon path={mdiCloseThick} size={0.8} />
                        </IconButton>
                    </div>
                </div>
                
            );
        }
    }

    return (
        <React.Fragment>
        {getElementToRender(props.node)}
        { props.node.isOpen && getChildNodes(props.node).map(childNode => (
            <NavTreeNode 
            {...props}
            node={childNode}          
            level={level + 1}
            />
        ))}
        </React.Fragment>
    )
}

NavTreeNode.defaultProps = {
    level: 0,
    margin: 50,
    elementStyle: { width: "250px", justifyContent: "left", padding: "10px"},
    editButtonStyle: {paddingLeft:"10px", paddingRight:"10px", display: "flex", justifyContent: "space-between", columnGap: "10px"}
};
