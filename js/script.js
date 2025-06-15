function showToast(message, type = 'success') {
    const toast = document.getElementById('toastContainer');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showFieldMessage(element, message, isError = true, duration = 3000) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
    element.classList.toggle('text-red-600', isError);
    element.classList.toggle('text-green-600', !isError);
    if (duration > 0) {
        setTimeout(() => element.classList.add('hidden'), duration);
    }
}

function hideFieldMessage(element) {
    if (!element) return;
    element.classList.add('hidden');
    element.textContent = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname.split('/').pop();

    if (pathname !== 'login.html') {
        initUserMenu();
        initSidebar();
    }

    if (pathname === 'login.html') {
        initLoginPage();
    } else if (pathname === 'dangky.html') {
        initDangKyPage();
    } else if (pathname === 'lichsu.html') {
        initLichSuPage();
    }
});



function initSidebar() {
    const toggleButton = document.getElementById('nav-internship-toggle');
    const submenu = document.getElementById('nav-internship-submenu');
    const arrow = document.getElementById('nav-internship-arrow');
    const currentPage = window.location.pathname.split('/').pop();

    const navLinks = {
        home: document.getElementById('nav-home'),
        register: document.getElementById('nav-register'),
        history: document.getElementById('nav-history')
    };

    if (currentPage === 'dangky.html' || currentPage === 'lichsu.html') {
        submenu.classList.remove('hidden');
        arrow.classList.add('rotate-180');
        if (currentPage === 'dangky.html') {
            navLinks.register.classList.add('bg-blue-700', 'text-white');
        } else {
            navLinks.history.classList.add('bg-blue-700', 'text-white');
        }
    } else if (currentPage === 'indexStudent.html') {
        navLinks.home.classList.add('bg-blue-700', 'text-white');
    }

    toggleButton.addEventListener('click', () => {
        submenu.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    });
}



function initUserMenu() {
    const menuButton = document.getElementById('user-menu-button');
    const menu = document.getElementById('user-menu');
    const logoutButton = document.getElementById('logout-button');

    if (!menuButton || !menu || !logoutButton) return;

    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.classList.toggle('hidden');
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('tluUser');
        localStorage.removeItem('thuyloiInternshipRegistrations');
        window.location.href = 'login.html';
    });

    window.addEventListener('click', (e) => {
        if (!menu.classList.contains('hidden') && !menuButton.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
}


function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    document.body.classList.add('login-page');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value;
        let role = null;

        if (username === 'admin' && password === 'password123') role = 'admin';
        else if (username === 'teacher@example.com' && password === 'password123') role = 'lecturer';
        else if (username === 'student@example.com' && password === 'password123') role = 'student';

        const loginMessage = document.getElementById('login-message');
        if (role) {
            loginMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
            loginMessage.classList.remove('text-red-600');
            loginMessage.classList.add('text-green-600');
            localStorage.setItem('tluUser', JSON.stringify({ username, role }));
            setTimeout(() => {
                if (role === 'admin') window.location.href = 'quanlydoanhnghip.html';
                else if (role === 'lecturer') window.location.href = 'teacher.html';
                else window.location.href = 'indexStudent.html';
            }, 1000);
        } else {
            loginMessage.textContent = 'Sai email hoặc mật khẩu!';
            loginMessage.classList.add('text-red-600');
            loginMessage.classList.remove('text-green-600');
            const card = document.querySelector('.login-card');
            if (card) {
                card.classList.add('animate-shake');
                setTimeout(() => card.classList.remove('animate-shake'), 500);
            }
        }
    });
}


