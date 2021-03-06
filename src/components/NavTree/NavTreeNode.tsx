import React, { useState, useEffect, useRef } from 'react'
import { ToggleButton, IconButton, overrideThemeVariables, Tooltip } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import { mdiArrowDownBold, mdiArrowRightBold, mdiAccountPlus, mdiAccountEdit, mdiCloseThick, mdiAccount, mdiAccountGroup, mdiAccountHeart, mdiAccountSupervisor, mdiArrowUpBold } from '@mdi/js'
import { createUseStyles } from 'react-jss';
import { Subtitle2, Body2 } from 'ui-neumorphism';
import { EditForm } from './EditForm'
import * as constants from './constants'
import { TreeNode } from './types';
const Icon = require('@mdi/react').default;

interface NavTreeNodeProps {
    theme: string;
    node: TreeNode;
    margin: number;
    getChildNodes: (node: TreeNode) => Array<TreeNode>;
    getNode: (id: string) => TreeNode;
    onToggle: (node: TreeNode) => void;
    level: number;
    elementStyle: any;
    editButtonStyle: any;
    getNextID: () => string;
    updateNode: (node: TreeNode, name: string, partner: string, childrenInfo: Map<string, string>) => void;
    removeNode: (node: TreeNode) => void;
    addParent: (node: TreeNode) => void;
    height: string;
    width: string;
}

const useStyles = createUseStyles({
    elementWrapper: {
        marginLeft: (props: { level: number; margin: number }) => (props.level * props.margin) + "px",
        display: "flex",
        flexDirection: "row",
        padding: constants.defaultPadding,
        minWidth: "500px"
    },
    modalEdit: {
    },
    modalStyle: {
        display: "flex",
        paddingTop: "10%",
        justifyContent: "center",
        alignItems: "center",
        '&:focus': {
            outline: 0
        }
    },
    modalContent: {
        maxHeight: "70%",
        minHeight: "40%",
        display: "flex",
        flexDirection: "column",

    },
    modalButton: {
        display: "flex",
        justifyContent: "space-between",
        padding: constants.defaultPadding
    },
    inSameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    childrenEditView: {
        padding: '10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: constants.defaultPadding,
        overflow: 'auto'
    }
});

export const NavTreeNode = (props: NavTreeNodeProps) => {
    const { node, getChildNodes, level, onToggle, margin, elementStyle, editButtonStyle, getNextID, getNode, removeNode , addParent} = props;
    const [modalElementEditIsOpen, setModalElementEditIsOpen] = useState(false);
    const classes = useStyles({ margin, level });
    const activeElementRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeElementRef.current)
            scrollToElement(activeElementRef.current);
    }, [])

    const scrollToElement = (targetElement: HTMLElement | undefined) => {
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start"
            });
        }
    };

    const handleElementClicked = (e: any) => {
        onToggle(node);
    }

    const handleElementEdit = (e: any) => {
        setModalElementEditIsOpen(true);
    }

    const handleElementRemove = (e: any) => {
        removeNode(node);
    }
    
    const handleParentAdd= (e:any) => {
        addParent(node);
    }

    const getElementToRender = () => {
        return (
            <div className={classes.elementWrapper} ref={activeElementRef}>
                <div style={{ display: "flex", alignItems: "center", paddingRight: constants.defaultPadding }}>
                    {node.isOpen ? <Icon path={mdiArrowDownBold} size={0.6} /> : <Icon path={mdiArrowRightBold} size={0.6} />}
                </div>
                <ToggleButton
                    dark={props.theme === "dark"}
                    style={{ ...elementStyle }}
                    key={node.id}
                    value={node.id}
                    color='var(--primary)'
                    selected={node.isOpen}
                    size='small'
                    onClick={(e: Event) => handleElementClicked(e)}>
                    <Icon path={node.children.length > 0 ? mdiAccountGroup : (node.partner ? mdiAccountSupervisor : mdiAccount)} size={0.8} style={{ paddingLeft: "5px" }} />
                    <Subtitle2 style={{ paddingLeft: constants.defaultPadding }}>{node.name}</Subtitle2>
                </ToggleButton>
                <div style={{ ...editButtonStyle }}>
                    <IconButton rounded text={false} size='small' onClick={(e: Event) => handleElementEdit(e)} dark={props.theme === "dark"}>
                        <Icon path={mdiAccountEdit} size={0.8} />
                    </IconButton>
                    {false && <IconButton rounded text={false} size='small' onClick={(e: Event) => { }}>
                        <Icon path={mdiAccountPlus} size={0.8} />
                    </IconButton>}
                    <IconButton rounded text={false} size='small' onClick={(e: Event) => handleElementRemove(e)} dark={props.theme === "dark"}>
                        <Icon path={mdiCloseThick} size={0.8} />
                    </IconButton>
                    {node.isRoot && 
                        <Tooltip dark={props.theme === "dark"} top content={<div>Add Parent</div>}>
                            <IconButton rounded text={false} size='small' onClick={handleParentAdd} dark={props.theme === "dark"}>
                                <Icon path={mdiArrowUpBold} size={0.8} />
                            </IconButton>
                        </Tooltip>
                    }
                </div>
            </div>

        );
    }

    const getPartnerElementToRender = () => {
        return (
            <div className={classes.elementWrapper} ref={activeElementRef} style={{ paddingTop: "0px" }}>
                <div style={{ display: "flex", alignItems: "center", paddingRight: constants.defaultPadding }}>
                    {node.isOpen ? <Icon path={mdiArrowDownBold} size={0.6} color="transparent" /> : <Icon path={mdiArrowRightBold} size={0.6} color="transparent" style={{ paddingLeft: "5px" }} />}
                </div>
                <ToggleButton
                    dark={props.theme === "dark"}
                    disabled
                    style={{ ...elementStyle }}
                    key={node.id + "p"}
                    value={node.id + "p"}
                    color='var(--primary)'
                    size='small'>
                    <Icon path={mdiAccountHeart} size={0.6} />
                    <Body2 style={{ paddingLeft: constants.defaultPadding }}>{node.partner}</Body2>
                </ToggleButton>
            </div>
        );
    }

    return (
        <React.Fragment>
            {getElementToRender()}
            { node.isOpen && node.partner && getPartnerElementToRender()}
            { node.isOpen && getChildNodes(node).map(childNode => (
                <NavTreeNode
                    key={childNode.id}
                    {...props}
                    node={childNode}
                    level={level + 1}
                />
            ))}
            {modalElementEditIsOpen && <EditForm {...props} scrollToElement={scrollToElement} setModalElementEditIsOpen={setModalElementEditIsOpen} />}
        </React.Fragment>
    )
}

NavTreeNode.defaultProps = {
    level: 0,
    margin: 50,
    elementStyle: { minWidth: "250px", justifyContent: "left" },
    editButtonStyle: { display: "flex", justifyContent: "space-between", columnGap: "10px", paddingLeft: constants.defaultPadding }
};
