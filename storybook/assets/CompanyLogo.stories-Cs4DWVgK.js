import{j as t,T as a,c,C as g,m as l}from"./iframe-XFwexWAC.js";import{b as i,r as d}from"./plugin-DmfJPYc3.js";import{S as s}from"./Grid-QGplJCTn.js";import{w as u}from"./appWrappers-70i-hxtl.js";import{T as f}from"./TemplateBackstageLogo-CYebcYNr.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DRnkdvxE.js";import"./componentData-BgE2FK5U.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./useRouteRef-B_kQk1xP.js";import"./index-BjVSwF8u.js";import"./InfoCard-C3e3GLYI.js";import"./CardContent-DD931SVo.js";import"./ErrorBoundary-BfsUlOJh.js";import"./ErrorPanel-0ntfFJ4u.js";import"./WarningPanel-CWtEeF6X.js";import"./ExpandMore-DmZgnz1E.js";import"./AccordionDetails-vmXM40VX.js";import"./index-B9sM2jn7.js";import"./Collapse-BtERTKf9.js";import"./MarkdownContent-DGJWTS_J.js";import"./CodeSnippet-B745YxT9.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./CopyTextButton-BU9NUfM0.js";import"./useCopyToClipboard-BxYbXeOS.js";import"./useMountedState-D8mLU74K.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";import"./Portal-DGqwvRCH.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./ListItem-BEnPhwl_.js";import"./ListItemText-DimjlXkG.js";import"./LinkButton-GCBw9_0G.js";import"./Button-CfP9f6s1.js";import"./Link-YMEncvsI.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DuQKXcju.js";import"./Divider-AcqAP6v2.js";import"./CardActions-DaFtt8Y8.js";import"./BottomLink-DY3jThaC.js";import"./ArrowForward-lqL8v-HC.js";import"./DialogTitle-DjDrvKqf.js";import"./Modal-BKS56bVv.js";import"./Backdrop-BSizeznv.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./useAsync-CTNfJ6Gv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
