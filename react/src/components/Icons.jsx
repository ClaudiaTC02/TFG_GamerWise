import logo from "../assets/logo_gamerwise.png";
import user from "../assets/gamer.png"
import email from "../assets/email.png"
import lock from "../assets/lock.png"
import nintendo from "../assets/nintendo.png"
import playstation from "../assets/playstation-logotype.png"
import xbox from "../assets/xbox-logo.png"
import pc from "../assets/computer.png"

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

export function steamIcon(){
    return <i className="bi bi-steam"></i>
}

export function nintendoIcon(){
    return nintendo
}

export function playstationIcon(){
    return playstation
}

export function xboxIcon(){
    return xbox
}

export function pcIcon(){
    return pc
}