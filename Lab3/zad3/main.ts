import ProductRecord from "./ProductRecord.js";

let records: ProductRecord[]

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

function compareStrings(a: string, b: string): number {
    if (a === b) {
        return 0;
    } if (a > b) {
        return 1;
    }
    return -1;
}

document.getElementById("sorting")?.addEventListener("input", () => {
    const select = document.getElementById("sorting") as HTMLInputElement
    const value = select.value!

    console.log(value)

    if (value == "default") {
        records.sort((a, b) => a.id - b.id);
    } else if (value == "asc") {
        records.sort((a, b) => compareStrings(a.title, b.title));
    }
    else {
        records.sort((a, b) => compareStrings(b.title, a.title));
    }
    console.log(value, records.map(a => a.title))

    flushContent();
    records.forEach(r => appendProduct(r));

})


document.addEventListener('DOMContentLoaded', async () => {
    records = await getRecords();

    records.forEach(r => appendProduct(r));

})