import React from 'react';
import { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { FaLockOpen } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const Colorplate = (props) => {
    const { color,lockStatus ,index,changeLockStatus} = props

    const handleCopy = (e) => {
        toast("Copied to clipboard!")
        navigator.clipboard.writeText(e.target.innerText);
        console.log(e.target.innerText)

    }

    const changeStatus=()=>{
        changeLockStatus(index)
    }

    return <div className='color-plate' style={{ backgroundColor: `${color}` }} >
       
        <div onClick={changeStatus}>{lockStatus? <FaLock/>: <FaLockOpen />}</div>
        
        <ToastContainer className='Toastify__toast-container'
            position="top-center"
            autoClose={1000}
            hideProgressBar={true}
            newestOnTop={false}
            theme="light"
        

        />
        <p className='para' onClick={handleCopy}>{color}</p></div>

}


const generateRandomColor = () => {
    let colorCode = '#';
    for (let i = 0; i < 3; i++) {
        let colorInt = parseInt(Math.random() * 256)
        colorCode = colorCode + colorInt.toString(16).padStart(2, '0')
    }
    return colorCode
}

const paletteSize = 5;

const getSavedPalette = () => {
    const saved = JSON.parse(localStorage.getItem('savedPalettes'))
    if (saved != null) {
        return saved
    }
    return []



}



class Colorpalette extends Component {
    state = {
        colors: Array.from({ length: paletteSize }, generateRandomColor), lockStatus: Array.from({ length: paletteSize }, () => { return false }), saved: getSavedPalette()
    }

    onDeletePalette = (val) => {
        const {saved}=this.state 
        const filtered=saved.filter((item,index)=>index!==val)
        this.setState({ saved:filtered })
        localStorage.setItem('savedPalettes', JSON.stringify(filtered))



    }


    generateNewColor = () => {
        const newColors = []
        const{lockStatus,colors}=this.state
        for (let i = 0; i < paletteSize; i++) {
            if(lockStatus[i]){
                newColors[i] = colors[i]
            }else{
                newColors[i] = generateRandomColor()
            }
        }
        this.setState({ colors: newColors })

    }

    savePalette = () => {
        const { colors, saved } = this.state
        saved.push(colors)
        this.setState({ saved })
        localStorage.setItem('savedPalettes', JSON.stringify(saved))
    }

    renderSavedPalettes = () => {
        const { saved } = this.state
        if (saved.length === 0) {
            return <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',fontWeight:'600'}}><p>No Saved Palettes</p></div>
        }
        return <ul className='List'>{saved.map((eachItem, index) =>{
            const onDelete=()=>{
                this.onDeletePalette(index)
            }

            return(
                <li key={index} className='listItem' >
                    <div className='listContainer'  >
                        {eachItem.map((color, index) =>
                            <span className='color' style={{ backgroundColor: `${color}`,borderRadius:'10px'}} key={index}>{color}</span>)}
                    </div>
                <button className='btn' onClick={onDelete} type="button">Delete Palette</button></li>)



        })}</ul>
    }


    changeLockStatus=(index)=>{
        const{lockStatus}=this.state 
        lockStatus[index]=!lockStatus[index]
        this.setState({lockStatus})
    }

    render() {
        const { colors ,lockStatus} = this.state

        return <div>
            <div className='header'>Color Palette Generator</div><hr />
            <div className='body'>
                {colors.map((color, index) => <Colorplate key={index} color={color} lockStatus={lockStatus[index]} index={index} changeLockStatus={this.changeLockStatus}/>)}

            </div>
            <div className='btn-container'><button type="button" className='btn' onClick={this.generateNewColor}>Generate color</button>
                <button type="button" className='btn' onClick={this.savePalette}>Save Palette</button></div>
            <div>
                <h3 className='heading'>Saved Paletes</h3>
                {this.renderSavedPalettes()}
            </div>

        </div>
    }
}

export default Colorpalette
