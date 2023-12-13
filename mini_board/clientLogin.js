

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#send").addEventListener("click", () => {
        const id = document.querySelector("#id_input").value;
        localStorage.setItem("id", id);
        location.href = "/";
    });
});