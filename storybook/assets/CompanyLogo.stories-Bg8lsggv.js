import{j as t,T as a,c,C as g,m as l}from"./iframe-Yl0Qc67S.js";import{b as i,r as d}from"./plugin-BkwveSeS.js";import{S as s}from"./Grid-BoLsaJTc.js";import{w as u}from"./appWrappers-CnXqdPEu.js";import{T as f}from"./TemplateBackstageLogo-6BhaBrTa.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Beh3pv9A.js";import"./componentData-D8eoWRR-.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./useRouteRef-DxCJ4QuA.js";import"./index-CuRibKaG.js";import"./InfoCard-CXsxUKdX.js";import"./CardContent-U26WTHFS.js";import"./ErrorBoundary-CgJuMyhL.js";import"./ErrorPanel-DLd7jlxf.js";import"./WarningPanel-DPnP4zkP.js";import"./ExpandMore-DlTYCfZc.js";import"./AccordionDetails-UWNICwr0.js";import"./index-B9sM2jn7.js";import"./Collapse-CReMq_1Z.js";import"./MarkdownContent-DmHmkZd9.js";import"./CodeSnippet-B108T10t.js";import"./Box-DltD7D0m.js";import"./styled-DXbACUbA.js";import"./CopyTextButton-3gQ_70GM.js";import"./useCopyToClipboard-BnQ5eYWr.js";import"./useMountedState-B1Psi6MC.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";import"./Portal-kuGKvNyC.js";import"./List-C5jB0ILm.js";import"./ListContext-BQmyr3YY.js";import"./ListItem-BafF8VBM.js";import"./ListItemText-9ikpSF0R.js";import"./LinkButton-BzDiNx0m.js";import"./Button-bP0crEE2.js";import"./Link-_9kMa81h.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DuvnTHjz.js";import"./Divider-DRYu6qgR.js";import"./CardActions-DtARUctM.js";import"./BottomLink-Ca2TP61T.js";import"./ArrowForward-BkzBO0po.js";import"./DialogTitle-DbBdv3gV.js";import"./Modal-iRV6ko-2.js";import"./Backdrop-DutGXUrc.js";import"./useObservable-DO3JHHHA.js";import"./useIsomorphicLayoutEffect-BgwaU1Zu.js";import"./useAsync-HjbYn2WS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
