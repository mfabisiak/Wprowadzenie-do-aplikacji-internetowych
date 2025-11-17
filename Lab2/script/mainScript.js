async function loadContent() {
    async function insertHeader() {
        let headerContent = await fetch('header.html')
        document.getElementById('header').innerHTML = await headerContent.text()
    }

    async function insertFooter() {
        let footerContent = await fetch('footer.html')
        document.getElementById('footer').innerHTML = await footerContent.text()
    }

    let theme = localStorage.getItem('theme')

    if (!theme) {
        localStorage.setItem('theme', 'dark-mode')
        theme = 'dark-mode'
    }

    setTheme(theme)

    try {
        await insertHeader()
        await insertFooter()
    } catch (error) {
        console.log(error)
    }

    document.body.style.visibility = 'visible'
}

document.addEventListener("DOMContentLoaded", loadContent)


function setTheme(theme) {
    document.body.className = theme
    localStorage.setItem('theme', theme)
}

function changeTheme() {
    let newTheme = document.body.className === "light-mode" ? "dark-mode" : "light-mode"
    setTheme(newTheme)
}