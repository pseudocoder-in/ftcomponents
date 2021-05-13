import React, { useState, useEffect, useRef } from 'react'
import { ToggleButton , IconButton, overrideThemeVariables} from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import Icon from '@mdi/react'
import {mdiArrowDownBold, mdiArrowRightBold, mdiAccountPlus, mdiAccountEdit, mdiCloseThick} from '@mdi/js'
import { createUseStyles } from 'react-jss';
import Modal from 'react-modal';
import { Card, CardContent, CardAction, Button, TextField, Divider } from 'ui-neumorphism';
import { H6, Subtitle2} from 'ui-neumorphism';
import { cloneDeep } from 'lodash'

interface NavTreeNodeProps {
    node : Node;
    margin : number;
    getChildNodes : (node: Node) => Array<Node>;
    getNode : (id : string) => Node;
    onToggle : (node: Node) => void;
    onNodeSelect: (node: Node) => void;
    level : number;
    elementStyle : any;
    editButtonStyle : any;
    getNextID: () => string;
}

const defaultMargin = 10;
const defaultPadding = "10px"
const defaultLightIconColor = "#000000"
const defaultDarkIconColor = "#ffffff"

const useStyles = createUseStyles({
    elementWrapper: {
        marginLeft: (props: { level: number; margin: number }) => (props.level*props.margin)+"px", 
        display: "flex", 
        flexDirection: "row", 
        padding: defaultPadding,
        minWidth: "500px"
    },
    modalEdit:{
    },
    modalStyle: {
        display: "flex",
        paddingTop: "10vh",
        justifyContent: "center",
        alignItems: "center",
        '&:focus': {
            outline:0
        }
    },
    modalContent : {
        maxHeight : "70vh",
        minHeight : "40vh",
        display: "flex",
        flexDirection: "column",

    },
    modalButton : {
        display: "flex",
        justifyContent: "space-between",
        padding: defaultPadding
    },
    inSameRow : {
        display: "flex", 
        flexDirection: "row",
        justifyContent: "space-between",
    },
    childrenEditView: {
        padding: '10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: defaultPadding,
        overflow: 'auto'
    }
});

