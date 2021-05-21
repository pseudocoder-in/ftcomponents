## Resuable UI Componenents used in the Family Tree App

---

<br>

### NavTree

UI Component to load and edit the tree data.
<img width="843" alt="Screenshot 2021-05-21 at 1 33 13 PM" src="https://user-images.githubusercontent.com/83978810/119103966-5c566480-ba39-11eb-9f17-ae30438d5b0d.png">
<img width="841" alt="Screenshot 2021-05-21 at 1 33 59 PM" src="https://user-images.githubusercontent.com/83978810/119103985-60828200-ba39-11eb-9551-d9e2312cf935.png">


#### Usage

```JS
import { NavTree } from '@pseudocoder-in/ftcomponents';
```
```JS
<NavTree 
    theme: "dark", // light/dark
    data: treeData, // Tree data in Json format
    width: "100vw",
    height: "100vh",
    onUpdate: {(updatedTreeData) => { /* Handle updated data in the client side*/}}
/>
```
<br>

### TreeViewer

Component to load the tree json data and display it in a tree like structure. It uses react-tree-graph and d3 libraries.

![treeviewer](https://user-images.githubusercontent.com/83978810/118334685-ae742300-b52b-11eb-8a76-e7959b7365b4.gif)

#### Usage

```JS
import { TreeViewer } from '@pseudocoder-in/ftcomponents';
```
```JS
<TreeViewer 
    theme: "dark", // light/dark
    data: treeData, // Tree data in Json format
    width: "100vw",
    height: "100vh",
    handleShare: () => { }, //Optional parameter
    handleFullScreen: () => { } //Optional parameter
/>
```

<br>

### Sample Input Data (treeData)

```JS
export const treeData = {
    "1":{
        id:"1",
        name:"Rajeev Gupta",
        partner:" Nita Gupta",
        children:["2","3","4"],
        isRoot: true
    },
    "2":{
        id:"2",
        name:"Aalok kumar Gupta",
        partner:"Rhea Gupta",
        children:["5"],
    },
    "3":{
        id:"3",
        name:"Sanjeev Gupta",
        partner:"Roshani Gupta",
        children:[],
    },
    "4":{
        id:"4",
        name:"Robin Gupta",
        partner:"Raashi Gupta",
        children:[],
    },
    "5":{
        id:"5",
        name:"Sorabh Gupta",
        partner:"",
        children:[],
    },

}
```
<br>

### Building from codes
- Clone the repository
- Run `npm install`
- Run `yarn storybook` for viewing the Componenents
- Run `yarn build` to create a buld in `dist` folder

<br>

> More customization coming soon ... :smile:
