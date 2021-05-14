## Resuable UI Componenents used in the Family Tree App

---

<br>

### NavTree

UI Component to load and edit the JSON data which is structured to create a tree easily.

```JS
import { NavTreeNode } from '@subhashjha/ftcomponents';
```

<br>

### TreeViewer

Component to load the tree json data and display it in a tree like structure. It uses react-tree-graph and d3 libraries.

```JS
import { TreeViewer } from '@subhashjha/ftcomponents';
```

### Sample Input Data (in JSON format)

```JSON
{
    "1":{
        "id" : "1",
        "name" : "Rajev Gupta",
        "children" : ["2", "3"],
        "isRoot" : "true",
        "partner" : "Aastha Gupta"
    },
    "2":{
        "id" : "2",
        "name" : "Sanjeev kumar Gupta",
        "children" : [],
        "partner" : "Chaaru Gupta"
    },
    "3":{
        "id" : "3",
        "name" : "Abhishek kumar Gupta",
        "children" : ["4", "5", "6"],
        "partner" : "Malaika Gupta"
    },
    "4":{
        "id" : "4",
        "name" : "Anirudh Gupta",
        "children" : [],
        "partner" : "Aasha Gupta"
    },
    "5":{
        "id" : "5",
        "name" : "Kamlesh Gupta",
        "children" : [],
        "partner" : "Radhika Gupta"
    },
    "6":{
        "id" : "6",
        "name" : "Akhilesh kumar Gupta",
        "children" : ["7"],
        "partner" : "Aarju Gupta"
    },
    "7":{
        "id" : "7",
        "name" : "Lokesh Gupta",
        "children" : ["8", "9"],
        "partner" : "Kalyani Gupta"
    },
    "8":{
        "id" : "8",
        "name" : "Rahul Gupta",
        "children" : [],
        "partner" : "Roshani Gupta"
    },
    "9":{
        "id" : "9",
        "name" : "Yahlika Gupta",
        "children" : [],
        "partner" : "Saurabh Gupta"
    }
}
```
