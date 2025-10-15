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
 // Car rates
    const RATES = {
        sedan: 50,
        suv: 80,
        truck: 100,
        motorcycle: 30,
        disabled: 0 // Free for disabled
    };

    // DOM Elements
    const elements = {
        capacityInput: document.getElementById('capacity'),
        setCapacityBtn: document.getElementById('setCapacity'),
        disabledCapacityInput: document.getElementById('disabledCapacity'),
        setDisabledCapacityBtn: document.getElementById('setDisabledCapacity'),
        parkingCapacityDisplay: document.getElementById('parkingCapacity'),
        disabledSpotsDisplay: document.getElementById('disabledSpots'),
        licensePlateInput: document.getElementById('licensePlate'),
        ownerNameInput: document.getElementById('ownerName'),
        carTypeSelect: document.getElementById('carType'),
        parkCarBtn: document.getElementById('parkCar'),
        removeLicensePlateInput: document.getElementById('removeLicensePlate'),
        removeCarBtn: document.getElementById('removeCar'),
        parkingLotStatus: document.getElementById('parkingLotStatus'),
        totalCarsDisplay: document.getElementById('totalCars'),
        availableSpotsDisplay: document.getElementById('availableSpots'),
        clearAllBtn: document.getElementById('clearAll'),
        revenueDepBtn: document.getElementById('revenueDep'),
        saveDataBtn: document.getElementById('saveData')
    };

    // Event listeners
    elements.setCapacityBtn.addEventListener('click', setParkingCapacity);
    elements.setDisabledCapacityBtn.addEventListener('click', setDisabledParkingCapacity);
    elements.parkCarBtn.addEventListener('click', parkCar);
    elements.removeCarBtn.addEventListener('click', removeCar);
    elements.clearAllBtn.addEventListener('click', clearAllCars);
    elements.revenueDepBtn.addEventListener('click', showTotalRevenue);
    elements.saveDataBtn.addEventListener('click', saveToFile);

    // Trigger button on Enter key
    elements.capacityInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.setCapacityBtn.click();
    });

    elements.disabledCapacityInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.setDisabledCapacityBtn.click();
    });

    elements.licensePlateInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.parkCarBtn.click();
    });

    elements.ownerNameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.parkCarBtn.click();
    });

    elements.carTypeSelect.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.parkCarBtn.click();
    });

    elements.removeLicensePlateInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') elements.removeCarBtn.click();
    });

    function setParkingCapacity() {
        const capacityValue = parseInt(elements.capacityInput.value);
        if (capacityValue > 0) {
            parkingCapacity = capacityValue;
            elements.parkingCapacityDisplay.textContent = `Parking Capacity: ${parkingCapacity}`;
            updateAvailableSpots();
            alert('Parking capacity set successfully!');
        } else {
            alert('Please enter a valid capacity.');
        }
        saveParkingData();
    }
   function setDisabledParkingCapacity() {
        const disabledValue = parseInt(elements.disabledCapacityInput.value);
        if (disabledValue >= 0) {
            disabledCapacity = disabledValue;
            elements.disabledSpotsDisplay.textContent = `Disabled Parking Spots Available: ${disabledCapacity}`;
            alert('Disabled parking capacity set successfully!');
        } else {
            alert('Please enter a valid disabled capacity.');
        }
        saveParkingData();
    }

    function parkCar() {
        const licensePlate = elements.licensePlateInput.value.trim();
        const ownerName = elements.ownerNameInput.value.trim();
        const carType = elements.carTypeSelect.value;

        if (!licensePlate || !ownerName) {
            return alert('Please enter both license plate and owner name.');
        }

        if (carType === 'disabled') {
            if (parkedCars.filter(car => car.carType === 'disabled').length >= disabledCapacity) {
                return alert('No available disabled parking spots.');
            }
        } else if (parkedCars.length - parkedCars.filter(car => car.carType === 'disabled').length >= parkingCapacity) {
            return alert('Parking lot is full. Cannot park more cars.');
        }

        const car = {
            licensePlate,
            ownerName,
            carType,
            rate: RATES[carType],
            timeIn: new Date()
        };

        parkedCars.push(car);
        saveParkingData();
        updateParkingLotStatus();
        updateAvailableSpots();
        clearInputFields();
    }

    function removeCar() {
        const licensePlateToRemove = elements.removeLicensePlateInput.value.trim();
        const index = parkedCars.findIndex(car => car.licensePlate === licensePlateToRemove);

        if (index > -1) {
            parkedCars.splice(index, 1);
            saveParkingData();
            updateParkingLotStatus();
            updateAvailableSpots();
            elements.removeLicensePlateInput.value = '';
            alert('Car removed successfully!');
        } else {
            alert('Car not found in parking lot.');
        }
    }

    function clearAllCars() {
        parkedCars = [];
        saveParkingData();
        updateParkingLotStatus();
        updateAvailableSpots();
        alert('All cars have been removed from the parking lot.');
    }

    function updateParkingLotStatus() {
        elements.parkingLotStatus.innerHTML = '';
        parkedCars.forEach(car => {
            const li = document.createElement('li');
            li.textContent = `License Plate: ${car.licensePlate}, Owner: ${car.ownerName}, Type: ${car.carType}, Rate: Rs. ${car.rate}/hour, Entry Time: ${car.timeIn}`;
            elements.parkingLotStatus.appendChild(li);
        });
        elements.totalCarsDisplay.textContent = `Total Cars Parked: ${parkedCars.length}`;
    }

    function updateAvailableSpots() {
        const availableSpots = parkingCapacity - parkedCars.filter(car => car.carType !== 'disabled').length;
        const availableDisabledSpots = disabledCapacity - parkedCars.filter(car => car.carType === 'disabled').length;
        elements.availableSpotsDisplay.textContent = `Available Spots: ${availableSpots}, Disabled Spots: ${availableDisabledSpots}`;
    }

    function saveToFile() {
        const data = JSON.stringify(parkedCars, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'parking_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Parking data has been saved to your disk as parking_data.json');
    }

    function showTotalRevenue() {
        let totalRevenue = 0;

        parkedCars.forEach(car => {
            const timeIn = new Date(car.timeIn);
            const timeOut = new Date(); // current time
            const hoursParked = Math.ceil((timeOut - timeIn) / (1000 * 60 * 60)); // Convert ms to hours and round up
            const carRevenue = hoursParked * car.rate;
            totalRevenue += carRevenue;
        });

        alert(`Total Revenue Generated: Rs. ${totalRevenue}`);
    }

    function saveParkingData() {
        localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
    }

    function loadParkingData() {
        return JSON.parse(localStorage.getItem('parkedCars'));
    }

    function clearInputFields() {
        elements.licensePlateInput.value = '';
        elements.ownerNameInput.value = '';
    }
});