function initDangKyPage() {
    const internshipForm = document.getElementById('internship-form');
    if (!internshipForm) return;

    const studentIdInput = document.getElementById('student-id');
    const fullNameInput = document.getElementById('full-name');
    const phoneNumberInput = document.getElementById('phone-number');
    const addressInput = document.getElementById('address');
    const hasFacilityRadio = document.getElementById('has-facility');
    const noFacilityRadio = document.getElementById('no-facility');
    const internshipPositionInput = document.getElementById('internship-position');
    const internshipPositionLabel = document.getElementById('internship-position-label');

    const confirmModal = document.getElementById('confirm-modal');
    const emailVerificationModal = document.getElementById('email-verification-modal');
    const successModal = document.getElementById('success-modal');

    const openConfirmModalButton = document.getElementById('open-confirm-modal');
    const cancelConfirmButton = document.getElementById('cancel-confirm');
    const acceptConfirmButton = document.getElementById('accept-confirm');
    const closeVerificationModal = document.getElementById('close-verification-modal');
    const submitVerificationCodeButton = document.getElementById('submit-verification-code');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const goToHistoryButton = document.getElementById('go-to-history-button');

    const verificationEmail = document.getElementById('verification-email');
    const verificationCodeInput = document.getElementById('verification-code-input');
    const verificationError = document.getElementById('verification-error');
    const verificationEnvelopeIcon = document.getElementById('verification-envelope-icon');
    const simulatedCodeDisplay = document.getElementById('simulated-code-display'); 


    const conditionalFields = document.getElementById('conditional-fields');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const facilityNameInput = document.getElementById('facility-name');

    const studentIdMessage = document.getElementById('student-id-message');
    const phoneNumberMessage = document.getElementById('phone-number-message');
    const addressMessage = document.getElementById('address-message');
    const startDateMessage = document.getElementById('start-date-message');
    const facilityMessage = document.getElementById('facility-message');
    const internshipPositionMessage = document.getElementById('internship-position-message');

    let generatedCode = null;
    const SIMULATED_EXISTING_STUDENT_IDS = ["2251172557", "1234567890", "0987654321", "2251172540", "2251172266", "2251172279",
        "2251172272", "2251172371", "2251172378", "2251172518", "2251172455", "2251172290", "2251172533", "2251172540", "2251172244",
        "2251172491", "2251172339", "2251172467", "2251172276", "2251172345", "2251172405", "2251172416", "2251172369", "2251172224",
        "2251172267", "2251172435", "2251172388", "2251172387", "2251172465", "2251172368", "2251172367", "2251172383", "2151173831",
        "2251172348", "2251172298", "2251172502", "2251172564", "2251172450", "2251172356", "2251172264", "2251172355", "2251172354",
        "2251172325", "2251172410", "2251172546", "2251172281", "2251172417", "2251172253", "2251172534", "2251172419", "2251172294",
        "2251172474", "2251172530", "2251172523", "2251172510"];

    const STUDENT_ID_TO_NAME = {
        "2251172266": "Đinh Quang Đạt",
        "2251172371": "Bùi Khắc Huy",
        "2251172279": "Nguyễn Thành Đồng",
        "2251172272": "Trần Tiến Đạt",
        "2251172378": "Vũ Xuân Huy",
        "2251172518": "Hoàng Thanh Thuỷ",
        "2251172455": "Nguyễn Ngọc Phước",
        "2251172290": "Nguyễn Lê Đức",
        "2251172533": "Ngô Minh Trung",
        "2251172540": "Đoàn Thanh Tú",
        "2251172557": "Hoàng Quang Vinh",
        "2251172244": "Ngô Thị Ngọc Ánh",
        "2251172491": "Lê Sỹ Thắng",
        "2251172339": "Bùi Viết Hiển",
        "2251172467": "Trần Hồng Quang",
        "2251172276": "Nguyễn Thị Dinh",
        "2251172345": "Nguyễn Quang Hiếu",
        "2251172405": "Lương Thị Thùy Liên",
        "2251172416": "Đỗ Thị Hiền Lương",
        "2251172369": "Bạch Quốc Huy",
        "2251172224": "Lăng Tuấn Anh",
        "2251172267": "Đỗ Văn Đat",
        "2251172435": "Tạ Thị Hồng Ngát",
        "2251172388": "Trần Gia Khánh",
        "2251172387": "Mai Sỹ Duy Khánh",
        "2251172465": "Nguyễn Văn Quang",
        "2251172368": "Chu Mạnh Hữu",
        "2251172367": "Vũ Đăng Hưởng",
        "2251172383": "Vũ Quang Khải",
        "2251172562": "Phạm Quý Vũ",
        "2251172321": "Nguyễn Vũ Tùng Duy",
        "2251172225": "Lê Đình Anh",
        "2251172330": "Lê Văn Hải",
        "2251172351": "Bùi Trí Hoàng",
        "2151173831": "Khuất Văn Trường",
        "2251172348": "Vũ Ngọc Hiếu",
        "2251172298": "Đỗ Tuấn Dũng",
        "2251172502": "Nguyễn Quang Thành",
        "2251172564": "Nguyễn Minh Vương",
        "2251172450": "Nguyễn Duy Phong",
        "2251172356": "Trần Việt Hoàng",
        "2251172264": "Trần Công Danh",
        "2251172355": "Nguyễn Tuấn Hoàng",
        "2251172354": "Nguyễn Sinh Hoàng",
        "2251172325": "Tạ Ngọc Hà",
        "2251172410": "Lê Xuân Lộc",
        "2251172546": "Lại Minh Tuấn",
        "2251172281": "Bùi Mạnh Đức",
        "2251172417": "Lê Thanh Lương",
        "2251172253": "Lê Đức Chiến",
        "2251172534": "Nguyễn Thành Trung",
        "2251172419": "Đỗ Mạnh Mạnh",
        "2251172294": "Trần Văn Đức",
        "2251172474": "Hoàng Văn Quyết",
        "2251172530": "Nguyễn Tiến Trọng",
        "2251172523": "Nguyễn Minh Tiến",
        "2251172510": "Đỗ Văn Thiệu"
    };

    function handleFacilityStatusChange() {
        if (hasFacilityRadio.checked) {
            conditionalFields.classList.remove('hidden');
            internshipPositionLabel.textContent = 'Vị trí thực tập';
            internshipPositionInput.placeholder = 'Nhập vị trí thực tập...';
        } else {
            conditionalFields.classList.add('hidden');
            internshipPositionLabel.textContent = 'Vị trí thực tập mong muốn';
            internshipPositionInput.placeholder = 'Nhập vị trí thực tập mong muốn...';
            startDateInput.value = '';
            endDateInput.value = '';
            facilityNameInput.value = '';
            hideFieldMessage(startDateMessage);
            hideFieldMessage(facilityMessage);
        }
    }

    function validateStudentId() {
        const idValue = studentIdInput.value.trim();
        studentIdInput.classList.remove('border-red-500');
        hideFieldMessage(studentIdMessage);
        fullNameInput.value = '';
        if (!idValue) {
            showFieldMessage(studentIdMessage, "Mã sinh viên không được bỏ trống.", true, 0);
            studentIdInput.classList.add('border-red-500');
            return false;
        }
        if (!/^\d{10}$/.test(idValue)) {
            showFieldMessage(studentIdMessage, "Mã sinh viên không đủ 10 số hoặc chứa ký tự không hợp lệ. Ví dụ: 2251172557", true, 0);
            studentIdInput.classList.add('border-red-500');
            return false;
        }
        if (!SIMULATED_EXISTING_STUDENT_IDS.includes(idValue)) {
            showFieldMessage(studentIdMessage, "Mã sinh viên không tồn tại trong hệ thống.", true, 0);
            studentIdInput.classList.add('border-red-500');
            return false;
        }
        if (STUDENT_ID_TO_NAME[idValue]) {
            fullNameInput.value = STUDENT_ID_TO_NAME[idValue];
            hideFieldMessage(studentIdMessage);
        }
        return true;
    }

    function validatePhoneNumber() {
        const value = phoneNumberInput.value.trim();
        phoneNumberInput.classList.remove('border-red-500');
        hideFieldMessage(phoneNumberMessage);
        if (!value) {
            showFieldMessage(phoneNumberMessage, "Số điện thoại không được bỏ trống.", true, 0);
            phoneNumberInput.classList.add('border-red-500');
            return false;
        }
        if (!/^0\d{9}$/.test(value)) {
            showFieldMessage(phoneNumberMessage, 'Số điện thoại phải là 10 số và bắt đầu bằng số 0.', true, 0);
            phoneNumberInput.classList.add('border-red-500');
            return false;
        }
        return true;
    }

    function validateRequiredField(input, msgEl, msg) {
        input.classList.remove('border-red-500');
        hideFieldMessage(msgEl);
        if (!input.value.trim()) {
            showFieldMessage(msgEl, msg, true, 0);
            input.classList.add('border-red-500');
            return false;
        }
        return true;
    }

    function validateStartDate() {
        hideFieldMessage(startDateMessage);
        startDateInput.classList.remove('border-red-500');
        endDateInput.value = '';
        endDateInput.type = 'text';
        if (!startDateInput.value.trim()) return true;
        const selectedDate = new Date(startDateInput.value.split('/').reverse().join('-'));
        if (isNaN(selectedDate.getTime())) {
            showFieldMessage(startDateMessage, 'Ngày không hợp lệ.', true, 0);
            startDateInput.classList.add('border-red-500');
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showFieldMessage(startDateMessage, 'Ngày bắt đầu không được là ngày trong quá khứ.', true, 0);
            startDateInput.classList.add('border-red-500');
            return false;
        }
        const calculatedEndDate = new Date(selectedDate);
        calculatedEndDate.setDate(selectedDate.getDate() + 90);
        endDateInput.value = calculatedEndDate.toLocaleDateString('en-GB').replace(/\//g, '/');
        return true;
    }

    function validateForm(showMessages = true) {
        let isValid = true;
        let firstInvalidField = null;
        const setInvalid = (field) => {
            if (!firstInvalidField) firstInvalidField = field;
            isValid = false;
        };
        if (!validateStudentId()) setInvalid(studentIdInput);
        if (!validatePhoneNumber()) setInvalid(phoneNumberInput);
        if (!validateRequiredField(addressInput, addressMessage, "Địa chỉ không được bỏ trống.")) setInvalid(addressInput);
        if (!validateRequiredField(internshipPositionInput, internshipPositionMessage, internshipPositionLabel.textContent + ' không được bỏ trống.')) setInvalid(internshipPositionInput);
        if (hasFacilityRadio.checked) {
            if (!validateRequiredField(startDateInput, startDateMessage, "Ngày bắt đầu không được bỏ trống.")) setInvalid(startDateInput);

            else if (!validateStartDate()) setInvalid(startDateInput);

            if (!validateRequiredField(facilityNameInput, facilityMessage, "Tên cơ sở thực tập không được bỏ trống.")) setInvalid(facilityNameInput);
        }
        if (firstInvalidField && showMessages) {
            firstInvalidField.focus();
        }
        return isValid;
    }

    function saveRegistrationData() {
        const facilityStatus = hasFacilityRadio.checked ? 'yes' : 'no';
        const internshipData = {
            studentId: studentIdInput.value.trim(),
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            address: addressInput.value.trim(),
            facilityStatus: facilityStatus,
            facilityName: facilityStatus === 'yes' ? facilityNameInput.value.trim() : null,
            startDate: facilityStatus === 'yes' ? startDateInput.value : null,
            endDate: facilityStatus === 'yes' ? endDateInput.value : null,
            internshipPosition: internshipPositionInput.value.trim(),
            registrationTimestamp: new Date().toISOString()
        };
        try {
            let history = JSON.parse(localStorage.getItem('thuyloiInternshipRegistrations')) || [];
            history.unshift(internshipData);
            localStorage.setItem('thuyloiInternshipRegistrations', JSON.stringify(history));
        } catch (error) {
            console.error("Lỗi khi lưu vào localStorage: ", error);
            showToast('Đã xảy ra lỗi khi lưu đăng ký.', 'error');
        }
    }

    studentIdInput.addEventListener('blur', validateStudentId);
    phoneNumberInput.addEventListener('blur', validatePhoneNumber);
    addressInput.addEventListener('blur', () => validateRequiredField(addressInput, addressMessage, "Địa chỉ không được bỏ trống."));
    internshipPositionInput.addEventListener('blur', () => validateRequiredField(internshipPositionInput, internshipPositionMessage, internshipPositionLabel.textContent + ' không được bỏ trống.'));
    noFacilityRadio.addEventListener('change', handleFacilityStatusChange);
    hasFacilityRadio.addEventListener('change', handleFacilityStatusChange);
    startDateInput.addEventListener('focus', () => startDateInput.type = 'date');
    startDateInput.addEventListener('blur', () => {
        startDateInput.type = 'text';
        if (startDateInput.value) {

            try { startDateInput.value = new Date(startDateInput.value).toLocaleDateString('en-GB'); } catch (e) { }
        }
        validateStartDate();
    });

    openConfirmModalButton.addEventListener('click', () => {
        if (!validateForm(true)) {
            showToast('Vui lòng kiểm tra lại các thông tin đã nhập.', 'error');
            return;
        }
        const confirmInfo = document.getElementById('confirm-info');
        let facilityInfoHtml = '';
        if (hasFacilityRadio.checked) {
            facilityInfoHtml = `
                <div><b>Ngày bắt đầu:</b> ${startDateInput.value}</div>
                <div><b>Ngày kết thúc:</b> ${endDateInput.value}</div>
                <div><b>Tên cơ sở:</b> ${facilityNameInput.value.trim()}</div>
            `;
        }
        confirmInfo.innerHTML = `
            <div><b>Mã sinh viên:</b> ${studentIdInput.value.trim()}</div>
            <div><b>Họ và tên:</b> ${fullNameInput.value.trim()}</div>
            <div><b>Số điện thoại:</b> ${phoneNumberInput.value.trim()}</div>
            <div><b>Địa chỉ liên hệ:</b> ${addressInput.value.trim()}</div>
            <div><b>Tình trạng cơ sở:</b> ${hasFacilityRadio.checked ? 'Đã có' : 'Chưa có'}</div>
            ${facilityInfoHtml}
            <div><b>${internshipPositionLabel.textContent}:</b> ${internshipPositionInput.value.trim()}</div>
        `;
        confirmModal.classList.remove('hidden');
    });

    cancelConfirmButton.addEventListener('click', () => confirmModal.classList.add('hidden'));

    acceptConfirmButton.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

        simulatedCodeDisplay.textContent = `(Mã giả lập để test: ${generatedCode})`;
        simulatedCodeDisplay.classList.remove('hidden');

        const studentEmail = studentIdInput.value.trim() + "@e.tlu.edu.vn";
        verificationEmail.textContent = studentEmail;

        verificationCodeInput.value = '';
        verificationCodeInput.classList.remove('border-red-500');
        hideFieldMessage(verificationError);

        emailVerificationModal.classList.remove('hidden');
        verificationCodeInput.focus();
    });

    closeVerificationModal.addEventListener('click', () => {
        emailVerificationModal.classList.add('hidden');
        simulatedCodeDisplay.classList.add('hidden'); 
        confirmModal.classList.remove('hidden'); 
    });

    submitVerificationCodeButton.addEventListener('click', () => {
        const enteredCode = verificationCodeInput.value.trim();


        if (!enteredCode) {
            verificationError.textContent = 'Vui lòng nhập mã xác nhận đã được gửi về email.';
            verificationError.classList.remove('hidden');
            verificationCodeInput.classList.add('border-red-500');
            verificationEnvelopeIcon.classList.add('error');
            return;
        }


        if (enteredCode !== generatedCode) {
            verificationError.textContent = 'Mã xác nhận không hợp lệ.';
            verificationError.classList.remove('hidden');
            verificationCodeInput.classList.add('border-red-500');

            verificationEnvelopeIcon.classList.add('error');

            return;
        }

        emailVerificationModal.classList.add('hidden');
        simulatedCodeDisplay.classList.add('hidden');

        verificationCodeInput.classList.remove('border-red-500');
        verificationEnvelopeIcon.classList.remove('error');
        verificationError.classList.add('hidden');

        saveRegistrationData();
        successModal.classList.remove('hidden');
        internshipForm.reset();
        handleFacilityStatusChange();
    });


    verificationCodeInput.addEventListener('input', () => {
        verificationCodeInput.classList.remove('border-red-500');
        verificationEnvelopeIcon.classList.remove('error');
        verificationError.classList.add('hidden');
    });


    closeSuccessModal.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    goToHistoryButton.addEventListener('click', () => {
        window.location.href = 'lichsu.html';
    });

    handleFacilityStatusChange();
}

