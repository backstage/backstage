import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DA79yDb5.js";import{b as i,r as d}from"./plugin-DPO0j2JD.js";import{S as s}from"./Grid-BPnxYFEE.js";import{w as u}from"./appWrappers-n6jVhqF6.js";import{T as f}from"./TemplateBackstageLogo-emdCjGb4.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYrkOIGL.js";import"./componentData-Cd7zESh7.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./useRouteRef-Vppi1dhZ.js";import"./index-Yr_6lw0r.js";import"./InfoCard-DXBo22iI.js";import"./CardContent-DSz4cfwc.js";import"./ErrorBoundary-D_GuCvAD.js";import"./ErrorPanel-Cep-pimB.js";import"./WarningPanel-BYActx0S.js";import"./ExpandMore-DR_zyoTC.js";import"./AccordionDetails-BvhTDe-h.js";import"./index-B9sM2jn7.js";import"./Collapse-Cl5eVhLP.js";import"./MarkdownContent-GLKDok0W.js";import"./CodeSnippet-CVIRDvuJ.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./CopyTextButton-BbvOylv0.js";import"./useCopyToClipboard-BnMS7Zdt.js";import"./useMountedState-3oFHoVCv.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";import"./Portal-C0jNS9Vb.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./ListItem-BvihMH8Z.js";import"./ListItemText-DGxuZd8I.js";import"./LinkButton-C7Vx68WK.js";import"./Link-QsBbL45G.js";import"./lodash-DGzVoyEp.js";import"./Button-DhPtekNk.js";import"./CardHeader-BBlm1V9W.js";import"./Divider-CFY8fi3w.js";import"./CardActions-C6lGtMc4.js";import"./BottomLink-Bj6NYPog.js";import"./ArrowForward-2Mv1uxa3.js";import"./DialogTitle-Cam7H8C2.js";import"./Modal-B60MXtNN.js";import"./Backdrop-CHWN49VN.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./useAsync-DJl5sWtJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const {
    container
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    container,
    svg,
    path
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
      svg,
      path
    }} />} />
    </Grid>;
}`,...e.parameters?.docs?.source}}};const Co=["Default","CustomLogo"];export{e as CustomLogo,r as Default,Co as __namedExportsOrder,yo as default};
