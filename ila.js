import ethers from 'ethers';
import express from 'express';
import chalk from 'chalk';
import dotenv from 'dotenv';
import inquirer from 'inquirer';

const app = express();
dotenv.config();

const data = {
  BUSD: process.env.BUSD_CONTRACT, //bnb

  to_PURCHASE: process.env.TO_PURCHASE, // token that you will purchase = BUSD for test '0xe9e7cea3dedca5984780bafc599bd69add087d56'

  AMOUNT_OF_BUSD : process.env.AMOUNT_OF_BUSD, // how much you want to buy in BNB

  factory: process.env.FACTORY,  //PancakeSwap V2 factory

  router: process.env.ROUTER, //PancakeSwap V2 router

  recipient: process.env.YOUR_ADDRESS, //your wallet address,

  Slippage : process.env.SLIPPAGE, //in Percentage

  gasPrice : ethers.utils.parseUnits(`${process.env.GWEI}`, 'gwei'), //in gwei

  gasLimit : process.env.GAS_LIMIT, //at least 21000

  minBUSD : process.env.MIN_BUSD_LIQUIDITY_ADDED //min liquidity added
}



const url = process.env.WSS_NODE;
const mnemonic = process.env.YOUR_MNEMONIC //your memonic;
// const provider = new ethers.providers.JsonRpcProvider(bscMainnetUrl)
const provider = new ethers.providers.WebSocketProvider(url);
const wallet = new ethers.Wallet(mnemonic);
const account = wallet.connect(provider);



// const router = new ethers.Contract(
//   data.router,
//   [
//     'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
//     'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
//     'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
//     'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external  payable returns (uint[] memory amounts)',
//     'function swapExactETHForTokens( uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
//   ],
//   account
// );
const router = new ethers.Contract(
  data.router,
  [
    'function buyTokens(uint256 _LumiAmount, uint256 referralCode_) external payable returns (uint[] memory amounts)',
    'function openingTime() payable returns (uint[] memory amounts)',
    
  ],
  account
);



const _LumiAmount = 1;

const referralCode_ = 20000000000000000000n

const tx = await router.buyTokens(
            _LumiAmount,
             referralCode_,
             {
              'gasLimit': data.gasLimit,
              'gasPrice': data.gasPrice,
              
              }         
             
             )

const receipt = await tx.wait();
console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`);


const PORT = 5002;

app.listen(PORT, console.log(chalk.yellow(`Listening for Liquidity Addition to token ${data.to_PURCHASE}`)));
