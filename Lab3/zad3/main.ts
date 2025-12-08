import ProductRecord from "./ProductRecord.js";

let records: ProductRecord[]
let filteredRecords: ProductRecord[]

async function getRecords(): Promise<ProductRecord[]> {
    const r = await fetch("https://dummyjson.com/products");
    const json = await r.json();
    const products: { id: number; title: string; description: string; thumbnail: string; }[] = json.products;
    return products.map((p) => ProductRecord.fromAPI(p));
}

function appendProduct(productRecord: ProductRecord) {
    const template = document.querySelector<HTMLTemplateElement>("#product")!.content.cloneNode(true) as DocumentFragment;
    const parent = document.querySelector(".products-container")!;

    const title = template.querySelector(".product-title")!;
    const description = template.querySelector(".product-description")!;
    const picture = template.querySelector(".product-picture")!;

    title.textContent = productRecord.title;
    description.textContent = productRecord.description;
    picture.setAttribute("src", productRecord.thumbnail);

    parent.appendChild(template);

}

function flushContent() {
    const container = document.querySelector(".products-container")!;

    while (container.lastChild)
        container.removeChild(container.lastChild as Node);
}

function displayProducts(products: ProductRecord[]) {
    flushContent();
    products.forEach(r => appendProduct(r));
}

function filterProducts(query: string): ProductRecord[] {
    if (!query) return records.slice();
    const lowerQuery = query.toLowerCase();
    return records.filter(r => r.title.toLowerCase().includes(lowerQuery));
}

function compareStrings(a: string, b: string): number {
    if (a === b) {
        return 0;
    } if (a > b) {
        return 1;
    }
    return -1;
}

function applySorting() {
    const select = document.getElementById("sorting") as HTMLSelectElement;
    const value = select.value;

    if (value == "default") {
        filteredRecords.sort((a, b) => a.id - b.id);
    } else if (value == "asc") {
        filteredRecords.sort((a, b) => compareStrings(a.title, b.title));
    } else {
        filteredRecords.sort((a, b) => compareStrings(b.title, a.title));
    }
    displayProducts(filteredRecords);
}

document.getElementById("sorting")?.addEventListener("input", applySorting);

document.getElementById("search")?.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const query = input.value;
    filteredRecords = filterProducts(query);
    applySorting();
});

document.addEventListener('DOMContentLoaded', async () => {
    records = await getRecords();
    filteredRecords = records.slice();
    displayProducts(filteredRecords);
})