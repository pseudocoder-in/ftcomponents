import React, { useState, useEffect, useRef } from 'react'
import { IconButton, overrideThemeVariables } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import { mdiAccountPlus, mdiCloseThick } from '@mdi/js'
import { createUseStyles } from 'react-jss';
import Modal from 'react-modal';
import { Card, CardContent, CardAction, Button, TextField, Divider } from 'ui-neumorphism';
import { Subtitle2 } from 'ui-neumorphism';
import cloneDeep from 'lodash/cloneDeep'
import * as constants from './constants'
import { TreeNode } from './types';
const Icon = require('@mdi/react').default;


interface EditFormProps {
    theme: string,
    node: TreeNode,
    getNextID: () => string;
    getNode: (id: string) => TreeNode;
    scrollToElement: (element: HTMLElement) => void;
    setModalElementEditIsOpen: (isOpen: boolean) => void;
    updateNode: (node: TreeNode, name: string, partner: string, childrenInfo: Map<string, string>) => void;
    height: string;
    width: string;
};

const useStyles = createUseStyles({
    modalEdit: {
    },
    modalStyle: {
        display: "flex",
        paddingTop: "10%",
        justifyContent: "center",
        alignItems: "center",
        '&:focus': {
            outline: 0
        },
        width: (props: { width: string; height: string }) => props.width,
        height: '75%'
    },
    modalContent: {
        maxHeight: "40vh",
        minHeight: "30vh",
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

let childVewKey = 11;

export const EditForm = (props: EditFormProps) => {

    const { node, getNextID, getNode, scrollToElement, setModalElementEditIsOpen, updateNode } = props;
    const [activeNode, setActiveNode] = useState(node);
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [name, setName] = useState(node.name);
    const [partnerName, setPartnerName] = useState(node.partner);
    const [childrenNames, setChildrenNames] = useState<Map<string, string>>(new Map<string, string>());

    let { width, height } = props;
    const classes = useStyles({ width, height });
    const activeAddElementRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeAddElementRef.current)
            scrollToElement(activeAddElementRef.current);
    }, [activeNode])

    const afterModalElementEditIsOpen = () => {

    }

    const onCloseModalElementEdit = () => {
        setModalIsOpen(false);
        setModalElementEditIsOpen(false);
    }

    const onSaveModalElementEdit = () => {
        //TO DO add all the data to current node
        updateNode(activeNode, name, partnerName, childrenNames);
        setModalIsOpen(false);
        setModalElementEditIsOpen(false);
    }

    const onCancelModalElementEdit = () => {
        setModalIsOpen(false);
        setModalElementEditIsOpen(false);
    }

    const handleChildRemove = (e: any, childID: string) => {
        childVewKey++;
        let updatedNode = cloneDeep(activeNode);
        updatedNode.children = updatedNode.children.filter(id => id !== childID);
        setActiveNode(updatedNode);
    }

    const handleChildAdd = (e: any) => {
        let updatedNode = cloneDeep(activeNode);
        let nextIDtoAssign = getNextID();
        updatedNode.children.push(nextIDtoAssign);
        let newNamesObj = cloneDeep(childrenNames);
        newNamesObj.set(nextIDtoAssign, e.value);
        setChildrenNames(newNamesObj);
        setActiveNode(updatedNode);
        //scrollToElement(e.currentTarget)
    }

    const onChildNameChange = (e: any, id: string) => {
        let newNamesObj = cloneDeep(childrenNames);
        newNamesObj.set(id, e.value);
        setChildrenNames(newNamesObj);
    }

    const onPartnerNameChange = (e: any) => {
        setPartnerName(e.value);
    }

    const onNameChange = (e: any) => {
        setName(e.value);
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterModalElementEditIsOpen}
            className={classes.modalStyle}
            ariaHideApp={false}
            contentLabel="Element Edit Modal"
            style={{
                overlay: {
                    backgroundColor: props.theme === "dark" ? constants.OVERLAY_DARK_COLOR : constants.OVERLAY_LIGHT_COLOR,
                }
            }}
        >
            <Card bordered elevation={5} className={classes.modalEdit} dark={props.theme === "dark"}>
                <CardContent className={classes.modalContent}>
                    <span className={classes.inSameRow}>
                        <Subtitle2 dark={props.theme === "dark"}>Name : </Subtitle2>
                        <TextField id={activeNode.id} value={activeNode.name} onChange={onNameChange} dark={props.theme === "dark"}></TextField>
                    </span>
                    <span className={classes.inSameRow}>
                        <Subtitle2 dark={props.theme === "dark"}>Spouse : </Subtitle2>
                        <TextField id={activeNode.id + 'p'} value={activeNode.partner} onChange={onPartnerNameChange} dark={props.theme === "dark"}></TextField>
                    </span>
                    <Divider style={{ marginBottom: constants.defaultPadding }} dark={props.theme === "dark"} />
                    <div key={childVewKey + "cview"} className={classes.childrenEditView}>
                        {
                            activeNode.children.map((id) => {
                                let name = childrenNames.get(id) || (getNode(id) ? getNode(id).name : "");
                                return (
                                    <span key={id} className={classes.inSameRow}>
                                        <Subtitle2 dark={props.theme === "dark"}>Child :</Subtitle2>
                                        <TextField id={id} value={name} onChange={(e: any) => onChildNameChange(e, id)} dark={props.theme === "dark"}></TextField>
                                        <div style={{ padding: constants.defaultPadding }}>
                                            <IconButton rounded text={false} size='small' onClick={(e: Event) => handleChildRemove(e, id)} dark={props.theme === "dark"}>
                                                <Icon path={mdiCloseThick} size={0.8} />
                                            </IconButton>
                                        </div>
                                    </span>
                                )
                            })
                        }
                        <div ref={activeAddElementRef}>
                            <IconButton rounded text={false} size='small' onClick={(e: Event) => handleChildAdd(e)} dark={props.theme === "dark"}>
                                <Icon path={mdiAccountPlus} size={0.8} />
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
