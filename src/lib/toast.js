import Swal from 'sweetalert2';

// Create a mixin for Toast
const ToastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export const showToast = (icon, title) => {
    // Update position based on document direction
    const isRtl = document.documentElement.dir === 'rtl';

    ToastMixin.fire({
        icon: icon,
        title: title,
        position: isRtl ? 'top-start' : 'top-end'
    });
};

export const showAlert = (title, text, icon = 'info') => {
    return Swal.fire({
        title,
        text,
        icon,
        customClass: {
            popup: 'dark:bg-gray-800 dark:text-white',
            confirmButton: 'bg-primary-600'
        },
        buttonsStyling: true
    });
};
