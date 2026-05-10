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

    // ==============================
    // Credit Check System
    // ==============================

    const customers = {
        '09001': {
            name: 'เบส',
            totalBorrowed: 7000,
            defaultCount: 1,
        },
        '09002': {
            name: 'ซี',
            totalBorrowed: 4000,
            defaultCount: 0,
        },
        '09003': {
            name: 'วา',
            totalBorrowed: 5000,
            defaultCount: 0,
        },
    };

    const getCreditScore = (customer) => {
        // Base score 100, deduct 30 per default
        const score = Math.max(0, 100 - customer.defaultCount * 30);
        if (score >= 90) return { score, label: 'ดีเยี่ยม', color: 'text-emerald-400', bar: 'bg-emerald-400', pct: score };
        if (score >= 70) return { score, label: 'ดี', color: 'text-blue-400', bar: 'bg-blue-400', pct: score };
        if (score >= 50) return { score, label: 'พอใช้', color: 'text-yellow-400', bar: 'bg-yellow-400', pct: score };
        return { score, label: 'ต้องปรับปรุง', color: 'text-red-400', bar: 'bg-red-400', pct: score };
    };

    const renderCreditResult = (customer) => {
        const credit = getCreditScore(customer);
        const defaultBadge = customer.defaultCount === 0
            ? `<span class="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1">✅ ไม่มีประวัติผิดนัด</span>`
            : `<span class="inline-flex items-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1">⚠️ ผิดนัดชำระ ${customer.defaultCount} ครั้ง</span>`;

        return `
            <div class="bg-gray-800/80 border border-gray-700 rounded-2xl p-5 space-y-4">
                <!-- Customer Name & Badge -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                            ${customer.name.charAt(0)}
                        </div>
                        <div>
                            <p class="font-bold text-white text-base">${customer.name}</p>
                            <p class="text-xs text-gray-400">ลูกค้า VIDER เงินด่วน</p>
                        </div>
                    </div>
                    ${defaultBadge}
                </div>

                <!-- Credit Score Bar -->
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-400 uppercase tracking-wide">คะแนนเครดิต</span>
                        <span class="font-bold text-lg ${credit.color}">${credit.score}/100 – ${credit.label}</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full ${credit.bar} rounded-full transition-all duration-700" style="width: ${credit.pct}%"></div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/40">
                        <p class="text-xs text-gray-400 mb-1">ยอดกู้สะสมทั้งหมด</p>
                        <p class="text-lg font-bold text-white">${customer.totalBorrowed.toLocaleString()} <span class="text-sm font-normal text-gray-400">บาท</span></p>
                    </div>
                    <div class="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/40">
                        <p class="text-xs text-gray-400 mb-1">ประวัติผิดนัด</p>
                        <p class="text-lg font-bold ${customer.defaultCount > 0 ? 'text-red-400' : 'text-emerald-400'}">${customer.defaultCount} <span class="text-sm font-normal text-gray-400">ครั้ง</span></p>
                    </div>
                </div>
            </div>
        `;
    };

    const checkCreditBtn = document.getElementById('checkCreditBtn');
    const customerIdInput = document.getElementById('customerIdInput');
    const creditResult = document.getElementById('creditResult');

    const handleCreditCheck = () => {
        const id = customerIdInput.value.trim();
        const customer = customers[id];

        creditResult.classList.remove('hidden');

        if (!id) {
            creditResult.innerHTML = `<p class="text-center text-gray-400 text-sm py-2">กรุณากรอกรหัสประจำตัวลูกค้า</p>`;
            return;
        }

        if (!customer) {
            creditResult.innerHTML = `
                <div class="flex items-center gap-3 bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                    <span class="text-2xl">❌</span>
                    <div>
                        <p class="text-red-400 font-semibold">ไม่พบรหัสประจำตัว</p>
                        <p class="text-xs text-gray-400">กรุณาตรวจสอบรหัสอีกครั้ง หรือติดต่อผู้ให้บริการ</p>
                    </div>
                </div>`;
            return;
        }

        creditResult.innerHTML = renderCreditResult(customer);
    };

    checkCreditBtn.addEventListener('click', handleCreditCheck);
    customerIdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCreditCheck();
    });
});
