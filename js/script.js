// --- GLOBAL HELPER FUNCTIONS ---
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


// --- PAGE-SPECIFIC LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname.split('/').pop();

    // Khởi tạo menu người dùng trên các trang có header
    if (pathname !== 'login.html') {
        initUserMenu();
    }

    // Khởi tạo logic riêng cho từng trang
    if (pathname === 'login.html') {
        initLoginPage();
    } else if (pathname === 'dangky.html') {
        initDangKyPage();
    } else if (pathname === 'lichsu.html') {
        initLichSuPage();
    }
});

// --- USER MENU AND LOGOUT FUNCTIONALITY ---
function initUserMenu() {
    const menuButton = document.getElementById('user-menu-button');
    const menu = document.getElementById('user-menu');
    const logoutButton = document.getElementById('logout-button');

    // Nếu không tìm thấy các thành phần này thì thoát (ví dụ: trên trang login)
    if (!menuButton || !menu || !logoutButton) {
        return;
    }

    // Bấm vào avatar để hiện/ẩn menu
    menuButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn sự kiện click lan ra window
        menu.classList.toggle('hidden');
    });

    // Bấm nút đăng xuất
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Đăng xuất...");

        // Xóa dữ liệu người dùng và lịch sử đăng ký khỏi localStorage
        localStorage.removeItem('tluUser');
        localStorage.removeItem('thuyloiInternshipRegistrations');

        // Chuyển hướng về trang đăng nhập
        window.location.href = 'login.html';
    });

    // Bấm ra ngoài để đóng menu
    window.addEventListener('click', (e) => {
        if (!menu.classList.contains('hidden')) {
            if (!menuButton.contains(e.target)) {
                menu.classList.add('hidden');
            }
        }
    });
}


// --- LOGIN PAGE SCRIPT (login.html) ---
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (!loginForm) return;

    document.body.classList.add('login-page');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value;
        let role = null;

        // *** START: PHẦN ĐƯỢC THAY ĐỔI ***
        // Thêm kiểm tra cho vai trò 'admin'
        if (username === 'admin' && password === 'password123') {
            role = 'admin';
        } else if (username === 'teacher@example.com' && password === 'password123') {
            role = 'lecturer';
        } else if (username === 'student@example.com' && password === 'password123') {
            role = 'student';
        }

        if (role) {
            loginMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
            loginMessage.classList.remove('text-red-600');
            loginMessage.classList.add('text-green-600');
            localStorage.setItem('tluUser', JSON.stringify({
                username,
                role
            }));
            
            // Thêm chuyển hướng cho vai trò 'admin'
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'admin.html'; // Chuyển hướng admin đến trang admin.html
                } else if (role === 'lecturer') {
                    window.location.href = 'teacher.html';
                } else { // role === 'student'
                    window.location.href = 'indexStudent.html';
                }
            }, 1000);
        // *** END: PHẦN ĐƯỢC THAY ĐỔI ***
        
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


