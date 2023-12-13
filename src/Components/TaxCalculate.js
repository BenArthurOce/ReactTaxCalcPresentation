import React, { useState, useEffect } from 'react';

function TaxCalculate({ apiData, formData }) {
    const [incomeTax, setIncomeTax] = useState(0);
    const [hecsRepayment, setHecsRepayment] = useState(0);
    const [lowIncomeOffset, setLowIncomeOffset] = useState(0);
    const [lowMiddleIncomeOffset, setLowMiddleIncomeOffset] = useState(0);
    const [medicareLevy, setMedicareLevy] = useState(0);
    const [medicareLevySurcharge, setMedicareLevySurcharge] = useState(0);
    const [finalTaxPayable, setFinalTaxPayable] = useState(0);
    // const [seniorsPensionersTaxOffset, setSeniorsPensionersTaxOffset] = useState('');


    console.log(`\n%%%%%%%%%%\nTaxCalculate, props:\n%%%%%%%%%%`)
    console.log(apiData, formData)

 
    const calculateEachTax = () => {

        // if the data exists
        if (apiData) {

            //Prepare Brackets  // Store each Promise / Header in an array
            const p = Promise.all(apiData.map((taxTypeInx) => taxTypeInx[formData.year]))
            .then(([incomeTaxData, hecsData, litoData, lmitoData, medicareLevyData, medicareSurchargeData]) => {
                try {
                    const calculations = [  // 
                        calculateIncomeTax(incomeTaxData, formData)
                        , calculateHECS(hecsData, formData)
                        , calculateLITO(litoData, formData)
                        , calculateLMITO(lmitoData, formData)
                        , calculateMedicareLevy(medicareLevyData, formData)
                        , calculateMedicareSurcharge(medicareSurchargeData, formData)
                    ];
                    // Call all the functions at the same time
                    setIncomeTax(calculations[0]);
                    setHecsRepayment(calculations[1]);
                    setLowIncomeOffset(calculations[2]);
                    setLowMiddleIncomeOffset(calculations[3]);
                    setMedicareLevy(calculations[4]);
                    setMedicareLevySurcharge(calculations[5]);
                    calculateTotalTax(calculations)
                }
                catch (error) {
                    throw new Error(`Something went wrong when running the calculations | Error: ${error}`);
                };
            })
            // .finally(() => {
            //     calculateTotalTax()
            // });
        };
    };


    useEffect(() => {
        calculateEachTax();
    }, []);


    function calculateIncomeTax(taxdata, formdata) {
        console.log("Function: calculateIncomeTax")
        // console.log(`  income = ${income}    year = ${year} `)
    
        try {
            const { brackets } = taxdata
            if (!brackets) {
                throw new Error(`calculateIncomeTax: The API has no data for the year: ${formdata.year}`);
            }
    
            for (const { range, rate, base } of brackets) {
                if (formdata.income >= range[0] && formdata.income <= range[1]) {
                    const result = ((formdata.income - range[0]) * rate) + base;
                    return result.toFixed(2);
                }
            }
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };
    
    
    function calculateHECS(taxdata, formdata) {
        const hasHECS = true;
        const hecsBalance = 60000;
        console.log("Function: calculateHECS");
    
        try {
            if (hasHECS) {
                const { brackets } = taxdata
                if (!brackets) {
                    throw new Error(`calculateHECS: The API has no data for the year: ${formdata.year}`);
                }
                for (const {range, rate} of brackets) {
                    if (formdata.income >= range[0] && formdata.income <= range[1]) {
                        const result = formdata.income * rate;
                        return Math.min(result, hecsBalance).toFixed(2);    // If hecs debt is lower than the repayment, return the hecs debt amount
                    };
                };
            };
            return 0.00;
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };
    
    
    function calculateLITO(taxdata, formdata) {
        console.log("Function: calculateLITO");
        try {
            const { brackets } = taxdata
            if (!brackets) {
                throw new Error(`calculateLITO: The API has no data for the year: ${formdata.year}`);
            }
            for (const {range, base, pctAdj} of brackets) {
                if (formdata.income >= range[0] && formdata.income <= range[1]) {
                    // console.log(`LITO MATH:   income=${income}  |  range=${range}  |  base=${base}  |  pctAdj=${pctAdj}`)
                    const result = base - ((formdata.income - range[0]) * pctAdj);
                    return result.toFixed(2);  
                };
            };
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };
    
    
    function calculateLMITO(taxdata, formdata) {
        console.log("Function: calculateLMITO");
        try {
            const { brackets } = taxdata 
            if (!brackets) {
                throw new Error(`calculateLMITO: The API has no data for the year: ${formdata.year}`);
            }
            if (!brackets[0]) {return 0.00} // there were no LMITO brackets for this particular year
            for (const {range, base, pctAdj} of brackets) {
                if (formdata.income >= range[0] && formdata.income <= range[1]) {
                    console.log(`LMITO MATH:   income=${formdata.income}  |  range=${range}  |  base=${base}  |  pctAdj=${pctAdj}`);
                    const result = base - ((formdata.income - range[0]) * pctAdj);
                    return result
                };
            };
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };
    
    
    function calculateMedicareLevy(taxdata, formdata) {
        console.log("Function: calculateMedicareReduction")
        // console.log(`  income = ${income}    year = ${year}    data = ${JSON.stringify(data)}`);
        try {
            const saptoString = formdata.pensionerAttrib? "pensioners":"non-pensioners";
            const familyString = formdata.familyAttrib? "families":"single";
    
            const { brackets } = taxdata[saptoString][familyString]; 
            if (!brackets) {
                throw new Error(`calculateMedicareReduction: The API has no data for the year: ${formdata.year}`);
            }
            for (const {range, rate, special} of brackets) {
                if (formdata.income >= range[0] && formdata.income <= range[1]) {
                    // console.log(`MEDICARE RED MATH:   income=${income}  |  range=${range}  |  rate=${rate}  |  tier=${tier}  |  saptoString=${saptoString}  |  familyString=${familyString}`);
                    let result = null;
                    if (special) {
                        result = ((formdata.income - range[0]) * 0.10)   //if middle bracket, we take the difference and then 10% for medicare
                    } else {
                        result = formdata.income * rate
                    }
                    return result.toFixed(2);  
                };
            };
    
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };
    

    function calculateMedicareSurcharge(taxdata, formdata) {
        console.log("Function: calculateMedicareSurcharge")

        console.log(formData.hasPHI)
        if (formData.hasPHI) {return 0}
        // console.log(`  income = ${income}    year = ${year}    data = ${JSON.stringify(data)}`);
        try {
            const familyString = formdata.familyAttrib? "families":"single";
    
            const { brackets } = taxdata[familyString]; 
            if (!brackets) {
                throw new Error(`calculateMedicareSurcharge: The API has no data for the year: ${formdata.year}`);
            }
            for (const {range, rate, tier} of brackets) {
                if (formdata.income >= range[0] && formdata.income <= range[1]) {
                    // console.log(`MEDICARE SUR MATH:   income=${income}  |  range=${range}  |  rate=${rate}  |  tier=${tier}  |  familyString=${familyString}`);
                    const result = formdata.income * rate
                    return result.toFixed(2);  
                };
            };
        }
        catch(error) {
            console.log(error)
            return 0.00
        };
    };

    function calculateTotalTax(calculations) {


        console.log("calculateTotalTax")
        const [incomeTax, hecsRepayment,  lowIncomeOffset, lowMiddleIncomeOffset, medicareLevy, medicareLevySurcharge] = calculations.map(Number);

        console.log(`
            incomeTax = ${incomeTax}
            hecsRepayment = ${hecsRepayment}
            medicareLevy = ${medicareLevy}
            medicareLevySurcharge = ${medicareLevySurcharge}
            lowIncomeOffset = ${lowIncomeOffset}
            lowMiddleIncomeOffset = ${lowMiddleIncomeOffset}
        `);

        //If taxable income is low enough, the low income tax offset must match it
        if (lowIncomeOffset >= incomeTax) {
            setLowIncomeOffset(incomeTax);
        };

        if (lowMiddleIncomeOffset >= incomeTax-lowIncomeOffset) {
            setLowMiddleIncomeOffset(incomeTax-lowIncomeOffset);
        };


        let finalTaxPayable = incomeTax + hecsRepayment + medicareLevy + medicareLevySurcharge - lowIncomeOffset - lowMiddleIncomeOffset;
        // const finalTaxPayable = incomeTax + hecsRepayment + medicareLevy - lowIncomeOffset - lowMiddleIncomeOffset
        finalTaxPayable = Math.max(finalTaxPayable, 0)
        setFinalTaxPayable(finalTaxPayable.toFixed(2))

    };

    return (
        <div className="results-container">
            <strong>Your Income:</strong> {formData.income}
            <br></br>
            <ul>
                <li><strong>Income Tax:</strong> {incomeTax}</li>
                <li><strong>HECS Repayment:</strong> {hecsRepayment}</li>
                <li><strong>Low Income Tax Offset:</strong> {lowIncomeOffset}</li>
                <li><strong>Low Middle Income Tax Offset:</strong> {lowMiddleIncomeOffset}</li>
                <li><strong>Medicare Levy:</strong> {medicareLevy}</li>
                <li><strong>Medicare Surcharge:</strong> {medicareLevySurcharge}</li>
            </ul>
            <br></br>
            <strong>Tax Payable:  {finalTaxPayable} </strong>
        </div>
    );
}

export default TaxCalculate;
