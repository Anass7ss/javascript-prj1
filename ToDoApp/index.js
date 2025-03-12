// declaration
let main_button = cquery(".main-btn")
let popup = cquery("#popup")
let Tasks_list = [{id:0,content:"Workout", tags:["fitness" , "health"],status:false},
                  {id:1,content:"Study", tags:["knowlegde"],status:false},
                  {id:2,content:"Visit Grandma", tags:["family"],status:false},
                  {id:3,content:"Buy groceries", tags:["health" , "food"],status:false}
                 ];

// class to create Tasks
class Task{
    constructor(id,content, tags,status){
        this.id = id;
        this.content = content;
        this.tags = tags;
        this.status = status;
    }
}
let tag_Container = cquery("#tag-container");
let  tag_input= cquery("#tag-input");
let task_input = cquery("#task-input");
let task_num = cquery("#tasks-num")
let day = cquery("#date-1");
let months = cquery("#date-2");
let save_button = cquery("#save");
let input_help = cquery("#task-help");
let tasks_parent = cquery(".tasks");
let clear = cquery(".clear-btn");

let widgets_tab = cquery("#widgets-tab");
let themes_tab = cquery("#themes-tab");
let leader_tab = cquery("#board-tab");
let sidebar= cquery("#sidebar");
let theme_sidebar= cquery("#theme-sidebar");


let count = 1 ;
let lastKeyPressTime = 0;

let workingMemory ;

let edit = false;

taskLoad();

// theme variables
let Themes_list = [];
let current_theme={name:"Nature", primary:"white", secondary:"#C3E703" , tertiary: "black"};


document.documentElement.style.setProperty('--secondary-color', current_theme.secondary);
document.documentElement.style.setProperty('--primary-color', current_theme.primary);
document.documentElement.style.setProperty('--tertiary-color', current_theme.tertiary);



//events
main_button.addEventListener("click",mainButtonMove)

tag_input.addEventListener("keyup",tagShower)

tag_input.addEventListener("keydown",keyboardRM)

tag_Container.addEventListener("click",removeTag)

save_button.addEventListener("click",taskSave)

clear.addEventListener("click",Clear);

document.addEventListener("mousemove",ShowOptions)

widgets_tab.addEventListener("click",showTab);
leader_tab.addEventListener("click",showTab);
themes_tab.addEventListener("click",showTab);

document.addEventListener("DOMContentLoaded",getThemes);
document.addEventListener("DOMContentLoaded",arrowAnimation);


// dragover event
tasks_parent.addEventListener("dragover",(e)=>{
    e.preventDefault();
    let dragged = document.querySelector(".dragging");
    //  find the tasks i'm over
    let afterElement = getOverElementTask(e.clientY);
    
    if(afterElement){
        tasks_parent.insertBefore(dragged , afterElement)
    }else{
        tasks_parent.append(dragged);
    }
})


// functions

function getOverElementTask(y){
    let draggable = [...tasks_parent.querySelectorAll(".dr:not(.dragging)")];
    // calculate with reduce
    return draggable.reduce((closest, item)=>{
            const box = item.getBoundingClientRect()
            const offset = y - box.top - box.height /2;
            if(offset <0 && offset > closest.offset ){
                return {offset: offset , element:item}
            }else{
                return closest
            }
    },{offset: Number.NEGATIVE_INFINITY}).element;
}



function arrowAnimation(){
    setTimeout(()=>{
        document.getElementById("arrow-1").style.display = "none";
        document.getElementById("arrow-2").style.display = "none";

    },1435)
    document.getElementById("arrow-1").style.animation = "hintTab 0.7s linear 0.1s 2 normal forwards";
    document.getElementById("arrow-2").style.animation = "hintTab 0.7s linear 0.18s 2 normal forwards";
}

function getThemes(){
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "Themes.JSON", true)

    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let data = JSON.parse(this.responseText);
            Themes_list = data;
        }
    }

    xhr.send()
}

function cquery(str){
    return document.querySelector(str)
}

