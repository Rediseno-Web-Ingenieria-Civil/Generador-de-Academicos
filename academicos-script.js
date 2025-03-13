function reorderItems() {
    var ul = document.getElementById("search-academic-row");
    var li = ul.getElementsByClassName("col-2");
    var visibleItems = [];
    var hiddenItems = [];
    for (var i = 0; i < li.length; i++) {
        if (li[i].style.display === "none") {
            hiddenItems.push(li[i]);
        } else {
            visibleItems.push(li[i]);
        }
    }
    for (var i = 0; i < visibleItems.length; i++) {
        ul.appendChild(visibleItems[i]);
    }
    for (var i = 0; i < hiddenItems.length; i++) {
        ul.appendChild(hiddenItems[i]);
    }
}

function filterAcademic() {
    var input,
        filter,
        ul,
        li,
        a,
        i,
        txtValue;
    input = document.getElementById("name-academic-filter");
    filter = input
        .value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
    ul = document.getElementById("search-academic-container")
    li = ul.getElementsByClassName("col-2");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByClassName("name-academic")[0];
        txtValue = a.textContent || a.innerText;
        txtValue = txtValue
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase();
        if (txtValue.indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
    reorderItems();
}

document
    .getElementById("name-academic-filter")
    .addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            filterAcademic();
        }
    });
document.getElementById("buscar-button").onclick = filterAcademic;