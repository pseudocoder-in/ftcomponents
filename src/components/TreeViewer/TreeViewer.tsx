import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss';
import Tree from 'react-tree-graph';
import { zoom, ZoomBehavior, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select, selectAll } from 'd3-selection';
import {Card, TextField, IconButton} from 'ui-neumorphism';
import { values, cloneDeep } from 'lodash';
import Icon from '@mdi/react'
import {mdiShareVariant, mdiFullscreen, mdiFullscreenExit} from '@mdi/js'
//import * as constants from '../NavTree/constants'
import './style.css'

interface Data {
    [id : string]: Node;
}

interface D3Node {
    id: string;
    name: string;
    partner : {
        name: string;
    }
    children: D3Node[];
}

export interface TreeViewerProps {
    theme: string;
    data: Data;
    handleShare: () => void;
    handleFullScreen: () => void;
}

const useStyles = createUseStyles({
    wrapper: {
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
    }
});

let closeNodeSet = new Set<string>();
let zoomRef: ZoomBehavior<Element, unknown> | null = null;

export const TreeViewer = (props: TreeViewerProps) => {
    const [ rootNode, setRootNode ] = useState({} as D3Node);
    const [ activateTree, setTreeActive ] = useState(false);
    const [ rerenderTree, setRerenderTree ] = useState(false);
    const [ treeWidth, setTreeWidth ] = useState(1000);
    const [ treeHeight, setTreeHeight ] = useState(1000);
    const [ searchName, setSearchName ] = useState("");
    const [ theme, setTheme ] = useState("dark");
    const componentRef = useRef<HTMLDivElement>(null);

    let nextID = 0;
    const classes = useStyles();
    
    useEffect(() => {
        convertJSONtoD3Heirarchy(props.data);
        setTreeWidth(componentRef.current?.offsetWidth!);
        setTreeHeight(componentRef.current?.offsetHeight!);
        setTreeActive(true);
        if(props.theme)
            setTheme(props.theme.toLowerCase());
        if(activateTree){
            zoomRef = zoom().on("zoom", zoomed);
            selectAll('svg').each(function(){ 
                select(this).call(zoomRef as any)
                .on("dblclick.zoom", null)
            });
        }
    },[activateTree]);

    const getNextID = ()=> {
        ++nextID;
    }

    const reset = () => {
        selectAll('svg').each(function(){ 
            select(this).call((zoomRef as any).transform, zoomIdentity)
        });
    }

    const zoomed = (event : any) => {
        selectAll('g').each(function(){ 
            if(!(this as any).classList.contains('node'))
                select(this).attr("transform", event.transform)
        });
	}

    const buildChildrenNodes = (data: any, root: D3Node) => {
        data[root.id].children.forEach((childId : string) => {
            let child = {} as D3Node;
            child.id = childId;
            child.name = data[childId].name;
            child.partner = {name: data[childId].partner};
            child.children = [];
            buildChildrenNodes(data, child);
            root.children.push(child);
            closeNodeSet.add(childId);
        })
    }

    const convertJSONtoD3Heirarchy = (data: any) => {
        //get root node
        let root = {} as D3Node;
        let nodes = cloneDeep(data);
        for(let key in nodes) {
            if(nodes[key].isRoot) {
                root.id = nodes[key].id;
                root.name = nodes[key].name;
                root.partner = {name: nodes[key].partner};
                root.children = [];
                closeNodeSet.add(root.id);
                buildChildrenNodes(data, root);
                break;
            }
        }
        setRootNode(root);
    }

    const getNode = (nodeId: string, parent: D3Node) => {
        let collection = [parent];
        while(collection.length){
            let node = collection.shift();
            if(node!.id === nodeId){
                return node;
            } else {
                collection.unshift(...(node!.children.filter(child => !closeNodeSet.has(child.id))));
            }
        }
        return null;
    }

    const getChildren = (node : D3Node) => {
        if(closeNodeSet.has(node.id))
            return [];
        return node ? node.children : [];
    }

    const handleNodeClick = (event : MouseEvent, nodeId : string) => {
        event.preventDefault();
        if(closeNodeSet.has(nodeId)){
            closeNodeSet.delete(nodeId);
        } else{
            closeNodeSet.add(nodeId);
        }
        setRerenderTree(!rerenderTree);
    }

    const handleContextMenu = () => {

    }

    const filterNodes = (parent : D3Node, searchName: string) => {
        let cnt = 0;
        for(let idx = 0; idx < parent.children.length; ++idx){
            if(filterNodes(parent.children[idx], searchName)){
                cnt++;
            }
        }
        if(cnt > 0 || parent.name.toLowerCase().indexOf(searchName.toLowerCase()) === 0){
            if(closeNodeSet.has(parent.id))
                closeNodeSet.delete(parent.id);
            setRerenderTree(!rerenderTree);
            return parent;
        }
		closeNodeSet.add(parent.id);
        setRerenderTree(!rerenderTree);
        return null;
    }

    const onSearching= (e: any) => {
        let searchName = e.value.toLowerCase();
        filterNodes(rootNode, searchName);
    }

    const handleFullScreenClick = (e: any) => {
        e.preventDefault();
        props.handleFullScreen();
        console.log("full")
    }

    const handleShareClick = (e: any) => {
        e.preventDefault();
        props.handleShare();
        console.log("shared")
    }
    
    return (
        <div ref={componentRef}>
        <Card className={classes.wrapper}  dark={theme === 'dark'}>
            <TextField label={"Search ..."} style={{display: 'block', right:0, background:'transparent', position:'absolute'}} onChange={onSearching}/>
            { activateTree &&
            <Tree
                animated
                data={rootNode}
	            height={treeHeight}
	            width={treeWidth}
				margins={{bottom : 10, left : 20, right : 20, top : 10}}
                keyProp={"id"}
                getChildren={getChildren}
                gProps={{
					className: 'node',
					onClick: handleNodeClick,
					onContextMenu: handleContextMenu
				}}
                svgProps={{
					viewBox: 0+" "+0+" "+treeWidth+" "+treeHeight,
                    className: 'custom'
				}}
                textProps={{fontSize:16}}
				steps={30}
                rerender={rerenderTree}
            />
            }
            <div style={{display: 'block', padding:"10px", right:0, bottom:0, background:'transparent', position:'absolute'}}>
                <IconButton color='var(--primary)' rounded outlined dark={theme === 'dark'} onClick={handleShareClick}>
                    <Icon path={mdiShareVariant} size={0.8} />
                </IconButton>
                <span>&nbsp;&nbsp;</span>
                <IconButton color='var(--primary)' rounded outlined dark={theme === 'dark'} onClick={handleFullScreenClick}>
                    <Icon path={mdiFullscreen} size={0.8} />
                </IconButton>
            </div>
        </Card>
        </div>
    )
}