// --- INTERNSHIP REGISTRATION PAGE SCRIPT (dangky.html) ---
function initDangKyPage() {
    // ... (nội dung hàm này giữ nguyên, không thay đổi)
    const internshipForm = document.getElementById('internship-form');
    if (!internshipForm) return;

    const emailInput = document.getElementById('email');
    const studentIdInput = document.getElementById('student-id');
    const fullNameInput = document.getElementById('full-name');
    const phoneNumberInput = document.getElementById('phone-number');
    const addressInput = document.getElementById('address');
    const facilityNameInput = document.getElementById('facility-name');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const hasFacilityRadio = document.getElementById('has-facility');
    const noFacilityRadio = document.getElementById('no-facility');
    const internshipPositionInput = document.getElementById('internship-position');
    const sendCodeButton = document.getElementById('send-verification-code');
    const verificationCodeInput = document.getElementById('verification-code');
    const openConfirmModalButton = document.getElementById('open-confirm-modal');
    const cancelConfirmButton = document.getElementById('cancel-confirm');
    const acceptConfirmButton = document.getElementById('accept-confirm');
    const confirmModal = document.getElementById('confirm-modal');

    // Message elements
    const emailVerificationMessage = document.getElementById('email-verification-message');
    const codeVerificationMessage = document.getElementById('code-verification-message');
    const studentIdMessage = document.getElementById('student-id-message');
    const phoneNumberMessage = document.getElementById('phone-number-message');
    const addressMessage = document.getElementById('address-message');
    const startDateMessage = document.getElementById('start-date-message');
    const facilityMessage = document.getElementById('facility-message');
    const internshipPositionMessage = document.getElementById('internship-position-message');

    let generatedCode = null;
    let emailVerifiedByCode = false;

    // Dữ liệu giả lập
    const SIMULATED_EXISTING_STUDENT_IDS = ["2251172557", "1234567890", "0987654321"];
    const STUDENT_ID_TO_NAME = {
        "2251172557": "Hoàng Quang Vinh",
        "1234567890": "Nguyễn Văn A",
        "0987654321": "Trần Thị B"
    };

    fullNameInput.readOnly = true;

    // --- Functions ---
    function handleFacilityStatusChange() {
        const startDateContainer = startDateInput.closest('div.relative').parentNode;
        const endDateContainer = endDateInput.closest('div.relative').parentNode;
        const facilityInputGroup = document.getElementById('facility-input-group');
        const internshipPositionGroup = document.getElementById('internship-position-group');
        const internshipPositionLabel = document.getElementById('internship-position-label');
        const startDateRequiredIndicator = document.getElementById('start-date-required-indicator');

        if (hasFacilityRadio.checked) {
            facilityInputGroup.style.display = '';
            internshipPositionGroup.style.display = '';
            internshipPositionLabel.textContent = 'Vị trí thực tập';
            internshipPositionInput.placeholder = 'Nhập vị trí thực tập tại cơ sở...';
            startDateRequiredIndicator.classList.remove('hidden');
            startDateContainer.style.display = '';
            endDateContainer.style.display = '';
            startDateInput.removeAttribute('disabled');
            startDateInput.classList.remove('bg-gray-100');
        } else {
            facilityInputGroup.style.display = 'none';
            internshipPositionGroup.style.display = '';
            internshipPositionLabel.textContent = 'Vị trí thực tập mong muốn';
            internshipPositionInput.placeholder = 'Nhập vị trí thực tập mong muốn...';
            facilityNameInput.value = '';
            hideFieldMessage(facilityMessage);
            facilityNameInput.classList.remove('border-red-500');
            startDateRequiredIndicator.classList.add('hidden');
            startDateContainer.style.display = 'none';
            endDateContainer.style.display = 'none';
            startDateInput.setAttribute('disabled', 'disabled');
            startDateInput.value = '';
            startDateInput.type = 'text';
            startDateInput.classList.add('bg-gray-100');
            hideFieldMessage(startDateMessage);
            startDateInput.classList.remove('border-red-500');
            endDateInput.value = '';
            endDateInput.type = 'text';
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
            showFieldMessage(studentIdMessage, "Mã sinh viên phải là 10 chữ số.", true, 0);
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

        if (startDateInput.disabled || !startDateInput.value.trim()) {
            return true;
        }

        const selectedDate = new Date(startDateInput.value);
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
        endDateInput.value = calculatedEndDate.toISOString().split('T')[0];
        endDateInput.type = 'date';
        return true;
    }
    
    function validateForm(showMessages = true) {
        let isValid = true;
        let firstInvalidField = null;

        const setInvalid = (field) => {
            if (!firstInvalidField) firstInvalidField = field;
            isValid = false;
        };

        // Validate Email
        hideFieldMessage(emailVerificationMessage);
        emailInput.classList.remove('border-red-500');
        if (!emailInput.value.trim()) {
            if (showMessages) showFieldMessage(emailVerificationMessage, 'Email không được bỏ trống.', true, 0);
            emailInput.classList.add('border-red-500');
            setInvalid(emailInput);
        } else if (!/^\d{10}@e\.tlu\.edu\.vn$/.test(emailInput.value.trim())) {
            if (showMessages) showFieldMessage(emailVerificationMessage, 'Email phải có định dạng 10 số + @e.tlu.edu.vn.', true, 0);
            emailInput.classList.add('border-red-500');
            setInvalid(emailInput);
        }

        // Validate Verification Code
        hideFieldMessage(codeVerificationMessage);
        verificationCodeInput.classList.remove('border-red-500');
        if (!generatedCode) {
            if (showMessages) showFieldMessage(codeVerificationMessage, 'Vui lòng nhấn "Gửi mã" để nhận mã xác nhận.', true, 0);
            setInvalid(verificationCodeInput);
        } else if (!verificationCodeInput.value.trim()) {
            if (showMessages) showFieldMessage(codeVerificationMessage, 'Mã xác nhận không được bỏ trống.', true, 0);
            verificationCodeInput.classList.add('border-red-500');
            setInvalid(verificationCodeInput);
        } else if (verificationCodeInput.value.trim() !== generatedCode) {
            if (showMessages) showFieldMessage(codeVerificationMessage, 'Mã xác nhận không đúng.', true, 0);
            verificationCodeInput.classList.add('border-red-500');
            setInvalid(verificationCodeInput);
            emailVerifiedByCode = false;
        } else {
            emailVerifiedByCode = true;
        }
        
        // Other fields
        if (!validateStudentId()) setInvalid(studentIdInput);
        if (!validatePhoneNumber()) setInvalid(phoneNumberInput);
        if (!validateRequiredField(addressInput, addressMessage, "Địa chỉ không được bỏ trống.")) setInvalid(addressInput);

        // Conditional fields
        if (hasFacilityRadio.checked) {
            if (!startDateInput.value.trim()) {
                if(showMessages) showFieldMessage(startDateMessage, 'Ngày bắt đầu không được bỏ trống.', true, 0);
                startDateInput.classList.add('border-red-500');
                setInvalid(startDateInput);
            } else if (!validateStartDate()) {
                setInvalid(startDateInput);
            }
            if (!validateRequiredField(facilityNameInput, facilityMessage, "Tên cơ sở thực tập không được bỏ trống.")) setInvalid(facilityNameInput);
        }
        
        // Internship position is always required
         if (!validateRequiredField(internshipPositionInput, internshipPositionMessage, document.getElementById('internship-position-label').textContent + ' không được bỏ trống.')) setInvalid(internshipPositionInput);


        if (firstInvalidField && showMessages) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    // --- Event Listeners ---
    sendCodeButton.addEventListener('click', () => {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^\d{10}@e\.tlu\.edu\.vn$/;
        emailVerifiedByCode = false;
        hideFieldMessage(emailVerificationMessage);
        emailInput.classList.remove('border-red-500');

        if (!emailPattern.test(emailValue)) {
            showFieldMessage(emailVerificationMessage, 'Email phải đúng định dạng: msv@e.tlu.edu.vn.', true, 0);
            emailInput.classList.add('border-red-500');
            emailInput.focus();
            return;
        }

        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Mã xác nhận (để test):', generatedCode);
        showFieldMessage(emailVerificationMessage, `Mã xác nhận (giả lập) đã được gửi: ${generatedCode}.`, false, 7000);
        verificationCodeInput.disabled = false;
        verificationCodeInput.focus();
    });

    studentIdInput.addEventListener('blur', validateStudentId);
    phoneNumberInput.addEventListener('blur', validatePhoneNumber);
    addressInput.addEventListener('blur', () => validateRequiredField(addressInput, addressMessage, "Địa chỉ không được bỏ trống."));
    internshipPositionInput.addEventListener('blur', () => validateRequiredField(internshipPositionInput, internshipPositionMessage, document.getElementById('internship-position-label').textContent + ' không được bỏ trống.'));

    noFacilityRadio.addEventListener('change', handleFacilityStatusChange);
    hasFacilityRadio.addEventListener('change', handleFacilityStatusChange);

    startDateInput.addEventListener('focus', () => { if (!startDateInput.disabled) startDateInput.type = 'date'; });
    startDateInput.addEventListener('blur', () => { if (!startDateInput.value && !startDateInput.disabled) startDateInput.type = 'text'; validateStartDate(); });
    startDateInput.addEventListener('change', validateStartDate);
    
    openConfirmModalButton.addEventListener('click', () => {
        if (!validateForm(true)) {
             showToast('Vui lòng kiểm tra lại các thông tin đã nhập.', 'error');
             return;
        }
        const confirmInfo = document.getElementById('confirm-info');
        const facilityStatus = hasFacilityRadio.checked ? 'yes' : 'no';
        confirmInfo.innerHTML = `
            <div><b>Email:</b> ${emailInput.value.trim()}</div>
            <div><b>Mã sinh viên:</b> ${studentIdInput.value.trim()}</div>
            <div><b>Họ và tên:</b> ${fullNameInput.value.trim()}</div>
            <div><b>Số điện thoại:</b> ${phoneNumberInput.value.trim()}</div>
            <div><b>Địa chỉ:</b> ${addressInput.value.trim()}</div>
            <div><b>Tình trạng cơ sở:</b> ${facilityStatus === 'yes' ? 'Đã có' : 'Chưa có'}</div>
            ${facilityStatus === 'yes' ? `<div><b>Tên cơ sở:</b> ${facilityNameInput.value.trim()}</div>` : ''}
            <div><b>Ngày bắt đầu:</b> ${startDateInput.value || '-'}</div>
            <div><b>Ngày kết thúc:</b> ${endDateInput.value || '-'}</div>
             <div><b>Vị trí:</b> ${internshipPositionInput.value.trim()}</div>
        `;
        confirmModal.classList.remove('hidden');
    });
    
    cancelConfirmButton.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
    });

    acceptConfirmButton.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        const facilityStatus = hasFacilityRadio.checked ? 'yes' : 'no';
        const internshipData = {
            email: emailInput.value.trim(),
            studentId: studentIdInput.value.trim(),
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            address: addressInput.value.trim(),
            facilityStatus: facilityStatus,
            facilityName: facilityStatus === 'yes' ? facilityNameInput.value.trim() : null,
            startDate: facilityStatus === 'yes' ? startDateInput.value : null,
            endDate: facilityStatus === 'yes' ? endDateInput.value : null,
            internshipPosition: internshipPositionInput.value.trim(),
            registrationTimestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        };

        try {
            let history = JSON.parse(localStorage.getItem('thuyloiInternshipRegistrations')) || [];
            history.unshift(internshipData);
            localStorage.setItem('thuyloiInternshipRegistrations', JSON.stringify(history));

            showToast('Đăng ký thực tập thành công!', 'success');
            internshipForm.reset();
            verificationCodeInput.disabled = true;
            generatedCode = null;
            emailVerifiedByCode = false;
            handleFacilityStatusChange(); // Reset form state
            document.querySelectorAll('.form-message').forEach(el => hideFieldMessage(el));
            document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
            emailInput.focus();
        } catch (error) {
            console.error("Lỗi khi lưu vào localStorage: ", error);
            showToast('Đã xảy ra lỗi khi lưu đăng ký.', 'error');
        }
    });

    // Initial state setup
    handleFacilityStatusChange();
}


// --- REGISTRATION HISTORY PAGE SCRIPT (lichsu.html) ---
function initLichSuPage() {
    // ... (nội dung hàm này giữ nguyên, không thay đổi)
    const loading = document.getElementById('history-loading');
    const tableContainer = document.getElementById('history-table-container');
    const empty = document.getElementById('history-empty');

    if (!loading) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('thuyloiInternshipRegistrations')) || [];
    } catch (e) {
        console.error("Error parsing history from localStorage:", e);
        history = [];
    }

    // Filter out expired entries (for demo)
    const now = new Date();
    const originalLength = history.length;
    history = history.filter(d => !d.expiresAt || new Date(d.expiresAt) > now);
    if (history.length < originalLength) {
        localStorage.setItem('thuyloiInternshipRegistrations', JSON.stringify(history));
    }

    loading.style.display = 'none';

    if (!history.length) {
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