function initLichSuPage() {
    const loading = document.getElementById('history-loading');
    const tableContainer = document.getElementById('history-table-container');
    const empty = document.getElementById('history-empty');

    if (!loading || !tableContainer || !empty) {
        console.error("Lỗi: Một hoặc nhiều phần tử của trang lịch sử không được tìm thấy.");
        return;
    }

    loading.style.display = 'none';

    let history = [];
    try {
        const storedData = localStorage.getItem('thuyloiInternshipRegistrations');
        if (storedData) {
            history = JSON.parse(storedData);
        }
    } catch (e) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", e);
        history = []; 
    }

    if (!history || history.length === 0) {
        empty.style.display = '';
        tableContainer.style.display = 'none';
        return;
    }

    let html = `<div class='w-full' style='overflow-x: auto;'><table class='table' style='table-layout:auto; width: 100%;'><thead><tr>
        <th>Mã SV</th>
        <th>Họ tên</th>
        <th>SĐT</th>
        <th>Cơ sở</th>
        <th>Vị trí</th>
        <th>Ngày bắt đầu</th>
        <th>Ngày kết thúc</th>
        <th>Thời gian ĐK</th>
    </tr></thead><tbody>`;

    history.forEach(d => {
        html += `<tr>
            <td>${d.studentId || ''}</td>
            <td>${d.fullName || ''}</td>
            <td>${d.phoneNumber || ''}</td>
            <td>${d.facilityStatus === 'yes' ? `<span class='badge badge-success'>${d.facilityName || 'Đã có'}</span>` : `<span class='badge badge-warning'>Chưa có</span>`}</td>
            <td>${d.internshipPosition || ''}</td>
            <td>${d.startDate || '-'}</td>
            <td>${d.endDate || '-'}</td>
            <td>${d.registrationTimestamp ? (new Date(d.registrationTimestamp)).toLocaleString('vi-VN') : '-'}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';

    tableContainer.innerHTML = html;
    tableContainer.style.display = '';
    empty.style.display = 'none';
}