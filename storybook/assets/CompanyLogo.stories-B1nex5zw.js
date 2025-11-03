import{j as t,T as a,c,C as g,m as l}from"./iframe-B1bS8kNu.js";import{b as i,r as d}from"./plugin-9321bBmh.js";import{S as s}from"./Grid-C88sFnNl.js";import{w as u}from"./appWrappers-C65DRcJR.js";import{T as f}from"./TemplateBackstageLogo-B5CAC_t-.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D0zUNDSW.js";import"./componentData-C-kspxhs.js";import"./useAnalytics-CWJQ4paP.js";import"./useApp-DrlXjDDm.js";import"./useRouteRef-DHlcXK6F.js";import"./index-BB5XVHud.js";import"./InfoCard-DaVqc602.js";import"./CardContent-C2gGqaJ1.js";import"./ErrorBoundary-Dg6qw5Z9.js";import"./ErrorPanel-DfQRlabN.js";import"./WarningPanel-Cb2ULWmf.js";import"./ExpandMore-Y-_AusZ_.js";import"./AccordionDetails-DjOY9uzz.js";import"./index-DnL3XN75.js";import"./Collapse-BL8sH0TP.js";import"./MarkdownContent-B5j69JDg.js";import"./CodeSnippet-Cfe8KNVU.js";import"./Box-kUekMc6O.js";import"./styled-CICePBTu.js";import"./CopyTextButton-amdB5IIQ.js";import"./useCopyToClipboard-DtkwdRTx.js";import"./useMountedState-DehZQ_NE.js";import"./Tooltip-CpvnZrMV.js";import"./Popper-DI0r4x2S.js";import"./Portal-CbatMowK.js";import"./List-vAsLcuDY.js";import"./ListContext-Dr49CUeJ.js";import"./ListItem-F3f87gTr.js";import"./ListItemText-CcMD6A8n.js";import"./LinkButton-BzTRIntM.js";import"./Button-CgBkAUiP.js";import"./Link--XlSoX1z.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-XX7OP1Eg.js";import"./Divider-Bq5dRhO-.js";import"./CardActions-DoU6wCz4.js";import"./BottomLink-4AtDZufv.js";import"./ArrowForward-CvuqPmlL.js";import"./DialogTitle-CGSxheNa.js";import"./Modal-DljuX6iF.js";import"./Backdrop-DC3_0QFG.js";import"./useObservable-BdE9m8Kk.js";import"./useIsomorphicLayoutEffect-B8jAT4vp.js";import"./useAsync-DRwN7CqQ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
