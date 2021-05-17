const END_POINT = `/dashboard/Tjson`;
const SEND_POINT = `/staff/Tjson`;
const list_element = document.getElementById("list");
const pagination_element = document.getElementById("pagination");
const filterByStd = document.getElementById("filterStd");
const filterBySec = document.getElementById("filterSec");
let current_page = 1;
const rows = 10;

// Removes all child inside an element

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Function to return if no search results are found in DB

function noResultsFound (wrapper) {
    let item_element = document.createElement("tr");
    let item_head = `<th scope="row"></th>
        <td>No Results Found In Database</td>
        <td></td>
        <td></td>
        <td></td>`;
    item_element.innerHTML = item_head;
    wrapper.appendChild(item_element);
}

// Function to return data matching the search results

function searchTable (value, array){
    let filteredData = new Array();
    for(let i = 0; i < array.length; i++) {
        let searchVal = value.toString().toLowerCase();
        let name = array[i].name.toString().toLowerCase();
        if(name.includes(searchVal)){
        filteredData.push(array[i])
        }
    }
    return filteredData
}

// Function to fetch DB results to display

async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

// Function to add table rows with populated value (Staff results) from DB (Fetched results)

function staffList(items, wrapper, rows_per_page, page){
    removeAllChildNodes(wrapper);
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {

        let item = paginatedItems[i];
        let item_element = document.createElement("tr");
        let item_head = `<th scope="row">${item.admissionNumber}</th>
            <th scope="row">${item.name}</th>
            <td>${item.DOJ}</td>
            <td>${item.detail}</td>
            <td><a href="/staff/edit/${item._id}/"><button class="btn btn-success mr-5">Update</button></a>
            <form action="/staff/re-add/${item._id}/?_method=PATCH" method="POST" style="display: inline;">
                <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#Modal${item._id}">Re-Add</button>
                <!-- Modal -->
                <div class="modal fade" id="Modal${item._id}" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalLabel">Warning!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <h4>Do you want to change this staff to Active?</h4>
                    <br>
                    <p>This action will add this record to Active list of staff.<p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No, I changed my mind!</button>
                        <button type="submit" class="btn btn-danger">Yes! Please.</button>
                    </div>
                    </div>
                </div>
                </div>
            </form>
            </td>`;
        item_element.innerHTML = item_head;
        wrapper.appendChild(item_element);
    }
}

// Function to add table rows with populated value from DB (Fetched results)

function DisplayList (items, wrapper, rows_per_page, page) {

    removeAllChildNodes(wrapper);
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {

        let item = paginatedItems[i];
        let item_element = document.createElement("tr");
        let item_head = `<th scope="row">${item.classes.admissionNumber}</th>
            <td>${item.name}</td>
            <td>${item.classes.class}</td>
            <td>${item.classes.section}</td>
            <td>${item.DOL}</td>
            <td>${item.classes.RTE}</td>
            <td><a href="/students/edit/${item._id}/"><button class="btn btn-success mr-5">Update</button></a>
            <form action="/transfer/re-add/${item._id}/?_method=PATCH" method="POST" style="display: inline;">
                <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#Modal${i}">Re-add</button>
                <!-- Modal -->
                <div class="modal fade" id="Modal${i}" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalLabel">Warning!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h4>Do you want to change this student to Active?</h4>
                        <br>
                        <p>This action will add this record to Active list of students.<p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No, I changed my mind!</button>
                        <button type="submit" class="btn btn-danger">Yes! Please.</button>
                    </div>
                    </div>
                </div>
                </div>
            </form>
            </td>`;

        item_element.innerHTML = item_head;
        wrapper.appendChild(item_element);
    }

}

// Function which creates Pagination function to all buttons (Number of trimmed table pages from DB)

function SetupPagination (items, wrapper, rows_per_page, page_count) {

    removeAllChildNodes(wrapper);

    let liFirst = document.createElement("li");
    let anchorFirst = document.createElement("a");
    liFirst.classList.add("page-item-first");
    anchorFirst.classList.add("page-link");
    anchorFirst.innerText = "First";
    liFirst.appendChild(anchorFirst);
    wrapper.appendChild(liFirst);

    for (page = 1; page <= page_count; page++) {

        let li = PaginationButton(page, items);
        wrapper.appendChild(li);

    }

    let liLast = document.createElement("li");
    let anchorLast = document.createElement("a");
    liLast.classList.add("page-item-last");
    anchorLast.classList.add("page-link");
    anchorLast.innerText = "Last";
    liLast.appendChild(anchorLast);
    wrapper.appendChild(liLast);

}

// Function which creates & add pagination button and active button class

function PaginationButton (page, items) {

    let li = document.createElement("li");
    let anchor = document.createElement("a"); 

    li.classList.add("hide");
    li.classList.add("page-item");
    anchor.classList.add("page-link");
    anchor.innerText = page;
    li.appendChild(anchor);

    if (current_page == page) li.classList.add("active");

    li.addEventListener("click", function () {
        DisplayList(items, list_element, rows, page);
        let current_btn = document.querySelector("li.active");
        current_btn.classList.remove("active");
        li.classList.add("active"); 
    });

    return li;
}

// Function which give clicking/transition functionality to page buttons

