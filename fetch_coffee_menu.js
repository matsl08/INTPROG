export async function fetchData() {
    try {
        let response = await fetch('./coffee_menu.json');
        let data = await response.json();
        let tbody = document.getElementById('tbody');
        
        data.forEach(item => {
            const table_values = `<tr>
            <td>${item.coffee}</td>
            <td>${item.size}</td>
            <td>${item.price_hot}</td>
            <td>${item.price_cold}</td>
            </tr>`;
            tbody.innerHTML += table_values;
        });
        
    } catch (error) {
        console.log("Failed to load data: " + error);
    }
}

fetchData();