import{J as h,r as k,j as s,au as w,av as B,K as S,X as P,W as m,d as A}from"./iframe-CTfOr1ix.js";import{u as _,s as u,W as j,M as D}from"./useObservable-D-HXaDcN.js";import{c}from"./index-P4DR0u2t.js";import{m as q}from"./makeStyles-1FwyOuiP.js";import{L}from"./Link-BZTNDDiJ.js";import"./preload-helper-PPVm8Dsz.js";import"./useIsomorphicLayoutEffect-BN4bH0qe.js";import"./lodash-n8-yS5G5.js";import"./index-B-ObPmyF.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";const W=q(e=>({root:{padding:e.spacing(0),marginBottom:e.spacing(0),marginTop:e.spacing(0),display:"flex",flexFlow:"row nowrap"},topPosition:{position:"relative",marginBottom:e.spacing(6),marginTop:-e.spacing(3),zIndex:"unset"},icon:{fontSize:e.typography.h6.fontSize},content:{width:"100%",maxWidth:"inherit",flexWrap:"nowrap",color:e.palette.banner.text},message:{display:"flex",alignItems:"center","& a":{color:e.palette.banner.link}},button:{color:e.palette.banner.closeButtonColor??"inherit"},info:{backgroundColor:e.palette.banner.info},error:{backgroundColor:e.palette.banner.error},warning:{backgroundColor:e.palette.banner.warning??e.palette.banner.error}}),{name:"BackstageDismissableBanner"}),n=e=>{const{variant:y,message:v,id:l,fixed:p=!1}=e,i=W(),t=h(u).forBucket("notifications"),o=_(t.observe$("dismissedBanners"),t.snapshot("dismissedBanners")),d=k.useMemo(()=>new Set(o.value??[]),[o.value]),x=o.presence==="unknown",T=()=>{t.set("dismissedBanners",[...d,l])};return s.jsx(w,{anchorOrigin:p?{vertical:"bottom",horizontal:"center"}:{vertical:"top",horizontal:"center"},open:!x&&!d.has(l),classes:{root:c(i.root,!p&&i.topPosition)},children:s.jsx(B,{classes:{root:c(i.content,i[y]),message:i.message},message:v,action:[s.jsx(S,{title:"Permanently dismiss this message",className:i.button,onClick:T,children:s.jsx(P,{className:i.icon})},"dismiss")]})})};n.__docgenInfo={description:"@public",methods:[],displayName:"DismissableBanner",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};const G={title:"Feedback/DismissableBanner",component:n,argTypes:{variant:{options:["info","error","warning"],control:{type:"select"}}},tags:["!manifest"]},g={width:"70%"},C=()=>j.create({errorApi:new D}),b=[[u,C()]],f={message:"This is a dismissable banner",variant:"info",fixed:!1},r=e=>s.jsx("div",{style:g,children:s.jsx(m,{apis:b,children:s.jsx(n,{...e,id:"default_dismissable"})})});r.args=f;const a=e=>s.jsx("div",{style:g,children:s.jsx(m,{apis:b,children:s.jsx(n,{...e,message:s.jsxs(A,{children:["This is a dismissable banner with a link:"," ",s.jsx(L,{to:"http://example.com",color:"textPrimary",children:"example.com"})]}),id:"linked_dismissable"})})});a.args=f;r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};a.__docgenInfo={description:"",methods:[],displayName:"WithLink",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner id="default_dismissable" />
    </TestApiProvider>
  </div>
);
`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const WithLink = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message={
          <Typography>
            This is a dismissable banner with a link:{" "}
            <Link to="http://example.com" color="textPrimary">
              example.com
            </Link>
          </Typography>
        }
        id="linked_dismissable"
      />
    </TestApiProvider>
  </div>
);
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(args: Props) => <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner {...args} id="default_dismissable" />
    </TestApiProvider>
  </div>`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`(args: Props) => <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner {...args} message={<Typography>
            This is a dismissable banner with a link:{' '}
            <Link to="http://example.com" color="textPrimary">
              example.com
            </Link>
          </Typography>} id="linked_dismissable" />
    </TestApiProvider>
  </div>`,...a.parameters?.docs?.source}}};const H=["Default","WithLink"];export{r as Default,a as WithLink,H as __namedExportsOrder,G as default};
