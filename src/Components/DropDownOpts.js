import React, { useState, useEffect } from 'react';

const DropDownOpts = ({ onHeaderChange, onYearChange }) => {
    const [objectKeys, setObjectKeys] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedHeader, setSelectedHeader] = useState('');
    const [selectedYear, setSelectedYear] = useState('');


    //Run the API to get the tax
    const url = "https://benarthuroce.github.io/TaxRatesJSON/atoJSON.json";
    useEffect(() => {
        fetch(url)
            .then((response) => {
            if (!response.ok) {
                throw new Error(`Fetch Request failed | Status: ${response.status}`);
            }
            return response.json();
            })
            .then((jsonData) => {
                const headers = Object.keys(jsonData);  // Gets all the different tax types
                const allYears = Object.keys(jsonData[headers[0]]); // Gets all the years from "Individual Income Tax"

                setObjectKeys(headers); // Set the TaxType dropdown box
                setYears(allYears); // Set the Years dropdown box
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // Run once when the component mounts


    const setSelectedHeader_handle = (e) => {
        const newHeader = e.target.value;
        setSelectedHeader(newHeader);
        onHeaderChange(newHeader); // Notify the parent component (DropDownResults) about the header change
    };

    const setSelectedYear_handle = (e) => {
        const newYear = e.target.value;
        setSelectedYear(newYear);
        onYearChange(newYear); // Notify the parent component (DropDownResults) about the year change
    };

    return (
        <div>
            <label htmlFor="objectKeys">Select a header:</label>
            <select id="objectKeys" onChange={setSelectedHeader_handle} value={selectedHeader}>
            <option value="">Select a tax type:</option>
                {objectKeys.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            <label htmlFor="years">Select a year:</label>
            <select id="years" onChange={setSelectedYear_handle} value={selectedYear}>
                <option value="">Select a year</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropDownOpts;
