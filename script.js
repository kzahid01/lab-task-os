document.addEventListener('DOMContentLoaded', function () {
    let parkingCapacity = 0;
    let disabledCapacity = 0;
    let parkedCars = loadParkingData() || []; // Load from local storage if available
 
const RATES = {
        sedan: 50,
        suv: 80,
        truck: 100,
        motorcycle: 30,
        disabled: 0 // Free for disabled
    };
