const tableChart = document.getElementById('task-chart');
let allTasks = [];
let activeTasks, completedTasks;
var bgLight = false;

window.onload = () => {
    var tempData = localStorage.getItem("allTasks");
    if (tempData != null) {
        allTasks = JSON.parse(tempData);
        for (i = 0; i <= allTasks.length; i++) {
            if (allTasks[i] != undefined) {
                displayChart(allTasks[i].description, i);
                if (allTasks[i].status === "completed") {
                    document.getElementById(`taskDone${i}`).setAttribute("checked", true);
                }
                setCounter();
                completedTasks = allTasks.filter((item) => {
                    return item.status === "completed";
                });
            }
        }
    }
};

// SWITCHING THEME
document.getElementById("toggle-mode").addEventListener("click", () => {
    const body = document.getElementsByTagName("BODY")[0];
    const sun = document.getElementById("sun-light");
    const moon = document.getElementById("moon-dark");
    if (bgLight === false) {
        body.classList.remove('dark-mode');
        body.classList.add("light-mode");
        bgLight = true;
        sun.style.display = "none";
        moon.style.display = "block";
    } else {
        body.classList.add('dark-mode');
        body.classList.remove("light-mode");
        bgLight = false;
        moon.style.display = "none";
        moon.style.display = "block";
    }
});

function sendTaskData(event) {
    let getTaskInfo = document.getElementById("task-input");
    let i = (allTasks.length == 0) ? 0 : allTasks.length;
    if (event.keyCode === 13) {
        let taskInfo = {
            "description": getTaskInfo.value,
            "status": "active"
        };
        allTasks.push(taskInfo);

        displayChart(getTaskInfo.value, i);
        // CLEARING THE INPUT FIELD
        getTaskInfo.value = '';
        document.getElementById("task-count").innerHTML = allTasks.length;

        localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }
}

// DISPLAY CHART
function displayChart(task, index) {
    // CREATING A TODO LIST ITEM
    var li = document.createElement("li");
    var input = document.createElement("input");
    var span = document.createElement("span");
    var label = document.createElement("label");
    var div = document.createElement("div");

    // ASSIGNING REQUIRED ATTRIBUTES
    li.setAttribute("id", `task#${index}`);
    li.setAttribute("draggable", "true");

    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "task-completed");
    input.setAttribute("class", "task-completed");
    input.setAttribute("id", `taskDone${index}`);
    input.setAttribute("onclick", `taskCompleted(this.checked,${index})`);

    span.setAttribute("class", "delete-radio");

    label.setAttribute("for", "task-completed");
    label.innerHTML = task;

    div.setAttribute("class", "delete-item");
    div.setAttribute("id", `delete#${index}`);
    div.setAttribute("onclick", `deleteItem(${index})`);


    // PUSHING DATA INTO HTML
    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(label);
    li.appendChild(div);
    tableChart.appendChild(li);
    setCounter();
}

// DELETE ITEM
function deleteItem(index) {
    let delTask = document.getElementById(`task#${index}`);
    let nextIndex = index + 1;
    let lastIndex = allTasks.length - 1;

    while (nextIndex <= lastIndex) {
        // REVISING INDEX NUMBER FOR DELETE BUTTON
        document.getElementById(`delete#${nextIndex}`).setAttribute("onclick", `deleteItem(${nextIndex - 1})`);
        document.getElementById(`delete#${nextIndex}`).id = `delete#${nextIndex - 1}`;

        // REVISING INDEX NUMBER FOR CHECKBOX
        document.getElementById(`taskDone${nextIndex}`).setAttribute("onclick", `taskCompleted(this.checked,${nextIndex - 1})`);
        document.getElementById(`taskDone${nextIndex}`).id = `taskDone${nextIndex - 1}`;

        //REVISING INDEX NUMBER FOR LI CONTAINER
        document.getElementById(`task#${nextIndex}`).id = `task#${nextIndex - 1}`;

        nextIndex += 1;
    }
    allTasks.splice(index, 1);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    setCounter();
    tableChart.removeChild(delTask);

}

// UPDATING COMPLETED TASKS
function taskCompleted(status, index) {
    if (status) {
        allTasks[index].status = "completed";
    } else {
        allTasks[index].status = "active";
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    setCounter();
}

// COUNTER RESET
function setCounter() {
    activeTasks = allTasks.filter((item) => {
        return item.status === "active";
    });
    document.getElementById("task-count").innerHTML = activeTasks.length;
}

//DRAG & DROP to SORT LISt
const dragArea = document.querySelector("#task-chart");
new Sortable(dragArea, {
    animation: 350
});

// FILTER ITEMS
let showAll = document.getElementById("showAll");
let showActive = document.getElementById("showActive");
let showDone = document.getElementById("showDone");
let currHigh = 'all';

function showAllItems() {
    if (allTasks != undefined) {
        tableChart.innerHTML = '';
        for (i = 0; i <= allTasks.length; i++) {
            if (allTasks[i] != undefined) {
                displayChart(allTasks[i].description, i);
                if (allTasks[i].status === "completed") {
                    document.getElementById(`taskDone${i}`).setAttribute("checked", true);
                }
            }
        }
    }
    if (currHigh === 'active') {
        showActive.classList.remove("active");
    } else if (currHigh === 'done') {
        showDone.classList.remove("active");
    }
    showAll.classList.add("active");
    currHigh = 'all';

}

function showActiveItems() {
    if (activeTasks != undefined) {
        tableChart.innerHTML = '';
        for (i = 0; i <= activeTasks.length; i++) {
            if (activeTasks[i] != undefined) {
                displayChart(activeTasks[i].description, i);
            }
        }
    }
    if (currHigh === 'all') {
        showAll.classList.remove("active");
    } else if (currHigh === 'done') {
        showDone.classList.remove("active");
    }
    showActive.classList.add("active");
    currHigh = 'active';

}

function showCompletedItems() {
    if (completedTasks != undefined) {
        tableChart.innerHTML = '';
        for (i = 0; i <= completedTasks.length; i++) {
            if (completedTasks[i] != undefined) {
                displayChart(completedTasks[i].description, i);
                document.getElementById(`taskDone${i}`).setAttribute("checked", true);
            }
        }
    }
    if (currHigh === 'all') {
        showAll.classList.remove("active");
    } else if (currHigh === 'active') {
        showActive.classList.remove("active");
    }
    showDone.classList.add("active");
    currHigh = 'done';

}

function clearCompleted() {
    let i = 0;
    while (i <= allTasks.length) {
        if (allTasks[i] != undefined && allTasks[i].status === 'completed') {
            deleteItem(i);
        }
        tableChart.innerHTML = '';
        for (i = 0; i <= allTasks.length; i++) {
            if (allTasks[i] != undefined) {
                displayChart(allTasks[i].description, i);
            }
        }

        i++;
    }
}






// TESTING