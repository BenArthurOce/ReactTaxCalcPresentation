import React, { useState } from 'react';

function TaxForm(props) {
    const [isEnforce, setIsEnforce]  = useState(false);     // If ticked, the form will do validation checks
    const [taxationYear, setTaxationYear] = useState(2023);
    const [taxableIncome, setTaxableIncome] = useState('');
    const [age, setAge] = useState('');
    const [hasSpouse, setHasSpouse] = useState(false);
    const [spousesIncome, setSpousesIncome] = useState('');
    const [numberOfChildren, setNumberOfChildren] = useState('');
    const [hasHECSDebt, setHasHECSDebt] = useState(false);
    const [hecsDebtAmount, setHECSDebtAmount] = useState('');
    const [hasPrivateHealth, setHasPrivateHealth] = useState(false);


    function isNumber(ev) {
        return !isNaN(ev.target.value.slice(-1));
    };

    function validateForm(ev) {
        ev.preventDefault();
        let isValid = true;

        if (isEnforce ) {
            if(taxationYear==="") {isValid=false};
            if(taxableIncome==="") {isValid=false};
            if(age==="") {isValid=false};
            if(hasSpouse===true && spousesIncome==="") {isValid=false};
            if(hasHECSDebt===true && hecsDebtAmount==="" ) {isValid=false};
        }
        
        if (isValid) {
            handleSubmit(ev)
        } else {
            alert("YA MESSED UP")
        };
    };

    const setTaxationYear_handle = (ev) => {
        ev.preventDefault();
        setTaxationYear(ev.target.value)
    };
    
    const setTaxableIncome_handle = (ev) => {
        ev.preventDefault()
        if(isEnforce) {
            if(isNumber(ev)) {
                setTaxableIncome(ev.target.value);
            };
        }
        else {
            setTaxableIncome(ev.target.value);   // There is no validation check. Input the value
        };
    };

    const setAge_handle = (ev) => {
        ev.preventDefault()
        if(isEnforce) {
            if(isNumber(ev)) {
                setAge(ev.target.value);
            };
        }
        else {
            setAge(ev.target.value);  // There is no validation check. Input the value
        };
    };

    const setHasSpouse_handle = (ev) => {
        ev.preventDefault();
        if (!ev.target.checked) {setSpousesIncome('');} // if the "do you have spouse" box is unticked, set the spouse income to nothing
        setHasSpouse(!hasSpouse);
    };

    const setSpousesIncome_handle = (ev) => {
        ev.preventDefault()
        if(isEnforce) {
            if(isNumber(ev)) {
                setSpousesIncome(ev.target.value);
            };
        }
        else {
            setSpousesIncome(ev.target.value);  // There is no validation check. Input the value
        };
    };

    const setNumberOfChildren_handle = (ev) => {
        ev.preventDefault()
        console.log(ev.target.value)
        if(isEnforce) {
            if(isNumber(ev)) {
                setNumberOfChildren(ev.target.value);
            };
        }
        else {
            setNumberOfChildren(ev.target.value);  // There is no validation check. Input the value
        };
    };

    const setHasHECSDebt_handle = (ev) => {
        ev.preventDefault();
        if (!ev.target.checked) {setHECSDebtAmount('');} ;   // if the "do you have a hecs debt" box is unticked, set the hecs debt to nothing
        setHasHECSDebt(!hasHECSDebt);
    };

    const setHECSDebtAmount_handle = (ev) => {
        ev.preventDefault()
        if(isEnforce) {
            if(isNumber(ev)) {
                setHECSDebtAmount(ev.target.value);
            };
        }
        else {
            setHECSDebtAmount(ev.target.value);  // There is no validation check. Input the value
        };
    };


    const setHasPrivateHealth_handle = (ev) => {
        ev.preventDefault();
        setHasPrivateHealth(!hasPrivateHealth);
    };
    
 
    const handleSubmit = (ev) => {
        ev.preventDefault();

        // Pass form data to parent component
        props.onFormSubmit({
             year: taxationYear
            ,income: taxableIncome
            ,age: age
            ,hasSpouse: hasSpouse
            ,spousesIncome: spousesIncome
            ,children: numberOfChildren
            ,isHECS: hasHECSDebt
            ,amtHECS: hecsDebtAmount
            ,hasPHI: hasPrivateHealth
            ,familyTag: (hasSpouse || numberOfChildren>0)
            ,isPreservationAge: (age >= 60) // not accurate, but simplying. Preservation age also needs gender
        });
    };


    return (
      <form onSubmit={validateForm}>
        <h1>COMPONENT: TaxForm</h1>

        {/* Boolean for Validation Checks */}
        <div className="form-line">
            <label htmlFor="isEnforce">Enforce Validation Checks?:</label>
            <input
                type="checkbox"
                id="isEnforce"
                value={isEnforce}
                onChange={(e) => setIsEnforce(!isEnforce)}
            />
        </div>


       {/* Year Selection Dropdown */}
        <div className="form-line">
            <label htmlFor="selectYear">Select Year:</label>
            <select value={taxationYear} onChange={(e) => setTaxationYear_handle(e)}>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
            </select>
        </div>

        {/* Input Taxable Income */}
        <div className="form-line">
            <label htmlFor="taxableIncome">Taxable Income:</label>
            <input
                type="text"
                id="taxableIncome"
                value={taxableIncome}
                // onChange={(e) => setTaxableIncome_handle(e.target.value)}
                onInput={(e) => setTaxableIncome_handle(e)}
            />
        </div>

        {/* Input Age */}
        <div className="form-line">
            <label htmlFor="age">Your Age:</label>
            <input
                type="text"
                id="age"
                value={age}
                onChange={(e) => setAge_handle(e)}
            />
        </div>

        {/* Boolean for Spouse */}
        <div className="form-line">
            <label htmlFor="hasSpouse">Do you have a spouse?:</label>
            <input
                type="checkbox"
                id="hasSpouse"
                value={hasSpouse}
                onChange={(e) => setHasSpouse_handle(e)}
            />
        </div>

        {/* Input Spouse Income */}
        {hasSpouse && (
        <div className="form-line">
            <label htmlFor="spousesIncome">Spouse Income:</label>
            <input
                type="text"
                id="spousesIncome"
                value={spousesIncome}
                onChange={(e) => setSpousesIncome_handle(e)}
            />
        </div>
        )}


        {/* Input Number of Children */}
        <div className="form-line">
            <label htmlFor="numberOfChildren">Number of Children:</label>
            <input
                type="text"
                id="numberOfChildren"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren_handle(e)}
            />
        </div>


        {/* Boolean for HECS debt */}
        <div className="form-line">
            <label htmlFor="hasHECSDebt">Do you have a HECS debt?</label>
            <input
                type="checkbox"
                id="hasHECSDebt"
                checked={hasHECSDebt}
                onChange={(e) => setHasHECSDebt_handle(e)}
            />
        </div>


        {/* Amount for HECS debt */}
        {hasHECSDebt && (
        <div className="form-line">
            <label htmlFor="hecsDebtAmount">HECS Debt Amount:</label>
            <input
                type="text"
                id="hecsDebtAmount"
                value={hecsDebtAmount}
                onChange={(e) => setHECSDebtAmount_handle(e)}
            />
        </div>
        )}


        {/* Boolean for Private Health Insurance */}
        <div className="form-line">
            <label htmlFor="hasPrivateHealth">Do you have Private Health Insurance?</label>
            <input
                type="checkbox"
                id="hasPrivateHealth"
                checked={hasPrivateHealth}
                onChange={(e) => setHasPrivateHealth_handle(e)}
            />
        </div>


        {/* Form submit button */}
        <button>Submit</button>
    </form>
  );
};

export default TaxForm;
