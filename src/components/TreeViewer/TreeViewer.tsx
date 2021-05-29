import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss';
import { zoom, ZoomBehavior, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select, selectAll } from 'd3-selection';
import { Card, TextField, IconButton, Tooltip } from 'ui-neumorphism';
import cloneDeep from 'lodash/cloneDeep';
import { mdiShareVariant, mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import { contextMenu, Menu, Item , theme, animation} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import Tree from 'react-tree-graph';

import './style.css'
import { TreeNode } from './types';
import { values } from 'lodash';
import { EditForm } from './EditForm';
const Icon = require('@mdi/react').default;

interface Data {
    [id: string]: TreeNode;
}

interface D3Node {
    id: string;
    name: string;
    partner: {
        name: string;
    }
    children: D3Node[];
}

export interface TreeViewerProps {
    theme: string;
    data: any;
    width: string;
    height: string;
    backgroundImage?: any;
    fontColor?: string;
    linkColor?: string;
    fontSize?: number;
    fontFamily?: string;
    linkOpacity?: number;
    editable?: boolean;
    handleShare?: () => void;
    handleFullScreen?: () => void;
    onUpdate?: (data: any) => void;
}

const menuId: string = 'adminMenu';

const AdminMenu = (props: any) => (
	<div>
		<Menu id={props.menuId} theme={props.dark? theme.dark : theme.light} animation={animation.scale} style={{background:'transparent', backdropFilter:'blur(1px)'}}>
			<Item onClick={() => props.onClickCb('EditInfo')}>
			Add/Edit Info
			</Item>
			<Item onClick={() => props.onClickCb('Remove')}>
			Remove Person
			</Item>
		</Menu>
    </div>
);

const useStyles = createUseStyles({
    wrapper: {
        width: (props: { width: string; height: string }) => props.width,
        height: (props: { width: string; height: string }) => props.height,
        overflow: 'auto',
        position: 'relative',
        backgroundImage: (props: { width: string; height: string, backgroundImage: any }) => props.backgroundImage
    }
});

let closeNodeSet = new Set<string>();
let zoomRef: ZoomBehavior<Element, unknown> | null = null;
let nextID = 0;

export const TreeViewer = (props: TreeViewerProps) => {
    const [rootNode, setRootNode] = useState({} as D3Node);
    const [activateTree, setTreeActive] = useState(false);
    const [rerenderTree, setRerenderTree] = useState(false);
    const [treeWidth, setTreeWidth] = useState(1000);
    const [treeHeight, setTreeHeight] = useState(1000);
    const [modalElementEditIsOpen, setModalElementEditIsOpen] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [nodes, setNodes] = useState({} as Data);
    const [theme, setTheme] = useState("dark");
    const [currentNodeId, setCuurrentNodeId] = useState("");

    const componentRef = useRef<HTMLDivElement>(null);

    let { width, height, backgroundImage } = props
    const classes = useStyles({ width, height, backgroundImage });

    useEffect(() => {
        setNodes(cloneDeep(props.data));
        convertTreeNodeDatatoD3Heirarchy(props.data);
        setTreeWidth(componentRef.current?.offsetWidth!);
        setTreeHeight(componentRef.current?.offsetHeight!);
        setTreeActive(true);
        if (props.theme)
            setTheme(props.theme.toLowerCase());
        if (activateTree) {
            zoomRef = zoom().on("zoom", zoomed);
            selectAll('svg').each(function () {
                if ((this as any).classList.contains('custom'))
                    select(this).call(zoomRef as any)
                        .on("dblclick.zoom", null)
            });
        }
    }, [activateTree, props]);

    const getNextID = () => {
        return (++nextID).toString();
    }

    const scrollToElement = (targetElement: HTMLElement | undefined) => {
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start"
            });
        }
    };

    const reset = () => {
        selectAll('svg').each(function () {
            select(this).call((zoomRef as any).transform, zoomIdentity)
        });
    }

    const zoomed = (event: any) => {
        selectAll('g').each(function () {
            if (!(this as any).classList.contains('node'))
                select(this).attr("transform", event.transform)
        });
    }

    const buildChildrenNodes = (data: any, root: D3Node) => {
        data[root.id].children.forEach((childId: string) => {
            let child = {} as D3Node;
            child.id = childId;
            child.name = data[childId].name;
            child.partner = { name: data[childId].partner };
            child.children = [];
            buildChildrenNodes(data, child);
            nextID = Math.max(Number(childId), nextID);
            root.children.push(child);
            closeNodeSet.add(childId);
        })
    }

    const convertTreeNodeDatatoD3Heirarchy = (data: any) => {
        //get root node
        let root = {} as D3Node;
        let nodes = cloneDeep(data);
        for (let key in nodes) {
            if (nodes[key].isRoot) {
                root.id = nodes[key].id;
                nextID = Math.max(Number(nodes[key].id), nextID);
                root.name = nodes[key].name;
                root.partner = { name: nodes[key].partner };
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
        while (collection.length) {
            let node = collection.shift();
            if (node!.id === nodeId) {
                return node;
            } else {
                collection.unshift(...(node!.children));
            }
        }
        return null;
    }

    const getChildren = (node: D3Node) => {
        if (closeNodeSet.has(node.id))
            return [];
        return node ? node.children : [];
    }

    const handleNodeClick = (event: MouseEvent, nodeId: string) => {
        event.preventDefault();
        if (closeNodeSet.has(nodeId)) {
            closeNodeSet.delete(nodeId);
        } else {
            closeNodeSet.add(nodeId);
        }
        setRerenderTree(!rerenderTree);
    }

    const filterNodes = (parent: D3Node, searchName: string) => {
        let cnt = 0;
        for (let idx = 0; idx < parent.children.length; ++idx) {
            if (filterNodes(parent.children[idx], searchName)) {
                cnt++;
            }
        }
        if (cnt > 0 || parent.name.toLowerCase().indexOf(searchName.toLowerCase()) === 0) {
            if (closeNodeSet.has(parent.id))
                closeNodeSet.delete(parent.id);
            setRerenderTree(!rerenderTree);
            return parent;
        }
        closeNodeSet.add(parent.id);
        setRerenderTree(!rerenderTree);
        return null;
    }

    const onSearching = (e: any) => {
        let searchName = e.value.toLowerCase();
        filterNodes(rootNode, searchName);
    }

    const handleFullScreenClick = (e: any) => {
        if (props.handleFullScreen)
            props.handleFullScreen();
    }

    const handleShareClick = (e: any) => {
        if (props.handleShare)
            props.handleShare();
    }

    const handleElementEdit = (e: any) => {
        setModalElementEditIsOpen(true);
    }

    const handleContextMenu = (event: MouseEvent, nodeId: string) => {
        if(props.editable){
            event.preventDefault();
            setCuurrentNodeId(nodeId);
            contextMenu.show({id: menuId, event: event, props:{nodeId:nodeId}});
        }
    }

    const getParent = (id: string) => {
        return values(nodes).filter((node: TreeNode) => node.children.includes(id))[0];
    }

    const removeNode = (nodeId: string) => {
        //modify the treeNode input
        let parentNode = getParent(nodeId);
        if (!parentNode) {
            // TO DO: Handle root node deletion
            return;
        }
        nodes[parentNode.id].children = nodes[parentNode.id].children.filter((id) => id !== nodeId);
        delete nodes[nodeId]; 
        setNodes({ ...nodes });
        if (props.onUpdate)
            props.onUpdate(nodes);
        
        //modify the D3Node structure
        let node = getNode(nodeId, rootNode);
        let parentD3Node = getNode(parentNode.id, rootNode);
        if(parentD3Node){
            parentD3Node.children.splice(parentD3Node.children.findIndex(child => child.id === nodeId), 1);
        }
        setRerenderTree(!rerenderTree);
    }

    const editNode = (nodeId: string) => {
        setModalElementEditIsOpen(true);
    }

    const adminMenuCb = (id: string) => {
        let nodeId = currentNodeId;
        if(id === 'EditInfo'){
            editNode(nodeId);
        } else if(id === 'Remove'){
            removeNode(nodeId);
        }
    }

    const getTreeNode = (nodeId: string) => {
        let d3Node = getNode(nodeId, rootNode) ;
        if(d3Node){
            let childArray = Array<string>();
            d3Node.children.forEach((child)=>{
                childArray.push(child.id);
            })
            let node  = {
                id: d3Node.id,
                name: d3Node.name,
                partner: d3Node.partner.name,
                children: childArray
            }
            return node;
        }
        return {name:"", partner:"", children:[], id:"-1"};
    }

    const updateNode = (node: TreeNode, name: string, partnerName: string, childrenInfo: Map<string, string>) => {
        nodes[node.id].name = name;
        nodes[node.id].partner = partnerName;
        nodes[node.id].children = node.children;
        childrenInfo.forEach((value, key) => {
            if (!nodes[key])
                nodes[key] = { id: key, name: value, children: [], partner:"" } as any;
            else
                nodes[key].name = value || "";
        })
        setNodes({ ...nodes });
        if (props.onUpdate)
            props.onUpdate(nodes);
    
        //Update the D3Node structure
        let d3Node = getNode(node.id, rootNode);
        if(d3Node){
            d3Node.name = name;
            d3Node.partner.name = partnerName;
            childrenInfo.forEach((value, key) => {
                let currentChild = d3Node!.children.find((child) => child.id === key);
                if (currentChild)
                    currentChild.name = value;
                else {
                    let newChild: D3Node = {
                        id: key,
                        name: value,
                        partner: { name: ""},
                        children: []
                    }
                    d3Node?.children.push(newChild);
                }
            })
        }
        setRerenderTree(!rerenderTree);
    }

    return (
        <div className={classes.wrapper} ref={componentRef}>
            <Card className={classes.wrapper} dark={theme === 'dark'}>
                <AdminMenu menuId={menuId} onClickCb={adminMenuCb} dark={theme === 'dark'}/>
                <TextField label={"Search ..."} style={{ display: 'block', right: 0, position: 'absolute' }} onChange={onSearching} />
                {activateTree &&
                    <Tree
                        animated
                        data={rootNode}
                        height={treeHeight}
                        width={treeWidth}
                        margins={{ bottom: 10, left: 20, right: 20, top: 10 }}
                        keyProp={"id"}
                        getChildren={getChildren}
                        gProps={{
                            className: 'node',
                            onClick: handleNodeClick,
                            onContextMenu: handleContextMenu
                        }}
                        svgProps={{
                            viewBox: 0 + " " + 0 + " " + treeWidth + " " + treeHeight,
                            className: 'custom'
                        }}
                        nodeProps={{
                            r:3, 
                            stroke: props.linkColor || `#2593b8`, 
                            fill: props.linkColor || `#2593b8`,
                            strokeWidth: '1.5px'
                        }}
				        textProps={{
                            fontSize:props.fontSize||14, 
                            fill:props.fontColor||(theme === 'dark'? 'white': 'black'), 
                            fontFamily:props.fontFamily,
                            textshadow: `0 1px 4px black`
                        }}
				        pathProps={{
                            stroke:props.linkColor || `#2593b8`, 
                            strokeOpacity:props.linkOpacity || 1,
                            strokeWidth: '1.5px',
                            fill: 'none'
                        }}
                        steps={30}
                        rerender={rerenderTree}
                    />
                }
                <div style={{ display: 'block', padding: "10px", right: 0, bottom: 0, background: 'transparent', position: 'absolute' }}>
                    {props.handleShare &&
                    <Tooltip dark={theme === 'dark'}top content={<div>Share your family tree</div>}>
                        <IconButton color='var(--secondary)' rounded text={false} dark={theme === 'dark'} onClick={handleShareClick}>
                            <Icon path={mdiShareVariant} size={0.8} />
                        </IconButton>
                    </Tooltip>
                    }
                    <span>&nbsp;&nbsp;</span>
                    {props.handleFullScreen && 
                    <Tooltip dark={theme === 'dark'} top content={<div>Toggle FullScreen Mode</div>}>
                        <IconButton color='var(--secondary)' rounded text={false} dark={theme === 'dark'} onClick={handleFullScreenClick}>
                            <Icon path={mdiFullscreen} size={0.8} />
                        </IconButton>
                    </Tooltip>
                    }
                </div>
            </Card>
            { modalElementEditIsOpen && 
                <EditForm 
                    theme= {theme}
                    height={height}
                    width={width}
                    node = {getTreeNode(currentNodeId)!}
                    getNextID= {getNextID}
                    getNode={getTreeNode}
                    updateNode= {updateNode}
                    scrollToElement={scrollToElement} 
                    setModalElementEditIsOpen={setModalElementEditIsOpen} 
                />}
        </div>
    )
}



    //const { node, getNextID, getNode, scrollToElement, setModalElementEditIsOpen, updateNode } = props;