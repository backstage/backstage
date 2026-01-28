import{m as h,n as k,r as w,j as s,aq as B,N as c,ar as S,I as P,b as A,T as m,d as _}from"./iframe-B9hgvJLw.js";import{u as j,s as u,W as q,M as D}from"./useObservable-BcGRWwwK.js";import{L}from"./Link-C9X-RXqH.js";import"./preload-helper-PPVm8Dsz.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./lodash-Czox7iJy.js";import"./index-CsGVCGL2.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";const I=h(e=>({root:{padding:e.spacing(0),marginBottom:e.spacing(0),marginTop:e.spacing(0),display:"flex",flexFlow:"row nowrap"},topPosition:{position:"relative",marginBottom:e.spacing(6),marginTop:-e.spacing(3),zIndex:"unset"},icon:{fontSize:e.typography.h6.fontSize},content:{width:"100%",maxWidth:"inherit",flexWrap:"nowrap",color:e.palette.banner.text},message:{display:"flex",alignItems:"center","& a":{color:e.palette.banner.link}},button:{color:e.palette.banner.closeButtonColor??"inherit"},info:{backgroundColor:e.palette.banner.info},error:{backgroundColor:e.palette.banner.error},warning:{backgroundColor:e.palette.banner.warning??e.palette.banner.error}}),{name:"BackstageDismissableBanner"}),n=e=>{const{variant:f,message:v,id:l,fixed:p=!1}=e,i=I(),t=k(u).forBucket("notifications"),o=j(t.observe$("dismissedBanners"),t.snapshot("dismissedBanners")),d=w.useMemo(()=>new Set(o.value??[]),[o.value]),x=o.presence==="unknown",T=()=>{t.set("dismissedBanners",[...d,l])};return s.jsx(B,{anchorOrigin:p?{vertical:"bottom",horizontal:"center"}:{vertical:"top",horizontal:"center"},open:!x&&!d.has(l),classes:{root:c(i.root,!p&&i.topPosition)},children:s.jsx(S,{classes:{root:c(i.content,i[f]),message:i.message},message:v,action:[s.jsx(P,{title:"Permanently dismiss this message",className:i.button,onClick:T,children:s.jsx(A,{className:i.icon})},"dismiss")]})})};n.__docgenInfo={description:"@public",methods:[],displayName:"DismissableBanner",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};const H={title:"Feedback/DismissableBanner",component:n,argTypes:{variant:{options:["info","error","warning"],control:{type:"select"}}},tags:["!manifest"]},g={width:"70%"},N=()=>q.create({errorApi:new D}),b=[[u,N()]],y={message:"This is a dismissable banner",variant:"info",fixed:!1},r=e=>s.jsx("div",{style:g,children:s.jsx(m,{apis:b,children:s.jsx(n,{...e,id:"default_dismissable"})})});r.args=y;const a=e=>s.jsx("div",{style:g,children:s.jsx(m,{apis:b,children:s.jsx(n,{...e,message:s.jsxs(_,{children:["This is a dismissable banner with a link:"," ",s.jsx(L,{to:"http://example.com",color:"textPrimary",children:"example.com"})]}),id:"linked_dismissable"})})});a.args=y;r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};a.__docgenInfo={description:"",methods:[],displayName:"WithLink",props:{variant:{required:!0,tsType:{name:"union",raw:"'info' | 'error' | 'warning'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"}]},description:""},message:{required:!0,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},fixed:{required:!1,tsType:{name:"boolean"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
  </div>`,...a.parameters?.docs?.source}}};const J=["Default","WithLink"];export{r as Default,a as WithLink,J as __namedExportsOrder,H as default};
