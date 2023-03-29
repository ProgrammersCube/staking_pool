import React from 'react'
import { useState } from "react";
import { useEffect,useRef } from "react";
// import {useState} from 'react'
import './App.css'
import './Firstask.css'
import 'reactstrap'
import Web3 from 'web3'
import cc from '@walletconnect/web3-provider'
import { useWallet } from "use-wallet";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Sideimg1 from '../src/assets/final1.jpeg'
import Sideimg2 from '../src/assets/final2.jpeg'
import Sideimg3 from '../src/assets/final3.jpeg'
import Autogif from '../src/assets/autoloading.gif'

import 'reactstrap'
import Logo from '../src/assets/logo.png'
import Binancechain from '../src/assets/binancechain.png'
import Metamask from '../src/assets/MetaMask_Fox.png'
import Walletconnect from '../src/assets/walletconnect.png'
import './Head.css'
import toast, { Toaster } from 'react-hot-toast';
import { Switch } from 'antd';
import { Radio, Space, Tabs } from 'antd';
import moment from 'moment'
import LoadingOverlay from '@ronchalant/react-loading-overlay';


import axios from 'axios';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DownOutlined,
    UpOutlined,
    ExportOutlined,
    CalculatorOutlined,
    GlobalOutlined,
    WalletOutlined
  } from '@ant-design/icons';
  import useOutsideClick from './custom';
   import server from "./api/server"
  import { Col, InputNumber, Row, Slider ,Modal as TermModal} from 'antd';
  import 'antd/dist/antd.css';


  const NftAbi = require("./abis/abi.json");
  const TOKEN = require("./abis/tokenAbi.json")
  

  const stakingAddress = "0x6D9880ec10BA96bd6ca1193862E8552C7F951Fe4";
  const tokenAddress = "0xa6D55d946bCd1c7DA099C9fBbB0696f827c467db";


  const stakingAbi = NftAbi.abi;
  const tokenAbi = TOKEN.abi; 


  export const useOnOutsideClick = handleOutsideClick => {
    const innerBorderRef = useRef();
  
    const onClick = event => {
      if (
        innerBorderRef.current &&
        !innerBorderRef.current.contains(event.target)
      ) {
        handleOutsideClick();
      }
    };
  
    useMountEffect(() => {
      document.addEventListener("click", onClick, true);
      return () => {
        document.removeEventListener("click", onClick, true);
      };
    });
  
    return { innerBorderRef };
  };



  export const useOnOutsideClick2 = handleOutsideClick => {
    const innerBorderRef2 = useRef();
  
    const onClick = event => {
      if (
        innerBorderRef2.current &&
        !innerBorderRef2.current.contains(event.target)
      ) {
        handleOutsideClick();
      }
    };
  
    useMountEffect(() => {
      document.addEventListener("click", onClick, true);
      return () => {
        document.removeEventListener("click", onClick, true);
      };
    });
  
    return { innerBorderRef2 };
  };



  
  
  const useMountEffect = fun => useEffect(fun, []);

  
  