function mainButtonMove(){
    //animate main
    
    let findR = main_button.classList.contains("rotate")

    // remove animations
    main_button.classList.remove("return", "rotate")

    //add animations
    main_button.classList.toggle("rotate", !findR)
   
    main_button.classList.toggle("return", findR)

    //animate popup
    let findL = popup.classList.contains("unlock")

    // remove animations
    popup.classList.remove("unlock", "lock")

    //add animations
    popup.classList.toggle("unlock", !findL)
   
    popup.classList.toggle("lock", findL)


    // animate clear button
    let findC = clear.classList.contains("left-animation")

    // remove animations
    clear.classList.remove("left-animation", "left-animation-return")

    //add animations
    clear.classList.toggle("left-animation", !findC)
   
    clear.classList.toggle("left-animation-return", findC)
}




function tagShower(event){
    if(event.key == "Enter" || event.key == ","){
        // prepare str
        let tag = tag_input.value.trim().replace(/,$/,"");

        if(tag){
            let tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.innerText = tag;
            tagElement.style.display = "inline-block";
            tag_Container.insertBefore(tagElement,tag_input)

        }
        //empty input
        tag_input.value = "";

    }
}

function removeTag(event){
    if (event.target.classList.contains("tag")){
        event.target.remove()
    }
}

function keyboardRM(event){
   
        
        if(event.key == "Delete"){
        const currentTime = new Date().getTime();
        const passedTime = currentTime - lastKeyPressTime;
  
       
        if (passedTime < 300) {
        let tagsCollection = document.getElementsByClassName("tag");
        tagsCollection[tagsCollection.length-1].remove();
    }

    lastKeyPressTime = currentTime;
}

}

function taskSave(e){
    e.preventDefault()
    let tagList= tag_Container.getElementsByClassName("tag");
    let pass = true;
    if (task_input.value == ""){
        pass = false;
        task_input.style.border = "2px solid red";
        input_help.style.visibility = "visible";
    }else{
        task_input.style.border = "border: 2px solid #e7e5e5;";
        input_help.style.visibility = "hidden";
    }

    
    // create object
    if(pass){
        let tags = [];
        for (let i =0 ;i<=tagList.length-1;i++){
            tags.push(tagList[i].innerText)
        }
        if(!edit){
        let task = new Task(count,task_input.value,tags,false)
        Tasks_list.push(task)
        
        for (let i = tagList.length-1;i>=0;i--){
            tagList[i].remove();
        }
        count += 1;
        // sucess popup
        }else{
            workingMemory.tags = tags;
            workingMemory.content = task_input.value;
            edit = false;
        }
        task_input.value = "";
        tag_input.value ="";
        for (let i =tagList.length-1 ;i>=0;i--){
            tagList[i].remove()
        }
        taskLoad();
    }else{
        //fail popup

    }
}

function taskLoad(){
    task_num.innerText = `${Tasks_list.length} Tasks`;
    tasks_parent.innerHTML = "";
    let txt = "";
    Tasks_list.forEach((itemValue)=>{
        let status = "";
        let spans = "";
        let style = "style='text-decoration:none'; ";
        itemValue.tags.forEach((item)=>{
            spans += `<span class="tag" style="font-size: 10px; ">#${item}</span>`
        })
        if (itemValue.status == true){
            status = "checked";
            style = "style='text-decoration:line-through; opacity:0.7;'"
        }
        txt += `<div class=" d-flex justify-content-start align-items-center gap-2  my-3 tasks-list dr" id="i-${itemValue.id}" draggable="true"><i  style="height: 2px !important;" class="fa-solid fa-grip-vertical"></i><p class="ms-2 fs-5" "><span class="content" ${style}>${itemValue.content}</span><br>${spans}</p><input type="checkbox" class="checkbox-round me-2" name="" ${status}></div>`
    })
    tasks_parent.innerHTML = txt;
    let checkbox_list = tasks_parent.getElementsByClassName("checkbox-round");
    for (let i =0;i<checkbox_list.length;i++){
        checkbox_list[i].addEventListener("change",taskCheck)
    }

    // add event to tasks
    let tasks_elements = document.getElementsByClassName("tasks-list")
    for(let i =0;i<tasks_elements.length;i++){
        tasks_elements[i].querySelector(".content").addEventListener("dblclick",editTask);
        tasks_elements[i].addEventListener("dragstart",(e)=>{
            e.target.classList.add("dragging", "draggable");
        });
        tasks_elements[i].addEventListener("dragend",(e)=>{
            e.target.classList.remove("dragging", "draggable");
            //save order
            Tasks_list = [];
            let count = 0;
            let draggable = [...tasks_parent.querySelectorAll(".dr")];
            draggable.forEach((itemValue)=>{
                let tags = [...itemValue.querySelectorAll(".tag")].map((item)=>{
                    return item.textContent.substring(1);
                })
                let obj = {id:count,content:itemValue.querySelector("span").textContent,tags:tags, status:itemValue.querySelector("input").checked};
                Tasks_list.push(obj);
                
                count++;
            })
            taskLoad();
        });
    }


}

