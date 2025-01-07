import { toast } from 'react-toastify'; // Correct import

export const handleSuccess = (msg) => {
    toast.success(msg, {
    position: 'top - right'
   })

} 

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top - right'
    })
}