export default function Firstask({currentMode, changeContactAppMode}){

    const [tabPosition, setTabPosition] = useState('withdraw');

    const changeTabPosition = (e) => {
      setTabPosition(e.target.value);
    };


    //toogle

    const [updateUI, setUpdateUI] = useState(false);

    const [burnFee, setBurnFee] = useState(0);

    const [isUnstake, setIsUnstake] = useState(false);

    const [unstake, setUnstake] = useState(false);

    const [loading, setLoading] = useState(false);

    const [stakeTime, setStakeTime] = useState('');
    const [lockTime, setLockTime] = useState('');



    const [reward, setReward] = useState(0);
    const [locked_reward, setLockedReward] = useState(0);

    const [updateStake, setUpdateStake] = useState(false);

    const [isWithdraw, setIsWithdraw] = useState(false);

    // const [open, setOpen] = useState(false);
    const { innerBorderRef } = useOnOutsideClick(() => setTerms(false));

    const { innerBorderRef2 } = useOnOutsideClick2(() => setClickedOutside(false));





    

    const [clickedOutside, setClickedOutside] = useState(false);
    const [term, setTerms] = useState(false);

    const myRef = useRef();

    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target)) {
            setClickedOutside(true);
        }
    };

    const handleClickInside = () => setClickedOutside(!clickedOutside);
    const handleTerms = () => setTerms(!term);
    const impactRef = useRef();

    useOutsideClick(impactRef, () => setTerms(false)); //Change my dropdown state to close when clicked outside


    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // });

    var web3 = new Web3();
    const wallet = useWallet();
    const [amount, setAmount] = useState(0);
    const [rewardInput, setRewardInput] = useState(0);
    const [withdrawFee, setWithdrawFee] = useState(0);

    const [balance, setBalance] = useState(0);
    const [enabled, setEnable] = useState(false);
    const [reload, setReload] = useState(false);
    const [show, setShow] = useState(false);
    const [showDisconnect, setShowDisconnect] = useState(false);

    const [wait, setWait] = useState(false);
    const [stake_type, setType] = useState(null);
    const [step, setStep] = useState(1);    // change step here
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleCloseD = () => setShowDisconnect(false);
    const handleShowD = () => setShowDisconnect(true);


    const onChange = (newValue) => {
        console.log("newValue: ",newValue)
        setAmount(newValue);
    };

    const onBack=()=>{
        setType(null)
        if(isWithdraw){
            setStep(4);
        }
        if(!isWithdraw){
            setStep(2);
        }
        
        
              
    }

    //this is for backgroung side image

    // const Big=()=>{
    //     backgroundImage: "url(../src/assets/stake_pool.jpeg)"
    // }

    // let [val,setData] = useState(0);
    const tw=()=>{
        // setData(25)
    }

     useEffect(() => {
        getTimeByWallet()
        getStakedTokens()
        getReward() 
        getWithdrawFee()


        onload();       
    }, [wallet.status,unstake,enabled,reload,updateUI,isWithdraw,updateStake])
   
    
    const getWithdrawFee= async ()=>{
       
        const {data} = await server.get(
          "/getWithdraw",
         
          { 
            headers: {
              "Content-Type": "application/json",
         },
          } 
        )
        if(data)
        {
          if(data?.error)
          {
            // toast.error(data?.error)
          }
          else
          {
    
            let nft = data?.data[0]?.fee
             console.log('nft',nft)
            //  const ethToken = web3.utils.fromWei(nft, "ether");
    
             const weiAmount = nft
    
            setWithdrawFee(weiAmount)
       
          }
        }
    
      
    }
    
    
    
    const onload= async ()=>{
       
        if (wallet.status=="connected") {
           setLoading(true)
            console.log(tokenAbi);
            console.log(tokenAddress);
            web3.setProvider(wallet.ethereum);
            const token = new web3.eth.Contract(tokenAbi, tokenAddress);
            const stake = new web3.eth.Contract(stakingAbi, stakingAddress);

            const burnFee = await stake.methods.getBurnFee().call();
            setBurnFee(burnFee)
           
            await token.methods
            .balanceOf(wallet.account).call().then(async(r)=>{
                console.log(r)
                setBalance(web3.utils.fromWei(r, "Gwei"));
                const isEnabled = await stake.methods
                .isEnabled().call({from:wallet.account});
                console.log("isenab: ", isEnabled)
                setEnable(isEnabled);
                 
                if(!isEnabled ) {
                    setLoading(false)

                    setStep(1);

                }

               else if(isEnabled && isUnstake) {
                setLoading(false)

                    // alert('cc')
                    setStep(1);
                }

               else if(isEnabled  && isWithdraw ){
                setLoading(false)

                    setStep(4);
                }
                
               else if(isEnabled  && !isWithdraw ){
                setLoading(false)

                                    //    alert('cc')

                    setStep(2);
                }
               


               else if(!isEnabled && !isWithdraw ){
                setLoading(false)

                    setStep(1)
                }
                else{
                    setLoading(false)

                }
               
                
            });
       }
    }

    





    const getReward = async ()=>{
        if (wallet.status=="connected") {

            try {
                      
                let data ={
                 wallet_address: wallet.account,
                }
                 server
                   .post("getRewardByWallet", data, {
                     
                   }) 
                   .then((response) => {
                     console.log('wallet rewards',response)



                   const isStaked =      response.data?.isStaking
                   const isUnstake =      response.data?.isUnstake
                   const enable =      response.data?.enable

                   setIsUnstake(enable)

                   if(isStaked){
                       setIsWithdraw(true)
                    // setStep(4)

                   }   
                   else{
                    setIsWithdraw(false)
                    // setStep(2)
                    // setStep(4)

                   }
                   
                     setReward(response?.data?.reward)
                     // alert("Month updated successfully.");
                     // console.log("response: ", response.data.ipfs_url);
                    
                     // setDisabled(false)
                   });
             
           
               } catch (error) {
                 console.log('wallet added failed',error)

                 // toast.error(error);
               }

            
        }
    
    }

    

    const getStakedTokens = async ()=>{
        if (wallet.status=="connected") {

            try {
                      
                let data ={
                 wallet_address: wallet.account,
                }
                 server
                   .post("getStakedTokenByWallet", data, {
                     
                   }) 
                   .then((response) => {
                     console.log('wallet ',response)



                   const flexible =      response.data?.flexible
                   const locked =      response.data?.locked
                   setLockedReward(locked)
                   
                    //  setReward(response?.data?.reward)
                     // alert("Month updated successfully.");
                     // console.log("response: ", response.data.ipfs_url);
                    
                     // setDisabled(false)
                   });
             
           
               } catch (error) {
                 console.log('wallet added failed',error)

                 // toast.error(error);
               }

            
        }
    
    }

    const getTimeByWallet = async ()=>{
        if (wallet.status=="connected") {

            try {
                      
                let data ={
                 wallet_address: wallet.account,
                }
                 server
                   .post("getTimeByWallet", data, {
                     
                   }) 
                   .then((response) => {
                     console.log('wallet timee ',response)



                   const flexible =      response.data?.flexible_time
                   const locked =      response.data?.lock_time

                   setStakeTime(flexible)
                   setLockTime(locked)
                //    setLockedReward(locked)
                   
                    //  setReward(response?.data?.reward)
                     // alert("Month updated successfully.");
                     // console.log("response: ", response.data.ipfs_url);
                    
                     // setDisabled(false)
                   });
             
           
               } catch (error) {
                 console.log('wallet added failed',error)

                 // toast.error(error);
               }

            
        }
    
    }



    const connect = async() => {
        await wallet.connect();
        setShow(false)
    };


    const disconnect = async() => {
        await wallet.reset();
        setShowDisconnect(false)
        setStep(1)
    };


    const setStepThree=()=>{
        setType(0)
        setStep(3);
    }

    const setFlexible=()=>{
        setStep(3);
        setType(1);
    }
  

    const enable = async() => {
        
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})

            return;
        }
        setWait(true);
        web3.setProvider(wallet.ethereum);
        const tokenFee = await getTokenFee();
        const bnbFee = await getBnbFee();
        console.log("tokenFee", tokenFee);
        console.log("bnbFee", bnbFee);

        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log(r);
                if(r<tokenFee){
                token.methods
               .approve(stakingAddress, tokenFee).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                setWait(false)
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                  console.log("transaction sent: ",hash);
                }).then(r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                    staking.methods
                    .enable().send({
                        from: wallet.account, value:bnbFee
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         console.log("transaction confirmed");

                         try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:0
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
                        //  setEnable(true);
                        setType(2)
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>{console.log(e)
                    setWait(false)
                })
            }else{
                    staking.methods
                    .enable().send({
                        from: wallet.account, value:bnbFee
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                        setWait(false);
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         setType(2)
                         console.log("transaction confirmed");
                         try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:0
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
                         
                     }).catch(e=>{console.log(e)
                     setWait(false)})
            }
        });
    };



    const unStake = async() => {
        console.log('time',stakeTime)
       console.log('time',moment(stakeTime).isSameOrBefore(new Date()))
        
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})

            return;
        }


        if(!stakeTime){
            toast.error(`Please Stake first` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }
        if(moment(stakeTime).isSameOrBefore(new Date())==false){
            toast.error(`you can unstake on ${stakeTime}` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }

        
   //     setWait(true);
        web3.setProvider(wallet.ethereum);
        const tokenFee = await getTokenFee();
        const bnbFee = await getBnbFee();
        console.log("tokenFee", tokenFee);
        console.log("bnbFee", bnbFee);

        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log('r',r);
                if(r>tokenFee){
                token.methods
               .approve(stakingAddress, tokenFee).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                setWait(false)
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                  console.log("transaction sent: ",hash);
                }).then(r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                    staking.methods
                    .unstakeFlexible().send({
                        from: wallet.account,
                        value: "21000000000000000"
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         console.log("transaction confirmed");



                         try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:2
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
     
                      //   setEnable(true);
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>{console.log(e)
                    setWait(false)
                })
            }else{
                    staking.methods
                    .unstakeFlexible().send({
                        from: wallet.account,
                        value: "21000000000000000"
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                        setWait(false);
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         
                        try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:2
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
                         console.log("transaction confirmed");
                         
                     }).catch(e=>{console.log(e)
                     setWait(false)})
            }
        });
    };



    const unStakeLocked = async() => {
      
        
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})

            return;
        }


        if(!lockTime){
            toast.error(`Please Stake first` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }
        if(moment(lockTime).isSameOrBefore(new Date())==false){
            toast.error(`you can unstake on ${lockTime}` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }

        
   //     setWait(true);
        web3.setProvider(wallet.ethereum);
        const tokenFee = await getTokenFee();
        const bnbFee = await getBnbFee();
        console.log("tokenFee", tokenFee);
        console.log("bnbFee", bnbFee);

        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log('r',r);
                if(r>tokenFee){
                token.methods
               .approve(stakingAddress, tokenFee).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                setWait(false)
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                  console.log("transaction sent: ",hash);
                }).then(r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                    staking.methods
                    .unstakeLocked().send({
                        from: wallet.account,
                        value: "21000000000000000"
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         console.log("transaction confirmed");



                         try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:2
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
     
                      //   setEnable(true);
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>{console.log(e)
                    setWait(false)
                })
            }else{
                    staking.methods
                    .unstakeLocked().send({
                        from: wallet.account,
                        value: "21000000000000000"
                    }).on("transactionHash", async function (hash) {
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                        setWait(false);
                       console.log("transaction sent: ",hash);
                     }).then(r=>{
                         
                        try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             enable:2
                            }
                             server
                               .post("unstake", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             // setUpdateUI(false)
     
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
                         console.log("transaction confirmed");
                         
                     }).catch(e=>{console.log(e)
                     setWait(false)})
            }
        });
    };



    const stake = () =>{
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})
            return;
        }
        if(amount<100){
            toast.error('Amount should be greater than 100MMM',{style: {
                background:"#fed8b1"
              }})

            return;
        }

        web3.setProvider(wallet.ethereum);
        const weiAmount = web3.utils.toWei(amount.toString(), "Gwei")
        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log(r);
                if(r<weiAmount){
                token.methods
               .approve(stakingAddress, weiAmount).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                }).then(r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                    staking.methods
                    .stake(weiAmount, stake_type).send({
                        from: wallet.account
                    }).on("transactionHash", async function (hash) {
                       console.log("transaction sent: ",hash);
                       //call api here send wallet.account
                       try {
                      
                       let data ={
                        wallet_address: wallet.account,
                        staked_type : stake_type
                       }
                        server
                          .post("createWallet", data, {
                            
                          }) 
                          .then((response) => {
                            console.log('wallet added')
                            // alert("Month updated successfully.");
                            // console.log("response: ", response.data.ipfs_url);
                           
                            // setDisabled(false)
                          });
                    
                  
                      } catch (error) {
                        console.log('wallet added failed',error)

                        // toast.error(error);
                      }



                             
                       
                     }).then(r=>{
                        setUpdateStake(!updateStake)
                        alert('cc')

                         console.log("transaction confirmed");
                         setReload(true)
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>console.log(e))
            }
            else{
                token.methods
               .approve(stakingAddress, weiAmount).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                }).then(r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                    staking.methods
                    .stake(weiAmount, stake_type).send({
                        from: wallet.account
                    }).on("transactionHash", async function (hash) {
                       console.log("transaction sent: ",hash);
                       //call api here send wallet.account
                       try {
                      
                       let data ={
                        wallet_address: wallet.account,
                        staked_type : stake_type
                       }
                        server
                          .post("createWallet", data, {
                            
                          }) 
                          .then((response) => {
                            console.log('wallet added')
                            // alert("Month updated successfully.");
                            // console.log("response: ", response.data.ipfs_url);
                           
                            // setDisabled(false)
                          });
                    
                  
                      } catch (error) {
                        console.log('wallet added failed',error)

                        // toast.error(error);
                      }



                             
                       
                     }).then(r=>{
                        setUpdateStake(!updateStake)
                        alert('cc')

                         console.log("transaction confirmed");
                         setReload(true)
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>console.log(e))
            }
            // else{
            //         staking.methods
            //         .stake(weiAmount,stake_type).send({
            //             from: wallet.account
            //         }).on("transactionHash", async function (hash) {
            //             //call api here send wallet.account

            //             try {
                      
            //                 let data ={
            //                  wallet_address: wallet.account,
            //                  staked_type : stake_type

            //                 }
            //                  server
            //                    .post("createWallet", data, {
                                 
            //                    }) 
            //                    .then((response) => {
            //                      console.log('wallet added')
            //                      // alert("Month updated successfully.");
            //                      // console.log("response: ", response.data.ipfs_url);
                                
            //                      // setDisabled(false)
            //                    });
                         
                       
            //                } catch (error) {
            //                  console.log('wallet added failed',error)
     
            //                  // toast.error(error);
            //                }
     
            //             toast.success('Transaction sumbited, wait for confirmation',{style: {
            //                 background:"#fed8b1"
            //               }})
            //          }).then(r=>{
            //              alert('cc')
            //             setUpdateStake(!updateStake)

            //              console.log("transaction confirmed");
                         
            //          }).catch(e=>console.log(e))
            // }
        });
    }

   
    

    // const unStake = () =>{
    //     if(!wallet.isConnected()){
    //         toast.error('Please connect your BSC wallt',{style: {
    //             background:"#fed8b1"
    //           }})
    //         return;
    //     }
    //     console.log(wallet.chainId)
    //     if(wallet.chainId!=56){
    //         toast.error('Please switch to BSC network',{style: {
    //             background:"#fed8b1"
    //           }})
    //         return;
    //     }
    //     // if(amount<100){
    //     //     toast.error('Amount should be greater than 100MMM',{style: {
    //     //         background:"#fed8b1"
    //     //       }})

    //     //     return;
    //     // }

    //     web3.setProvider(wallet.ethereum);
    //     const weiAmount = web3.utils.toWei(amount.toString(), "ether")
    //     const token = new web3.eth.Contract(tokenAbi, tokenAddress);
    //     const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
    //            token.methods
    //            .allowance(wallet?.account, stakingAddress).call().then((r)=>{
    //             console.log(r);
    //             if(r<weiAmount){
    //             token.methods
    //            .approve(stakingAddress, weiAmount).send({
    //                from: wallet.account
    //            }).on("transactionHash", async function (hash) {
    //             toast.success('Transaction sumbited, wait for confirmation',{style: {
    //                 background:"#fed8b1"
    //               }})
    //             }).then(r=>{
    //                 console.log("transaction confirmed");
    //                 ///////////////////////////////////

    //                 token.methods
    //                 .unstakeLocked().call().then((r)=>{

    //                 }
    //                 // staking.methods
    //                 // .unstakeLocked().send({
    //                 //     // from: wallet.account
    //                 // }).on("transactionHash", async function (hash) {
    //                 //    console.log("transaction sent: ",hash);
    //                 //    //call api here send wallet.account

    //                 // //    try {
                      
    //                 // //    let data ={
    //                 // //     wallet_address: wallet.account,
    //                 // //     staked_type : stake_type
    //                 // //    }
    //                 // //     server
    //                 // //       .post("createWallet", data, {
                            
    //                 // //       }) 
    //                 // //       .then((response) => {
    //                 // //         console.log('wallet added')
    //                 // //         // alert("Month updated successfully.");
    //                 // //         // console.log("response: ", response.data.ipfs_url);
                           
    //                 // //         // setDisabled(false)
    //                 // //       });
                    
                  
    //                 // //   } catch (error) {
    //                 // //     console.log('wallet added failed',error)

    //                 // //     // toast.error(error);
    //                 // //   }



                             
                       
    //                 //  }).then(r=>{
    //                 //      console.log("transaction confirmed");
    //                 //      setReload(true)
    //                 //  })
    //                 ) 
    //                  .catch(e=>console.log(e))


    //                 ///////////////////////

    //             }).catch(e=>console.log(e))
    //         }else{
    //             staking.methods
    //             .unstakeLocked().send({from:wallet.account, value:"1000000000"}).then((r)=>{

    //             }
    //                     //call api here send wallet.account

    //                     // try {
                      
    //                     //     let data ={
    //                     //      wallet_address: wallet.account,
    //                     //      staked_type : stake_type

    //                     //     }
    //                     //      server
    //                     //        .post("createWallet", data, {
                                 
    //                     //        }) 
    //                     //        .then((response) => {
    //                     //          console.log('wallet added')
    //                     //          // alert("Month updated successfully.");
    //                     //          // console.log("response: ", response.data.ipfs_url);
                                
    //                     //          // setDisabled(false)
    //                     //        });
                         
                       
    //                     //    } catch (error) {
    //                     //      console.log('wallet added failed',error)
     
    //                     //      // toast.error(error);
    //                     //    }
     
    //                 //     toast.success('Transaction sumbited, wait for confirmation',{style: {
    //                 //         background:"#fed8b1"
    //                 //       }})
    //                 //  }).then(r=>{
    //                 //      console.log("transaction confirmed");
                         
    //                  ).catch(e=>console.log(e))
    //         }
    //     });
    // }

   

    const withdrawReward = async() =>{
       
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }

       
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})
            return;
        }

        if(rewardInput < 100 ){
            toast.error('Minimum 100 token rewards is required to withdraw',{style: {
                background:"#fed8b1"
              }})

            return;
        }

        if(reward < 100 ){
            toast.error('Minimum 100 token rewards is required to withdraw',{style: {
                background:"#fed8b1"
              }})

            return;
        }
         console.log('cc')

        web3.setProvider(wallet.ethereum);
        const weiAmount = web3.utils.toWei(rewardInput.toString(), "Gwei")
        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);

               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log(r);
                if(r<weiAmount){
                token.methods
               .approve(stakingAddress, weiAmount).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                }).then(async r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                   
            
                   
                    staking.methods
                    .getReward(wallet.account, weiAmount).send({
                        from: wallet.account,
                        value:  withdrawFee     }).on("transactionHash", async function (hash) {
                       console.log("transaction sent: ",hash);
                       //call api here send wallet.account

                       try {
                      
                       let data ={
                        wallet_address: wallet.account,
                        staked_type : 1,
                        reward:rewardInput
                       }
                        server
                          .post("removeReward", data, {
                            
                          }) 
                          .then((response) => {
                              setUpdateUI(!updateUI)
                            console.log('wallet added')
                            // alert("Month updated successfully.");
                            // console.log("response: ", response.data.ipfs_url);
                           
                            // setDisabled(false)
                          });
                    
                  
                      } catch (error) {
                        // setUpdateUI(false)

                        console.log('wallet added failed',error)

                        // toast.error(error);
                      }



                             
                       
                     }).then(r=>{
                         console.log("transaction confirmed");
                         setReload(true)
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>console.log(e))
            }else{
                

                console.log('jj')
                staking.methods
                .getReward(wallet.account, weiAmount).send({
                        from: wallet.account,
                        value: withdrawFee
                    }).on("transactionHash", async function (hash) {
                        //call api here send wallet.account

                        try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             reward:rewardInput

                            }
                             server
                               .post("removeReward", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
     
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                     }).then(r=>{
                         console.log("transaction confirmed");
                         
                     }).catch(e=>console.log(e))
            }
        });
    }



    const withdrawLocked = async() =>{
        // const bnbFee = await getBnbFee();
        //         console.log('bnbbbb',bnbFee)
        // alert(bnbFee)
        if(!wallet.isConnected()){
            toast.error('Please connect your BSC wallt',{style: {
                background:"#fed8b1"
              }})

            return;
        }

       
        console.log(wallet.chainId)
        if(wallet.chainId!=56){
            toast.error('Please switch to BSC network',{style: {
                background:"#fed8b1"
              }})
            return;
        }

        if(!lockTime){
            toast.error(`Please Stake first` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }
        if(moment(lockTime).isSameOrBefore(new Date())==false){
            toast.error(`you can withdraw reward on ${lockTime}` ,{style: {
                background:"#fed8b1"
              }})

            return;
        }
        web3.setProvider(wallet.ethereum);
        const weiAmount = web3.utils.toWei(locked_reward.toString(), "Gwei")
        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);

               token.methods
               .allowance(wallet?.account, stakingAddress).call().then((r)=>{
                console.log(r);
                if(r<weiAmount){
                token.methods
               .approve(stakingAddress, weiAmount).send({
                   from: wallet.account
               }).on("transactionHash", async function (hash) {
                toast.success('Transaction sumbited, wait for confirmation',{style: {
                    background:"#fed8b1"
                  }})
                }).then(async r=>{
                    console.log("transaction confirmed");
                    ///////////////////////////////////
                   
            
                   
                    staking.methods
                    .getReward(wallet.account, weiAmount).send({
                        from: wallet.account,
                        value:  withdrawFee     }).on("transactionHash", async function (hash) {
                       console.log("transaction sent: ",hash);
                       //call api here send wallet.account

                       try {
                      
                       let data ={
                        wallet_address: wallet.account,
                        staked_type : 1,
                        reward:locked_reward
                       }
                        server
                          .post("removeReward", data, {
                            
                          }) 
                          .then((response) => {
                              setUpdateUI(!updateUI)
                            console.log('wallet added')
                            // alert("Month updated successfully.");
                            // console.log("response: ", response.data.ipfs_url);
                           
                            // setDisabled(false)
                          });
                    
                  
                      } catch (error) {
                        // setUpdateUI(false)

                        console.log('wallet added failed',error)

                        // toast.error(error);
                      }



                             
                       
                     }).then(r=>{
                         console.log("transaction confirmed");
                         setReload(true)
                     }).catch(e=>console.log(e))


                    ///////////////////////

                }).catch(e=>console.log(e))
            }else{
                

                console.log('jj')
                staking.methods
                .getReward(wallet.account, weiAmount).send({
                        from: wallet.account,
                        value: withdrawFee
                    }).on("transactionHash", async function (hash) {
                        //call api here send wallet.account

                        try {
                      
                            let data ={
                             wallet_address: wallet.account,
                             staked_type : 1,
                             reward:locked_reward

                            }
                             server
                               .post("removeReward", data, {
                                 
                               }) 
                               .then((response) => {
                                   setUpdateUI(!updateUI)
                                 console.log('wallet added')
                                 // alert("Month updated successfully.");
                                 // console.log("response: ", response.data.ipfs_url);
                                
                                 // setDisabled(false)
                               });
                         
                       
                           } catch (error) {
                             console.log('wallet added failed',error)
     
                             // toast.error(error);
                           }
     
                        toast.success('Transaction sumbited, wait for confirmation',{style: {
                            background:"#fed8b1"
                          }})
                     }).then(r=>{
                         console.log("transaction confirmed");
                         
                     }).catch(e=>console.log(e))
            }
        });
    }



    const handleChange = (event)=>{
        if(event.target.value){
            setAmount(event.target.value)
        }else{
            setAmount("")
        }
        
    }


    const handleReward = (event)=>{
        if(event.target.value){
            setRewardInput(event.target.value)
        }else{
            setRewardInput("")
        }
        
    }


    const getTokenFee = async()=>{
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
        const tokenFee = await staking.methods.getTokenFee().call()
        return tokenFee;
    }

    const getBnbFee = async()=>{
        const staking = new web3.eth.Contract(stakingAbi, stakingAddress);
        const bnbFee = await staking.methods.getBnbFee().call()
        return bnbFee;
    }

    const connectWalletConnect = ()=>{
        wallet.connect("walletconnect")
    }

    return (
    <>
        <div className='container-fluid m-0 p-0' >
        <LoadingOverlay

  active={loading}
  spinner
  text='Loading ...'
  >
</LoadingOverlay>
            <div className='row Test m-0'>
                <div className='col-lg-6 m-0 p-0 Test Bt-or FDown'>
                    <div className='Bgw Wf Test FDown'>
                        {step==1&& (
                        <>
                            <img className='col-12 h-100' src={Sideimg1} />
                        </>
                        )}
                        {step==2&& (
                        <>
                            <img className='col-12 h-100' src={Sideimg2} />
                        </>
                        )}
                        {step==3&& (
                        <>
                            <img className='col-12 h-100' src={Sideimg3} />
                        </>
                        )}
                        {step==4&& (
                        <>
                            <img className='col-12 h-100' src={Sideimg1} />
                        </>
                        )}
                    </div>
                    <div className='w-100 h-100 Fup D-block'>

                    </div>
                    
                </div>
                <div className='col-lg-6 m-0 Fup'>
                    <div className='row align-self-center Backcol'>
                        <div className='col-6 p-3'>
                            <img className='Lo' src={Logo} />
                        </div>
                        <div className="col-6">
                            <div className="h-100 d-flex align-items-center justify-content-end">
                                <div className='Wfi d-flex'>
                                    <span className='m-1'>
                                       {wallet?.status =="connected"&& (<img className='Sm' src={Binancechain} />)}</span>
                                        {wallet.status=="disconnected"?
                                        <div>
                                            <button onClick={handleShow} className='btn Wfi Bt-or Wf d-flex align-items-center'>Connect Wallet<ArrowRightOutlined className='ps-2'/></button>
                                        </div>:null
                                    }{
                                        wallet.status=="connected"?<>
                                        <div onClick={handleShowD}>
                                        <p className='mt-2' >
                                        {wallet.account ? wallet.account.slice(0, 5) + "..." + wallet.account.slice(39, 43)+" " + "( "+ Number(balance).toFixed(2)+" )" : null}
                                        </p>
                                        </div>
                                        </>:null
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row align-self-center h-75'>
                        <div className='col-xl-6 offset-xl-3 col-lg-10 offset-lg-1 col-md-6 offset-md-3 pb-3 Bb Wao align-self-center'>
                            <div className='Wwf Dispdrop overf-auto'>
                                {/* Show when terms and condition click */}
                                {/* { term && ( */}
                                
                                
                                <TermModal
                                className='myModalTerm'
                                    centered
                                    visible={term}
                                    onOk={() => setTerms(false)}
                                    onCancel={() => setTerms(false)}
                                >
                            <div   //  ref={innerBorderRef}
                                 className='Drop  p-3'>
                                    {/* <div className='ScrollWindow'> */}
                                        <p className='Wclr d-flex align-items-center '><b>Interim Staking Duration</b> </p>
                                        <p>1 Year ROI : 6%</p>
                                        <p>ROI Nature: Auto Compounding</p>
                                        <p>Yearly % Yield: 76%+</p>
                                        <p>Withdrawals: No Monthly Withdrawals</p>
                                        <p>1 year ~ 6% Auto Compounding ROI with no monthly withdrawals</p>

                                        <p className='Wclr'><b>Brief Staking Duration</b></p>
                                        <p>Weekly ROI : 6%</p>
                                        <p>ROI Nature: Available Coins</p>
                                        <p>Yearly % Yield: 32%+</p>
                                        <p>Withdrawals: Monthly Withdrawals</p>
                                        <p>1-year upto ~ 6% ROI with monthly withdrawals</p>
                                        <p className='Wclr'><b>Burning</b></p>
                                        <p>Pool will send some ammount of tokens to burn address according to the load of steaking on pool</p>
                                    {/* </div> */}
                                 </div> 
                            </TermModal>
                                
                                
                                
                                
                                {step==1&&(
                                    <>
                                        <div className='row pb-0 mt-0 Mb-c1'>
                                            <div className='col-12 m-4 mb-0' >
                                                <h1 className='white-font'>Stake MMM</h1>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step==2&&(
                                    <>
                                        <div className='row pb-0 mt-0 Mb-c3'>
                                            <div className='col-12 m-4 mb-0' >
                                                <h1 className='white-font'>Stake MMM</h1>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step==3&&(
                                    <>
                                        <div className='row pb-0 mt-0 Mb-c2'>
                                            <div className='col-12 m-4 mb-0' >
                                                <h1 className='white-font'>Stake MMM</h1>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {/* this is step one */}
                                
                                {step==1&& (
                                <>
                                <div className='row m-4 p-3 pb-0 mb-1 Mt-c2 Bd'>
                                    <div className='row pr-0'>
                                        <div className='col-3'>
                                            <p className='Wclr'>Brief</p>
                                        </div>
                                        <div className='col-9 pr-0 text-end'>
                                            <p>upto 6%</p>
                                        </div>
                                    </div>
                                    <hr className='hrc'></hr>
                                    <div className='row pr-0'>
                                        <div className='col-3'>
                                            <p className='Wclr'>Interim</p>
                                        </div>
                                        <div className='col-9 pr-0 text-end'>
                                            <p>Compounding 76%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='row m-4 mt-0'>
                                    <p className='mt-0'>Transaction Fee 100</p>
                                </div>
                                
                                {/* <div className='row'>
                                    <p className='text-center'>Burns Tokens</p>
                                </div> */}
                                <div className='mt-c1'>
                                    <div className='row m-4'>
                                        <button disabled={wait} onClick={enable} className='btn Bt-or'>Enable</button>
                                    </div>
                                </div>
                                
                                </>
                                )}
                                {/* Step one ends here */}
                                



                                {/* This is step two */}
                                {step==2&& (
                                <>
                                
                                <div className='row text-center Mb-c3'>
                                    <h2 className='white-font p-0 m-0'>{burnFee}%</h2>
                                    <p className='Wclr'>Burn Tokens</p>
                                    <h2 className='white-font p-0 m-0'>15-09-2022</h2>
                                    <p className='Wclr m-0'>Launching Date</p>
                                </div>
                                <div className='row m-8 mt-c3 align-self-center'>
                                    {/* <p className='pb-1 m-0'>Stack MMM</p> */}
                                    <div className='col-6 pt-1'>
                                        <button  onClick={setFlexible} className='btn Bt-or Wf'>Brief</button>
                                    </div>
                                    <div className='col-6 pt-1'>
                                        <button className='btn Bt-or Wf' onClick={setStepThree}>Interim</button>
                                    </div>
                                </div>
                                </>
                                )}
                                {/* Step two end here */}






                                 {step ==4 && (
                                <>
                                <div className='row pb-0 mt-0 Mb-c1'>
                                    <div className='col-12 m-4 mb-0' >
                                        <h1 className='white-font'>Reward Amount</h1>
                                        <Radio.Group value={tabPosition} onChange={changeTabPosition}>
          <Radio.Button value="withdraw">Withdraw Reward</Radio.Button>
          <Radio.Button value="unstake">Unstake Tokens</Radio.Button>

        </Radio.Group>
                                    </div>
                                </div>
                                <div className='row m-4 p-3 pb-0 mb-1 Mt-c2 Bd'>
                                     
                                    <div className='row pr-0'>
                                        <div className='col-5'>
                                            <p className='Wclr'>Total Reward (Brief)</p>
                                        </div>
                                        <div className='col-7 pr-0 text-end'>
                                            <p>{reward ? reward?.toFixed(4) :0}</p>
                                        </div>
                                    </div>

                                    <div className='row pr-0'>
                                        <div className='col-5'>
                                            <p className='Wclr'>Total Reward (Interim)</p>
                                        </div>
                                        <div className='col-7 pr-0 text-end'>
                                            <p>{locked_reward ? locked_reward?.toFixed(4) :0}</p>
                                        </div>
                                    </div>
                                    <hr className='hrc'></hr>
                                    <div className='row pr-0'>
                                        <div className='col-3 p-1'>
                                            <p className='Wclr'>Amount Withdraw</p>
                                        </div>
                                        <div className='col-9 pr-0 text-end'>
                                        <input value={rewardInput} onChange={handleReward} className='Ip B-s form-control mb-3 text-center' type='number' placeholder='0.0 MMM'></input>

                                        </div>
                                    </div>
                                </div>
                                
                                { tabPosition == 'withdraw' && (
 
                                <div className='mt-c11'>
                                    <div className='row m-4'>
                                        <div className='col-6 pt-1'>
                                            <button
                                            onClick={withdrawReward}
                                            className='btn Bt-or Wf'>Brief</button>
                                        </div>
                                        <div className='col-6 pt-1'>
                                            <button
                                            onClick={withdrawLocked}
                                            className='btn Bt-or Wf'>Interim</button>
                                        </div>
                                       
                                    </div>
                                    <div className='col-12 pt-1'>
                                            <button
                                            onClick={()=>{setStep(2)}}
                                            className='btn Bt-or Wf'>Stake</button>
                                        </div>
                                </div>
                                )}
                                { tabPosition == 'unstake' && (

                                 <div className='mt-c11'>
                                    <div className='row m-4'>
                                        <div className='col-6 pt-1'>
                                            <button
                                            onClick={unStake}
                                            className='btn Bt-or Wf'>Brief</button>
                                        </div>
                                        <div className='col-6 pt-1'>
                                            <button
                                            onClick={unStakeLocked}
                                            className='btn Bt-or Wf'>Interim</button>
                                        </div>
                                        
                                      
                                    </div>
                                    <div className='col-12 pt-1'>
                                            <button
                                            onClick={()=>{setStep(2)}}
                                            className='btn Bt-or Wf'>Stake</button>
                                        </div>
                                </div> 
                                )}
                                       </>
                                //  {/* 
                            )} 



                                
                                
                                {/* This is step three */}
                                {step==3&& (
                                <>
                                <div className='row m-4 pt-0 pb-0 mb-2'>
                                    {/* <h3 className='Wclr'>Amount of Tokens</h3> */}
                                    <input value={amount} onChange={handleChange} className='Ip B-s form-control mb-3 text-center' type='number' placeholder='0.0 MMM'></input>

                                    
                   
                                    <div className='row m-0 mt-3 mb-3 p-0'>
                                        <div className='Wwf d-flex justify-content-between'>
                                            <div><button onClick={()=>{setAmount((balance*25)/100)}} className='btn Bt-or'>25%</button></div>
                                        {/* </div> */}
                                        {/* <div className='col-3'> */}
                                        <div><button onClick={()=>{setAmount((balance*50)/100)}} className='btn Bt-or'>50%</button></div>
                                        {/* </div>
                                        <div className='col-3'> */}
                                            <div><button onClick={()=>{setAmount((balance*75)/100)}} className='btn Bt-or'>75%</button></div>
                                        {/* </div>
                                        <div className='col-3'> */}
                                            <div><button onClick={()=>{setAmount((balance*100)/100)}} className='btn Bt-or'>Max</button></div>
                                        </div>
                                    </div>

                                    <span className='Wclr p-0'>
                                    <Slider
                                       
                                       trackStyle={{ backgroundColor: '#EB5633' }}
          handleStyle={{ borderColor: '#EB5633' }}
                                        min={1}
                                        // max={100}
                                        max={balance-0.0000001}
                                        onChange={onChange}
                                        value={typeof amount === 'number' ? amount : 0}
                                        />
                                        </span>
                                </div>
                                <div className='Dispdrop'>
                                    
                                    <div onClick={handleClickInside} className='row Wwf Bd m-8 mt-0'>
                                        <div className='m-0 col-6'>
                                            <p   className='m-1'>Details</p>
                                        </div>
                                        <div class='m-0 col-6 d-flex justify-content-end'>
                                            <div className='d-flex'>
                                                <span className='m-1 white-font' style={{ fontSize: '13px'}}><DownOutlined /><UpOutlined /></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* When Clik on Display dropdwon show this div */}
                                     
                                     { clickedOutside && (

                                     <div 
                                    //  ref={innerBorderRef2}
                                     className='m-8 mt-0 Drop hrc p-1'>
                                            <div className='row m-0 p-1'>
                                                <div className='col-8 m-0 p-0'>
                                                    <p>Average lock duration</p>
                                                    <p>Performance Fee</p>
                                                    <p className=''><a href='https://pancakeswap.finance/info/token/0xa6d55d946bcd1c7da099c9fbbb0696f827c467db' className='Link' target='_blank'>See Token Info <ExportOutlined /></a></p>
                                                    <p><a href='https://youtu.be/HiziMxHH90k' className='Link' target='_blank'>View Tutorial <ExportOutlined /></a></p>
                                                    <p><a href='https://bscscan.com/address/0xa6D55d946bCd1c7DA099C9fBbB0696f827c467db' className='Link' target='_blank'>View Contract <ExportOutlined /></a></p>
                                                </div>
                                                <div className='col-4 m-0 p-0 text-right'>
                                                    <p>52 Weeks</p>
                                                    <p>Variable</p>
                                                </div>
                                            </div>
                                    </div> 
                                     )
                                }
                                    
                                </div>
                                <div className='row mt-c2 mm-0'>
                                    <div className='col-12'>  
                                        <button disabled={wait} onClick={stake} className='btn Bt-or w-100'>Stake</button>
                                    </div>
                                </div>
                                </>
                                )}
                                {/* Step three ends here */}
                                

                            </div>



                        </div>
                    </div>

                    <div className='row align-self-center'>
                        <div className="col-3">
                            <div className="h-100 d-flex"> 
                                {/* <span className='m-1'><img className='Sm' src={Binancechain} /></span>
                                        {wallet.status=="disconnected"?
                                        <div>
                                            <button onClick={handleShow} className='btn Wfi Bt-or Wf'>Connect Wallet<ArrowRightOutlined style={{marginTop:0}}/></button>
                                        </div>:null
                                    }{
                                        wallet.status=="connected"?<>
                                        <p>
                                        {wallet.account ? wallet.account.slice(0, 5) + "..." + wallet.account.slice(39, 43)+" " + "( "+ Number(balance).toFixed(2)+" )" : null}
                                        </p>
                                        </>:null
                                    } */}

                                <div onClick={onBack}>
                                    <p className='Wfi Wf Wclr d-flex align-items-center cursor-pointer' style={{cursor:'pointer'}}><ArrowLeftOutlined className='pe-2'/> Back</p>
                                </div>
                                {/* <div className='d-flex'>
                                    <img src={Autogif} className='gifs' /><p>Auto</p>
                                </div>
                                <div>
                                    <p className='Wfi Wf Wclr'>Terms & Conditions</p>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="h-100 d-flex justify-content-end">
                                <div className='Wfi d-flex'>
                                    {/* <span className='m-1'><img className='Sm' src={Binancechain} /></span>
                                        {wallet.status=="disconnected"?
                                        <div>
                                            <button onClick={handleShow} className='btn Wfi Bt-or Wf'>Connect Wallet<ArrowRightOutlined style={{marginTop:0}}/></button>
                                        </div>:null
                                    }{
                                        wallet.status=="connected"?<>
                                        <p>
                                        {wallet.account ? wallet.account.slice(0, 5) + "..." + wallet.account.slice(39, 43)+" " + "( "+ Number(balance).toFixed(2)+" )" : null}
                                        </p>
                                        </>:null
                                    } */}
                                    {/* <img src={Autogif}></img> */}

                                   {  stake_type == 0 && (
                                    <div className='d-flex mr align-self-center'>
                                        <img src={Autogif} className='gifs' /><p className='Wclr'>Auto</p>
                                    </div>
                                   )
                                 }
                                    
                                    <button style={{all: 'unset',
  cursor: 'pointer'}} onClick={handleTerms}>
                                        <p className='Wfi Wf Wclr'>Terms & Conditions</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex justify-content-center'>
                                <p>Powered by <a href='https://qonery.com/' className='Link' target='_blank'><b>Qonery&reg;</b></a></p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <Toaster 
                        position="top-center"
                      />
            </div>
            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect your wallets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='Bb m-0 p-0'>
                <div className='row p-3'>
                    <div className='col-6 align-self-center'>
                        <img className='w-25' src={Metamask} />
                    </div>
                    <div className='col-6 align-self-center'>
                        <button  onClick={connect} className='btn Bt-or Wf'>Connect Wallet</button>
                    </div>
                </div>
                {/* <div className='row p-3'>
                    <div className='col-6 align-self-center'>
                        <img className='w-25' src={Walletconnect} />
                    </div>
                    <div className='col-6 align-self-center'>
                        <button  onClick={connectWalletConnect} className='btn Bt-or Wf'>WalletConnect</button>
                    </div>
                </div> */}
            </div>
        </Modal.Body>
        
      </Modal>


      <Modal show={showDisconnect} onHide={handleCloseD}>
        <Modal.Header closeButton>
          <Modal.Title>Disconnect</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='Bb m-0 p-0'>
                <div className='row p-3'>
                    <div className='col-6 align-self-center'>
                        <img className='w-25' src={Metamask} />
                    </div>
                    <div className='col-6 align-self-center'>
                        <button  onClick={disconnect} className='btn Bt-or Wf'>Disconnect</button>
                    </div>
                </div>
                {/* <div className='row p-3'>
                    <div className='col-6 align-self-center'>
                        <img className='w-25' src={Walletconnect} />
                    </div>
                    <div className='col-6 align-self-center'>
                        <button  onClick={connectWalletConnect} className='btn Bt-or Wf'>WalletConnect</button>
                    </div>
                </div> */}
            </div>
        </Modal.Body>
        
      </Modal>

    </div></>)
}


