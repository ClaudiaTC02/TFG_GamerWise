import logo from "../assets/logo_gamerwise.png";
import user from "../assets/gamer.png"
import email from "../assets/email.png"
import lock from "../assets/lock.png"


export function logoIcon() {
    return logo
}

export function userIcon () {
    return user
}

export function emailIcon() {
    return email
}

export function passwordIcon() {
    return lock
}

export function eyeIcon() {
    return <i className="bi bi-eye-fill"></i>
}

export function eyeSlashIcon(){
    return <i className="bi bi-eye-slash-fill"></i>
}