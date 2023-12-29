## What does this code do?

This is a React app that takes income tax information from the Australian Tax Office, and estimates the amount of tax payable.

The source of the data is a self-made JSON file, with tax brackets going back to 2010. This data is incomplete.

## How does it work?
The app keeps all its information in FrontEnd(), where it contains **TaxForm()**, **DropDownOpts()**, **DropDownResults()** and the resulting information from **TaxCalculate()**
A small demonstration labeled BasicLayout.png has been included in the repository files.

Information input is collected using the **TaxForm()** component, which is then passed as a state into **TaxRequest()**. From there, a JSON request is made and the JSON data is seperated into different types of tax:
```sh
- Income Tax
- HECS debt repayable
- Medicare Levy 
- Medicare Levy Surcharge
- Private Health Insurance Rebate
- Low Income Tax Offset
- Low Middle Income Tax Offset
```

Once these amounts are calculated, they are displayed to TaxFrontEnd() and inform the user of the tax estimated.

## Other Features
Additionally, **TaxFrontEnd()** contains two components: **DropDownOpts()** and **DropDownResults()**. On a change event, the **DropDownResults()** will present information about a particular tax type in a certain year

## Where is the JSON file?
You can find it here!
https://github.com/BenArthurOce/TaxRatesJSON