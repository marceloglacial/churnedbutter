// Show Sidebar 
function toogleSidebar(target) {
    document.getElementsByClassName(target)[0].onclick = function (e) {
        e.preventDefault();
        var element = document.getElementById("sidebar");
        element.classList.toggle("open");
    }
}
toogleSidebar('sidebar-open');
toogleSidebar('sidebar-close');