function taskCheck(event){
    let parent = event.target.parentNode;

    let findTask = Tasks_list.find((itemValue)=>{return parent.id.match(/\d+$/) == itemValue.id})
    let findTask_id = Tasks_list.findIndex((itemValue)=>{return parent.id.match(/\d+$/) == itemValue.id})
    if (event.target.checked){
        parent.querySelector(".content").style.textDecoration = "line-through";
        parent.querySelector(".content").style.opacity = "0.7"
        // sync check
        findTask.status = true;

        // input bg
        event.target.style.backgroundColor = current_theme.secondary;

        // push to bottom
        Tasks_list.splice(findTask_id,1)
        Tasks_list.splice(Tasks_list.length ,0, findTask)
        taskLoad()
    }else{
        parent.querySelector(".content").style.textDecoration = "none"
        parent.querySelector(".content").style.opacity = "1";
        findTask.status = false;
        // input tag
        event.target.style.backgroundColor = "white";
    }
}

function loadTime(){
    let date = new Date();
    let dayVal = date.getDate();
    let suffix = "th" ;
    switch (dayVal){
        case 1:
            suffix = "st";
            break;
        case 2:
            suffix = "nd";
            break;
        case 21:
            suffix = "st";
            break;
        case 22:
            suffix = "nd";
            break;
        case 31:
            suffix = "st";
            break;
    }
    day.innerText = `Today,${dayVal}${suffix}`
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
     let nameMonth = month[date.getMonth()];
     months.innerText = nameMonth

}

loadTime()

  
function Clear(){
    let tasks =tasks_parent.children;
    for (let i = tasks.length-1;i>=0;i--){
       if( tasks[i].lastElementChild.checked == true){
        let findTaskI = Tasks_list.findIndex((itemValue)=>{return tasks[i].id.match(/\d+$/) == itemValue.id})
        Tasks_list.splice(findTaskI,1)
        tasks[i].remove();
        
       }
    }
    taskLoad()
}

function ShowOptions(event){
    
    if(event.clientX > 1400 && theme_sidebar.style.animationName !=  "showBar"){
        // show animation
        sidebar.style.animation = "showwidget 1S ease-in-out 0S 1 normal forwards";
        
    }else if ( sidebar.style.animationName == "showwidget" && event.clientX < 950){
        sidebar.style.animation = "hidewidget 1S ease-in-out 0S 1 normal forwards";
    }else if (theme_sidebar.style.animationName ==  "showBar" && event.clientX < 950){
        theme_sidebar.style.animation = "hideBar 1S ease-in-out 0S 1 normal forwards";
        sidebar.style.animation = "unfollow 1S ease-in-out 0S 1 normal forwards";
    }
}

