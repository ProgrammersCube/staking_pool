import {useState} from 'react'

export default function Funcom(p){
    const [data,setData] = useState("ab")
    const red=()=>{
        setData("ba")
        console.log("1")
        alert("This is click by Functional Component")
        
    }
    return <div>
            <h2 onClick={red}>This is functional Component</h2>
            <p>{data}</p>
        </div>
        
}

{/* <div className='col-6 m-0 p-0 Bt-or d-flex justify-content-center align-self-center D-tr'>
                    <div className='Bgw'>
                        <img src={Sideimg} />
                    </div>
                    
                </div> */}