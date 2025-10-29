document.addEventListener("DOMContentLoaded", function() {
    async function insertHeader() {
        let headerContent = await fetch('header.html')
        document.getElementById('header').innerHTML = await headerContent.text()
    }

    async function insertFooter() {
        let footerContent = await fetch('footer.html')
        document.getElementById('footer').innerHTML = await footerContent.text()
    }

    insertHeader().catch(error => console.log(error))
    insertFooter().catch(error => console.log(error))

})


function changeTheme() {
    document.body.className = document.body.className === "light-mode" ? "dark-mode" : "light-mode";
}