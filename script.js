document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const principalInput = document.getElementById('principal');
    const dailyInterestDisplay = document.getElementById('dailyInterest');
    const returnDateInput = document.getElementById('returnDate');
    const accumulatedInterestDisplay = document.getElementById('accumulatedInterest');

    // Table Elements
    const table7Days = document.getElementById('table7Days');
    const table15Days = document.getElementById('table15Days');
    const table30Days = document.getElementById('table30Days');

    // Constants
    const INTEREST_RATE = 0.02; // 2% per day

    // Helper: Format Number with Commas
    const formatNumber = (num) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    };

    // Helper: Parse Number from Input (removes commas)
    const parseNumber = (str) => {
        return parseFloat(str.replace(/,/g, '')) || 0;
    };

    // Core Calculation Logic
    const calculate = () => {
        const principalStr = principalInput.value;
        const principal = parseNumber(principalStr);

        // Calculate Daily Interest
        const dailyInterest = principal * INTEREST_RATE;

        // Update Daily Display
        dailyInterestDisplay.textContent = formatNumber(dailyInterest);

        // Update Accumulated Interest if Date Selected
        updateAccumulatedInterest(dailyInterest);

        // Update Comparison Table
        updateTable(dailyInterest);
    };

    // Update Accumulated Interest based on Date Picker
    const updateAccumulatedInterest = (dailyInterest) => {
        if (!returnDateInput.value) {
            accumulatedInterestDisplay.textContent = '0 บาท';
            return;
        }

        const today = new Date();
        // Reset time part to compare dates correctly
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(returnDateInput.value);
        selectedDate.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffTime = selectedDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            accumulatedInterestDisplay.textContent = 'ระบุวันที่ในอนาคต';
            accumulatedInterestDisplay.classList.add('text-red-400');
            accumulatedInterestDisplay.classList.remove('text-secondary');
        } else {
            const accumulated = dailyInterest * diffDays;
            accumulatedInterestDisplay.textContent = `${formatNumber(accumulated)} บาท (${diffDays} วัน)`;
            accumulatedInterestDisplay.classList.remove('text-red-400');
            accumulatedInterestDisplay.classList.add('text-secondary');
        }
    };

    // Update Comparison Table
    const updateTable = (dailyInterest) => {
        table7Days.textContent = formatNumber(dailyInterest * 7);
        table15Days.textContent = formatNumber(dailyInterest * 15);
        table30Days.textContent = formatNumber(dailyInterest * 30);
    };

    // Input Formatting (Components with commas)
    principalInput.addEventListener('input', (e) => {
        // Remove non-numeric chars except dot
        let value = e.target.value.replace(/[^\d.]/g, '');

        // Prevent multiple dots
        const parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');

        // Apply sanitized value
        if (e.target.value !== value) {
            e.target.value = value;
        }

        calculate();
    });

    // Format Input on Blur (Add commas)
    principalInput.addEventListener('blur', (e) => {
        const val = parseNumber(e.target.value);
        if (val > 0) {
            e.target.value = formatNumber(val);
        }
    });

    // Remove commas on Focus for easy editing
    principalInput.addEventListener('focus', (e) => {
        const val = parseNumber(e.target.value);
        if (val > 0) {
            e.target.value = val.toString();
        } else {
            e.target.value = '';
        }
    });

    // Date Picker Event
    returnDateInput.addEventListener('change', calculate);

    // Initial Set Min Date to Tomorrow
    const today = new Date();
    today.setDate(today.getDate() + 1);
    returnDateInput.min = today.toISOString().split('T')[0];
});
