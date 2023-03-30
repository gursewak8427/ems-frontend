import cookie from 'js-cookie'
import { requestForToken } from '../firebase'

// cookies management
// Set in Cookie
export const setCookie = (key, value) => {
    if (window !== 'undefiend') {
        cookie.set(key, value, {
            // 1 Day
            expires: 1
        })
    }
}

// Remove from Cookie
export const removeCookie = key => {
    if (window !== 'undefiend') {
        cookie.remove(key, {
            expires: 1
        })
    }
}

// Get from cookie like token
export const getCookie = key => {
    if (window !== 'undefined') {
        return cookie.get(key)
    }
}


//@ redux management
//-- user

// for user-client
export const authenticate = async (response, role, next) => {
    setCookie(`${role}_token`, response.data.details.token)
    setCookie(`role`, response?.data?.details?.user?.user_role_id?.role || "ADMIN")
    next()
}

export const getToken = (role) => {
    if (window !== 'undefiend') {
        const cookieChecked = getCookie(`${role}_token`)
        if (cookieChecked) {
            return cookieChecked
        } else {
            return false
        }
    }
}


export const logoutHelper = (role) => {
    removeCookie(`${role}_token`)
    window.location.href = "/"
}

// Set in local storrage
export const setLocalStorage = (key, value) => {
    if (window !== 'undefiend') {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
// Remove from local storrage
export const removeLocalStorage = key => {
    if (window !== 'undefiend') {
        localStorage.removeItem(key)
    }
}

// get from local storage
export const getLocalStorage = (key) => {
    if (window !== 'undefiend') {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key))
        } else {
            return false
        }
    }
}


//  update user data in localstorate
export const updateUser = (response, next) => {
    if (window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth))
    }
    next()
}

//  update user data in localstorate for client-user
export const updateUserClient = (response, next) => {
    if (window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user-client'))
        auth = response.data
        localStorage.setItem('user-client', JSON.stringify(auth))
    }
    next()
}





// // Get user info from localstorage || isAuth
// export const isAuth = () => {
//     if (window !== 'undefiend') {
//         const cookieChecked = getCookie('token')
//         if (cookieChecked) {
//             if (localStorage.getItem('user')) {
//                 return JSON.parse(localStorage.getItem('user'))
//             } else {
//                 return false
//             }
//         } else {
//             return false
//         }
//     }
// }

// // Get user info from localstorage || isAuth for User-client
// export const isAuthUser = () => {
//     if (window !== 'undefiend') {
//         const cookieChecked = getCookie('token-client')
//         if (cookieChecked) {
//             if (localStorage.getItem('user-client')) {
//                 return JSON.parse(localStorage.getItem('user-client'))
//             } else {
//                 return false
//             }
//         } else {
//             return false
//         }
//     }
// }    