function paginateClickEvent (page_count, mainElement) {

    let presentPage = document.querySelector("li.active a.page-link").innerHTML;
    let maxLeft = Number(Number(presentPage) - Math.floor(5 / 2));
    let maxRight = Number(Number(presentPage) + Math.floor(5 / 2));

    if (maxLeft < 1) {
        maxLeft = 1;
        if(page_count > 5) maxRight = 5;
        else maxRight = page_count
    }

    if (maxRight > page_count) {
        maxLeft = page_count - (6 - 1);
        maxRight = page_count;
    }

    for (let viewPage = maxLeft; viewPage < maxRight; viewPage++) {

        if (maxLeft != 1){
        for (let add = 0; add < maxLeft; add++){
            mainElement[add].classList.add("hide");
        }
        }

        if (maxLeft == 1) mainElement[0].classList.remove("hide");

        if (maxRight != page_count) {
        for (let add = maxRight; add < page_count; add++){
            mainElement[add].classList.add("hide");
        }
        }

        if(page_count > 5) mainElement[viewPage].classList.remove("hide");
        
    }

}

// Function which sets up initial page buttons 

function initialSetup(first, last, mainElement, firstChild, lastChild, finalPage) {

    mainElement[first].click();

    lastChild.addEventListener("click", function () {
        mainElement[(finalPage-1)].click();
    });

    if (last > 5) {
        last = 5;
    }

    firstChild.addEventListener("click", function () {
        mainElement[first].click();
    });

    for (let add = first; add < last; add++){
        mainElement[add].classList.remove("hide");
    }
}

// Function which returns search results and appends it to table

function searchFilter(returnData, originalData){

    if (returnData.length == originalData.length){

        main();

    } else if (returnData.length) {

        const page_count = Math.ceil(returnData.length / rows);

        DisplayList(returnData, list_element, rows, current_page);
        SetupPagination(returnData, pagination_element, rows, page_count);

        let allEle = pagination_element.querySelectorAll(".page-item");
        let firstLi = pagination_element.querySelector(".page-item-first");
        let lastLi = pagination_element.querySelector(".page-item-last");
        
        initialSetup(0, page_count, allEle, firstLi, lastLi, page_count);

        if (page_count > 5) {
        pagination_element.addEventListener("click", function(){paginateClickEvent(page_count, allEle)});
        }
        
    } else {

        removeAllChildNodes(list_element);
        removeAllChildNodes(pagination_element);
        noResultsFound (list_element);

    }
}

// Function which loads on first (during every page load) returns all the data's from DB

async function main() {

    let url = END_POINT;
    const items = await getData(url);
    const page_count = Math.ceil(items.length / rows);
    const staff_items = await getData(SEND_POINT);

    DisplayList(items, list_element, rows, current_page);
    staffList(staff_items, document.getElementById("Slist"), staff_items.length, current_page);
    SetupPagination(items, pagination_element, rows, page_count);

    let allEle = pagination_element.querySelectorAll(".page-item");
    let firstLi = pagination_element.querySelector(".page-item-first");
    let lastLi = pagination_element.querySelector(".page-item-last");

    initialSetup(0, page_count, allEle, firstLi, lastLi, page_count);
    pagination_element.addEventListener("click", function(){paginateClickEvent(page_count, allEle)});

}

// Search Box functionality

document.getElementById("SearchBox").addEventListener("keyup", async function (e){
    if (e.key === "Enter") {
        let items = await getData(END_POINT);
        let filteredItems = undefined;
        if(filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value != "All") {
            filteredItems = items.filter(eachField => (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value != "All"){
            filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value != "All") {
            filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.RTE == filterByRTE.value));
        } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
            filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value));
        } else if (filterBySec.value == "All" && filterByStd.value == "All" && filterByRTE.value != "All"){
            filteredItems = items.filter(eachField => eachField.classes.RTE == filterByRTE.value);
        } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
            filteredItems = items.filter(eachField => eachField.classes.class == filterByStd.value);
        } else if (filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value == "All"){
            filteredItems = items.filter(eachField => eachField.classes.section == filterBySec.value);
        }
        let searchString = document.getElementById("SearchBox").value;
        let returnData = searchTable(searchString, (typeof filteredItems === "undefined") ? items : filteredItems);
        searchFilter(returnData, items);
    }
});

// Filter by selected value (Standard)

filterByStd.onchange = async () => {
    let items = await getData(END_POINT);

    if(filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value == "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => eachField.classes.RTE == filterByRTE.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.class == filterByStd.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.section == filterBySec.value);
        searchFilter(filteredItems, items);
    } 
    else {main()}

    document.getElementById("SearchBox").value = "";
}
// Filter by selected value (Section)

filterBySec.onchange = async () => {
    let items = await getData(END_POINT);

    if(filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value == "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => eachField.classes.RTE == filterByRTE.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.class == filterByStd.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.section == filterBySec.value);
        searchFilter(filteredItems, items);
    } 
    else {main()}

    document.getElementById("SearchBox").value = "";
}

filterByRTE.onchange = async () => {
    let items = await getData(END_POINT);

    if(filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value != "All") {
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.RTE == filterByRTE.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => (eachField.classes.class == filterByStd.value) && (eachField.classes.section == filterBySec.value));
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value == "All" && filterByRTE.value != "All"){
        let filteredItems = items.filter(eachField => eachField.classes.RTE == filterByRTE.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value == "All" && filterByStd.value != "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.class == filterByStd.value);
        searchFilter(filteredItems, items);
    } else if (filterBySec.value != "All" && filterByStd.value == "All" && filterByRTE.value == "All"){
        let filteredItems = items.filter(eachField => eachField.classes.section == filterBySec.value);
        searchFilter(filteredItems, items);
    } 
    else {main()}

    document.getElementById("SearchBox").value = "";
}

document.onload = main();