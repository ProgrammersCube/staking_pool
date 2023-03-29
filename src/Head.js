import React from 'react'

import 'reactstrap'
import Logo from '../src/assets/logo.png'
import './Head.css'
import {
    GlobalOutlined,
    WalletOutlined
  } from '@ant-design/icons';


export default function Head(){
    return  <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
                        <img src={Logo} />
                        <div className="collapse navbar-collapse justify-content-end">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active d-flex">
                                    <span className='nav-link'>#imgae_here</span>
                                    <a className="nav-link" href="#">Price</a>
                                </li>
                                <li className="nav-item">
                                    <span className='nav-link'></span>
                                </li>
                                <li className="nav-item d-flex">
                                    <span className="nav-link Pr-0"><WalletOutlined /></span>
                                    <a className="nav-link" href="#">Dropdown</a>
                                </li>
                                {/* <li className="nav-item">
                                    <a className="nav-link" href="#">Wallet Address</a>
                                </li> */}
                            </ul>
                        </div>
                    </nav>
                
}