function showTab(e){
    if (theme_sidebar.style.animationName !=  "showBar"){
        theme_sidebar.style.animation = "showBar 1S ease-in-out 0S 1 normal forwards";
        sidebar.style.animation = "follow 1.1S ease-in-out 0S 1 normal forwards";
        
    }
    // change content
    let id = e.target.id;
    switch(id){
        case "themes-tab":
            theme_sidebar.innerHTML = `<h4 class="text-white">Modes</h4>
            <div id="mode-switch"></div>
            <h4 class="text-white">Themes</h4>
            <table class="table table-dark table-hover" id="themes-table">
            <tr>
            <td>
                <div style="background-color: white; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #C3E703;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Nature</span>
            </td>
        </tr>

        <tr>
            <td>
                <div style="background-color: #E31B90; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #FEFFFF;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Lolipop</span>
            </td>
        </tr>

        <tr>
            <td>
                <div style="background-color: #262626; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #DC2D42;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Dark</span>
            </td>
        </tr>

        <tr>
            <td>
                <div style="background-color: #0336FF; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #FF0266 ;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Alive</span>
            </td>
        </tr>

        <tr>
            <td>
                <div style="background-color: #373740; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #1EB980;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Cyber</span>
            </td>
        </tr>

        <tr>
            <td>
                <div style="background-color: #FFFFFF; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;" ></div>
                <div style="background-color: #FF902A;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Orange</span>
            </td>
        </tr>
        
        <tr>
            <td>
                <div style="background-color: #080808; width:170px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 8px;"></div>
                <div style="background-color: #146EF5;  width:70px; height: 20px; display: inline-block;  border: 1px white solid; border-radius: 30px; margin-right: 20px;"></div>
                <span style="position: relative; bottom: 3px;">Hero</span>
            </td>
        </tr>
            </table>`;
            let themes_table = cquery("#themes-table")
            let rows = themes_table.getElementsByTagName("tr");
            for(let i=0;i<rows.length;i++){
                rows[i].addEventListener("click",chooseTheme)
                 }
            break
        case "widgets-tab":
            theme_sidebar.innerHTML = `
            
            `;
            break
        case "board-tab":
            theme_sidebar.innerHTML = `<h3 class="text-white mb-3">Score</h3>
            <h6 class="text-white">300 pts</6>
            <h3 class="text-white">Leaderboard</h3>
            <table class="table table-dark table-striped mt-3" >
            <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Region</th>
        </tr>
        <tr>
            <td>Ilyas</td>
            <td>4000 pts</td>
            <td>Africa</td>
        </tr>
        <tr>
            <td>Micheal</td>
            <td>3324 pts</td>
            <td>Europe</td>
        </tr>
        <tr>
            <td>Alex</td>
            <td>2600 pts</td>
            <td>Europe</td>
        </tr>
        <tr>
            <td>Anas</td>
            <td>300 pts</td>
            <td>Africa</td>
        </tr>
            </table>`;
            break
    }
}

//load theme function

function chooseTheme(e){
    e.preventDefault();
    current_theme = Themes_list.find((itemValue)=>{
        return itemValue.name == e.target.lastElementChild.textContent;
    })
    
    //load theme function
    document.documentElement.style
    .setProperty('--secondary-color', current_theme.secondary);
    document.documentElement.style
    .setProperty('--primary-color', current_theme.primary);
    document.documentElement.style
    .setProperty('--tertiary-color', current_theme.tertiary);
}

/// function to edit tasks
function editTask(e){
    
    // find object
    let findTasks = Tasks_list.find((itemValue)=>{
        return itemValue.id == e.target.parentNode.parentNode.id.substring(2);
    })
    console.log(e.target.parentNode.parentNode)

    

    // fill inputs with info
    task_input.value = findTasks.content;
    tag_input.value = "";
    if(edit){
        let tagList = document.querySelectorAll("#tag-container .tag")
        for (let i =tagList.length-1 ;i>=0;i--){
        tagList[i].remove()
        }
    }
    let Tags = [...findTasks.tags].reverse();
    Tags.forEach((itemValue)=>{
        let tag = document.createElement("div");
        tag.classList.add("tag");
        tag.style.display = "inline-block";
        tag.textContent = itemValue;
        tag_Container.prepend(tag);
    })
    if(!main_button.classList.contains("rotate")){
    mainButtonMove();
    }
    workingMemory = findTasks;
    
    // animation for main button
    edit = true;
    

}


