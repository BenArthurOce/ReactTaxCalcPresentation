import React, { useState, useEffect } from 'react';

const DropDownResults = ({ selectedHeader, selectedYear }) => {
    const [resultData, setResultData] = useState(null);
    const url = `https://benarthuroce.github.io/TaxRatesJSON/atoJSON.json`;

    useEffect(() => {
    if (!selectedHeader || !selectedYear) {return}
    if (
        // we're skipping medicare if we see it
        selectedHeader === "Medicare Levy Reduction" ||
        selectedHeader === "Medicare Levy Surcharge"
    ) {
        setResultData({ brackets: [] });
        return;
    };

    if (selectedHeader && selectedYear) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Fetch Request failed | Status: ${response.status}`);
          }
          return response.json();
        })
        .then((jsonData) => {
          setResultData(jsonData[selectedHeader][selectedYear]);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setResultData(null);
    }
  }, [selectedHeader, selectedYear]);


  return (
    <div>
     <h1>COMPONENT: DropDownResults</h1>
      {selectedHeader === "Individual Income Tax" || selectedHeader === "HECS Repayment Rates" ? (
        <table>
            <thead>
                <tr>
                    <th>Range</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
            {resultData &&
                resultData.brackets.map((bracket, index) => (
                    <tr key={index}>
                        <td>{`$${bracket.range[0]} - $${bracket.range[1]}`}</td>
                        <td>{`${(bracket.rate * 100).toFixed(2)}%`}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      ) : selectedHeader === "Low Income Tax Offset" || selectedHeader === "Low Middle Income Tax Offset" ? (
    <table>
        <thead>
            <tr>
                <th>Range</th>
                <th>Base</th>
                <th>Adj</th>
            </tr>
        </thead>
        <tbody>
            {resultData &&
                resultData.brackets.map((bracket, index) => (
                    <tr key={index}>
                        <td>{`$${bracket.range[0]} - $${bracket.range[1]}`}</td>
                        <td>{`$${bracket.base}`}</td>
                        <td>{`${(bracket.pctAdj * 100).toFixed(2)}%`}</td>
                    </tr>
                ))}
        </tbody>
    </table>
      ) : (
        <p>Select a header and a year to see results.</p>
      )}
    </div>
  );
};

export default DropDownResults;
