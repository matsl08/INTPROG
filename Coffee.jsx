import React, { useEffect } from 'react';
import { fetchData } from './fetch_coffee_menu';

const Coffee = () => {

    const displayData = () => {
        async function fetchData() {
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
    };

    return (
        <>

            <table>
                <thead>
                    <tr className='table_header'>
                        <th colspan="4">
                            <h1>Joie's Coffee Daily Menu</h1>
                        </th>
                    </tr>
                    <tr>
                        <th>Coffee</th>
                        <th>Size</th>
                        <th>Price (Hot)</th>
                        <th>Price (Cold)</th>
                    </tr>
                </thead>
                <script src=""></script>
                <tbody id="tbody"></tbody>
            </table>
            {displayData()}

        </>
    );
}

export default Coffee;s