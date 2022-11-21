import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faHouse, faBoxesStacked, faPeopleArrows, faUsers, faRightFromBracket, faClose, faArrowRight}  from "@fortawesome/free-solid-svg-icons";

library.add(faHouse);
library.add(faBoxesStacked)
library.add(faPeopleArrows)
library.add(faUsers)
library.add(faRightFromBracket)
library.add(faClose)
library.add(faArrowRight)

function selectCurrentPage(){
    var location = window.location.pathname.split("/")[1]
    if(location === "admin") window.document.getElementById("sidebar").children[5].classList.add('selected');
    if(location === "inventory") window.document.getElementById("sidebar").children[6].classList.add('selected');
    if(location === "providers") window.document.getElementById("sidebar").children[7].classList.add('selected');
    if(location === "employee") window.document.getElementById("sidebar").children[8].classList.add('selected');
}

function shrinkNav(){
    var list = window.document.querySelectorAll("span")
    list.forEach(e => {
        e.style.display="none"
    })

    window.document.getElementById("sidebar").style.width = "auto";
    window.document.getElementById("main").style.marginLeft = "8%"
    window.document.getElementById("close-btn").style.display = "none";
    window.document.getElementById("open-btn").style.display = "unset";
}

function openNav(){
    var list = window.document.querySelectorAll("span")
    list.forEach(e => {
        e.style.display = "unset"
    })
    
    window.document.getElementById("sidebar").style.width = "18%";
    window.document.getElementById("main").style.marginLeft = "20%";

    window.document.getElementById("close-btn").style.display = "unset";
    window.document.getElementById("open-btn").style.display = "none";
}

class Menu extends React.Component {
    componentDidMount(){
        selectCurrentPage()
    }
    
    render(){
        return (
            <div className="sidebarnav" id="sidebar">
                <button onClick={shrinkNav} id="close-btn"><FontAwesomeIcon id="baricons" icon="close"/></button>
                <button onClick={openNav} id="open-btn"><FontAwesomeIcon id="baricons" icon="arrow-right"/></button>
                <h1 id="store-name"><span>PAPELERIA PINCELIN</span></h1>
                <p id="indication"><span>Navegacion</span></p>
                <span><hr id="sep"></hr></span>
                <Link to="/admin"><FontAwesomeIcon id="baricons" icon="house"/> <span >&nbsp;Dashboard</span></Link>
                <Link to="/inventory"><FontAwesomeIcon id="baricons" icon="boxes"/> <span >&nbsp;Inventario</span></Link>
                <Link to="/providers"><FontAwesomeIcon id="baricons" icon="people-arrows"/> <span >&nbsp;Proveedores</span></Link>
                <Link to="/employee"><FontAwesomeIcon id="baricons" icon="users"/><span >&nbsp;Empleados</span></Link>
                <Link id="changeview"to="/pos"><span >CAMBIAR A PUNTO DE VENTA</span></Link>
                <Link id="closesession" to="/"><FontAwesomeIcon id="baricons" icon="right-from-bracket"/><span >&nbsp;Cerrar sesion</span></Link>
            </div>
        )
    }
}

export default (Menu)