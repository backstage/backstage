import{F as g,r as y,j as r,H as v}from"./iframe-M9O-K8SB.js";import{c as h,D as b,a as f,b as q}from"./DialogTitle-BJV9GWqg.js";import{D as x}from"./DialogContentText-D-kUguUS.js";import{B as O}from"./Button-JPiqA3bT.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./Backdrop-D_SJu6io.js";const i=n=>{const{idleTimer:o,setOpen:p,open:u,promptTimeoutMillis:l,remainingTime:a,setRemainingTime:s}=n,{t:m}=g(v);y.useEffect(()=>{const T=setInterval(()=>{s(Math.ceil(o.getRemainingTime()))},500);return()=>{clearInterval(T)}},[o,s]);const d=()=>{p(!1),o.activate()},c=Math.max(a-l/1e3,0)>1?"seconds":"second";return r.jsxs(h,{open:u,"data-testid":"inactivity-prompt-dialog",children:[r.jsx(b,{children:m("autoLogout.stillTherePrompt.title")}),r.jsx(f,{children:r.jsxs(x,{children:["You are about to be disconnected in"," ",r.jsxs("b",{children:[Math.ceil(a/1e3)," ",c]}),". Are you still there?"]})}),r.jsx(q,{children:r.jsx(O,{onClick:d,color:"secondary",variant:"contained",size:"small",children:m("autoLogout.stillTherePrompt.buttonText")})})]})};i.__docgenInfo={description:"",methods:[],displayName:"StillTherePrompt",props:{idleTimer:{required:!0,tsType:{name:"IIdleTimer"},description:""},promptTimeoutMillis:{required:!0,tsType:{name:"number"},description:""},remainingTime:{required:!0,tsType:{name:"number"},description:""},setRemainingTime:{required:!0,tsType:{name:"signature",type:"function",raw:"(amount: number) => void",signature:{arguments:[{type:{name:"number"},name:"amount"}],return:{name:"void"}}},description:""},open:{required:!0,tsType:{name:"boolean"},description:""},setOpen:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};const w={title:"Data Display/StillTherePrompt",component:i,tags:["!manifest"]},e=n=>r.jsx(i,{...n});e.args={idleTimer:{getRemainingTime:()=>1e3,activate:()=>{}},promptTimeoutMillis:1e3,remainingTime:1e3,setRemainingTime:()=>{},open:!0,setOpen:()=>{}};const t=n=>r.jsx(i,{...n});t.args={idleTimer:{getRemainingTime:()=>1e3,activate:()=>{}},promptTimeoutMillis:1e3,remainingTime:1e3,setRemainingTime:()=>{},open:!1,setOpen:()=>{}};e.__docgenInfo={description:"",methods:[],displayName:"Open",props:{idleTimer:{required:!0,tsType:{name:"IIdleTimer"},description:""},promptTimeoutMillis:{required:!0,tsType:{name:"number"},description:""},remainingTime:{required:!0,tsType:{name:"number"},description:""},setRemainingTime:{required:!0,tsType:{name:"signature",type:"function",raw:"(amount: number) => void",signature:{arguments:[{type:{name:"number"},name:"amount"}],return:{name:"void"}}},description:""},open:{required:!0,tsType:{name:"boolean"},description:""},setOpen:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};t.__docgenInfo={description:"",methods:[],displayName:"NotOpen",props:{idleTimer:{required:!0,tsType:{name:"IIdleTimer"},description:""},promptTimeoutMillis:{required:!0,tsType:{name:"number"},description:""},remainingTime:{required:!0,tsType:{name:"number"},description:""},setRemainingTime:{required:!0,tsType:{name:"signature",type:"function",raw:"(amount: number) => void",signature:{arguments:[{type:{name:"number"},name:"amount"}],return:{name:"void"}}},description:""},open:{required:!0,tsType:{name:"boolean"},description:""},setOpen:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Open = () => (
  <StillTherePrompt
    idleTimer={{
      getRemainingTime: () => 1000,
      activate: () => {},
    }}
    promptTimeoutMillis={1000}
    remainingTime={1000}
    setRemainingTime={() => {}}
    open
    setOpen={() => {}}
  />
);
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const NotOpen = () => (
  <StillTherePrompt
    idleTimer={{
      getRemainingTime: () => 1000,
      activate: () => {},
    }}
    promptTimeoutMillis={1000}
    remainingTime={1000}
    setRemainingTime={() => {}}
    open={false}
    setOpen={() => {}}
  />
);
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: StillTherePromptProps) => <StillTherePrompt {...args} />",...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"(args: StillTherePromptProps) => <StillTherePrompt {...args} />",...t.parameters?.docs?.source}}};const C=["Open","NotOpen"];export{t as NotOpen,e as Open,C as __namedExportsOrder,w as default};