export const NavTreeNode = (props: NavTreeNodeProps) => {
    const { node, getChildNodes, level, onToggle, onNodeSelect, margin, elementStyle, editButtonStyle, getNextID, getNode} = props;
    const [activeNodeID, setActiveNodeID ] = useState("0");
    const [activeNode, setActiveNode ] = useState(node);
    const [modalElementEditIsOpen, setModalElementEditIsOpen] = useState(false);
    //const [activeHtmlElement, setActiveHtmlElement ] = useState(undefined);
    const classes = useStyles({margin, level});
    const activeElementRef = useRef<HTMLInputElement>(null);
    const activeAddElementRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        overrideThemeVariables({  
            '--light-bg': '#e4ebf5',
            '--light-bg-dark-shadow': '#bec8e4',
            '--light-bg-light-shadow': '#ffffff',
          
            '--dark-bg': '#444444',
            '--dark-bg-dark-shadow': '#363636',
            '--dark-bg-light-shadow': '#525252',
            })
            if(activeAddElementRef.current)
                scrollToElement(activeAddElementRef.current);
            else if(activeElementRef.current)
                scrollToElement(activeElementRef.current);
    },[activeNode])

    const scrollToElement = (targetElement : HTMLElement | undefined) => {
        if(targetElement ){
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start"
            });
        }
    };

    const handleElementClicked = (e: any) => {
        setActiveNodeID(e.value);
        onToggle(node);
        let updatedNode = cloneDeep(activeNode);
        setActiveNode(updatedNode);
        //scrollToElement(e.event.currentTarget.parentElement)
    }

    const handleElementEdit = (e: any) => {
        setModalElementEditIsOpen(true);
    }

    const afterModalElementEditIsOpen = () => {

    }

    const onCloseModalElementEdit = () => {
        setModalElementEditIsOpen(false);
    }

    const onSaveModalElementEdit = () => {
        //TO DO add all the data to current node
        
        setModalElementEditIsOpen(false);
    }

    const onCancelModalElementEdit = () => {
        setModalElementEditIsOpen(false);
    }

    const handleElementRemove = (e: any) => {
        
    }

    const handleChildRemove = (e: any, childID: string) => {
        let updatedNode = cloneDeep(activeNode);
        updatedNode.children = updatedNode.children.filter(id => id !== childID);
        setActiveNode(updatedNode);
    }

    const handleChildAdd = (e: any) => {
        let updatedNode = cloneDeep(activeNode);
        let nextIDtoAssign =  getNextID();
        /*let newChild : Node = {
            "id": nextIDtoAssign, 
            "name": "New child",
            "partner": "new Partner",
            "children": []
        }*/
        updatedNode.children.push(nextIDtoAssign);
        setActiveNode(updatedNode);
        //scrollToElement(e.currentTarget)
    }

    const getElementToRender = () => {
        return (
            <div className={classes.elementWrapper} ref={activeElementRef}>
                <div style={{ display: "flex" , alignItems: "center", paddingRight: defaultPadding}}>
                    {node.isOpen ? <Icon path={mdiArrowDownBold} size={0.6}/> : <Icon path={mdiArrowRightBold} size={0.6}/>}
                </div>
                <ToggleButton 
                    style={{...elementStyle}}
                    key={node.id}
                    value={node.id}
                    color='var(--primary)'
                    selected={activeNodeID === node.id}
                    size='small'
                    onClick={(e : Event) => handleElementClicked(e)}>
                        <Icon path={mdiAccountEdit} size={0.8} />
                        <Subtitle2 style={{paddingLeft: defaultPadding}}>{node.name}</Subtitle2>
                </ToggleButton>
                <div style={{...editButtonStyle}}>
                    <IconButton rounded text={false} size='small' onClick={(e : Event) => handleElementEdit(e)}>
                        <Icon path={mdiAccountEdit} size={0.8} />
                    </IconButton>
                    <IconButton rounded text={false} size='small' onClick={(e : Event) => handleChildAdd(e)}>
                        <Icon path={mdiAccountPlus} size={0.8} />
                    </IconButton>
                    <IconButton rounded text={false} size='small' onClick={(e : Event) => handleElementRemove(e)}>
                        <Icon path={mdiCloseThick} size={0.8} />
                    </IconButton>
                </div>
            </div>
            
        );
    }

    const getElementEditModal = () => {
        return (
            <Modal
            isOpen={modalElementEditIsOpen}
            onAfterOpen={afterModalElementEditIsOpen}
            onRequestClose={onCloseModalElementEdit}
            className={classes.modalStyle}
            ariaHideApp={false}
            contentLabel="Element Edit Modal"
            >
                <Card bordered elevation={5} className={classes.modalEdit}>
                <CardContent className={classes.modalContent}> 
                    <span className={classes.inSameRow}><Subtitle2>Name : </Subtitle2><TextField label={activeNode.name}></TextField></span>
                    <span className={classes.inSameRow}><Subtitle2>Spouse : </Subtitle2><TextField label={activeNode.partner}></TextField></span>
                    <Divider style={{marginBottom:defaultPadding}}/>
                    <div className={classes.childrenEditView}>
                    { 
                        activeNode.children.map((id)=>{
                            let childNode = getNode(id);
                            return (
                                <span className={classes.inSameRow}>
                                    <Subtitle2>Child :</Subtitle2>
                                    <TextField label={ childNode? childNode.name: ""}></TextField>
                                    <div style={{padding:defaultPadding}}>
                                    <IconButton rounded text={false} size='small' onClick={(e : Event) => handleChildRemove(e, id)}>
                                        <Icon path={mdiCloseThick} size={0.8} color={defaultLightIconColor}/>
                                    </IconButton>
                                    </div>
                                </span>
                            )
                        })
                    }
                    <div ref={activeAddElementRef}>
                    <IconButton rounded text={false} size='small' onClick={(e : Event) => handleChildAdd(e)}>
                        <Icon path={mdiAccountPlus} size={0.8} color={defaultLightIconColor}/>
                    </IconButton>
                    </div>
                    </div>
                </CardContent>
                <CardAction className={classes.modalButton}>
                    <Button color='var(--primary)' onClick={onCancelModalElementEdit}>
                        Cancel
                    </Button>
                    <Button color='var(--primary)' onClick={onSaveModalElementEdit}>
                        OK
                    </Button>
                </CardAction>
                </Card>
            </Modal>
        )
    }

    return (
        <React.Fragment>
        {getElementToRender()}
        { node.isOpen && getChildNodes(node).map(childNode => (
            <NavTreeNode 
            {...props}
            node={childNode}          
            level={level + 1}
            />
        ))}
        {getElementEditModal()}
        </React.Fragment>
    )
}

NavTreeNode.defaultProps = {
    level: 0,
    margin: 50,
    elementStyle: { minWidth: "250px", justifyContent: "left"},
    editButtonStyle: {display: "flex", justifyContent: "space-between", columnGap: "10px", paddingLeft: defaultPadding}
};
