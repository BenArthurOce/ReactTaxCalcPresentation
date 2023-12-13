import React, { useState } from 'react';
import TaxForm from "./Components/TaxForm.js"
import TaxRequest from "./Components/TaxRequest.js"
import DropDownOpts from "./Components/DropDownOpts.js"
import DropDownResults from "./Components/DropDownResults.js"

function TaxFrontend() {

    const [formData, setFormData] = useState(null);
    const [waitingFlag, setWaitingFlag] = useState(null);

    const [selectedHeader, setSelectedHeader] = useState('');
    const [selectedYear, setSelectedYear] = useState('');


    const handleHeaderChange = (header) => {
      setSelectedHeader(header);
    };
  
    const handleYearChange = (year) => {
      setSelectedYear(year);
    };


    const triggerFormSubmitted = (newFormData) => {
        setFormData(newFormData);
        setWaitingFlag(false)   // The blocker to loading the tax calculations is now removed
    }

    const triggerFormReset = () => {
        console.log("reset")
        setFormData(null);
        setWaitingFlag(true) 
    }

    const triggerDebug = () => {
        console.log("debug") 
    }

    

    return (
        <div id="wrapper">
            <section id="form">
                <TaxForm onFormSubmit={triggerFormSubmitted}
                />
                 <button onClick={triggerFormReset}>Reset</button> 
                 <button onClick={triggerDebug}>Debug</button> 
            </section>


            {/* if the waiting flag is false, and the formData from TaxForm has data, then run the request */}
            {!waitingFlag && formData ? (
                <section id="results">
                    {formData && (      
                        <TaxRequest
                        formData={formData}
                        />     
                    )}
                </section>
            ) : (
                <section id="results">
                    {<p>Waiting on user to complete input form</p>}
                </section>
            )}
            {/* Otherwise just tell the user that input is waiting to be loaded into the TaxForm */}


            <section id="info">
                <DropDownOpts
                    onHeaderChange={handleHeaderChange}
                    onYearChange={handleYearChange}
                />
                <DropDownResults 
                    selectedHeader={selectedHeader} 
                    selectedYear={selectedYear} 
                />
            </section>

        </div>
    );
};

export default TaxFrontend;
