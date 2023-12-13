import React, { useState, useEffect } from 'react';
import TaxCalculate from './TaxCalculate';


function TaxRequest({ formData }) {

    const [apiData, setApiData] = useState(null);


    useEffect(() => {

        console.log("======== TaxRequest, useEffect has been triggered ========")

        const url = "https://benarthuroce.github.io/TaxRatesJSON/atoJSON.json";


        fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Fetch Request failed | Status: ${response.status}`);
            }
                return response.json();
            })
        //Obtain the tax data for each type of tax
        .then((jsonData) => {
            try {
                const APIHeaders = [            // List of tax categories (Main "branches" for the JSON file)
                      "Individual Income Tax"
                    , "HECS Repayment Rates"
                    , "Low Income Tax Offset"
                    , "Low Middle Income Tax Offset"
                    , "Medicare Levy Reduction"
                    , "Medicare Levy Surchage"
                ];
                return Promise.all(APIHeaders.map((header) => jsonData[header]));   // Store each Promise / Header in an array
            }
            catch (error) {
                throw new Error(`Something went wrong when mapping the Promises | Error: ${error}`);
            };
        })
        // Put all the bracket data into the component state
        .then(([incomeTaxData, hecsData, litoData, lmitoData, medicareReductionData, medicareSurchargeData]) => {
            setApiData([incomeTaxData, hecsData, litoData, lmitoData, medicareReductionData, medicareSurchargeData])
        })
        .catch((error) => {
            console.error("Error caught:", error);
        });
        
    }, []);

    return (

        <div>
            <h1>COMPONENT: TaxRequest</h1>
            <h2>Calculation Results</h2>

            {apiData && (
                <TaxCalculate
                apiData={apiData}
                formData={formData}
                />
            )}
        </div>
    );

};

 export default TaxRequest;


