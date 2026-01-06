import{j as t,T as a,c,C as g,m as l}from"./iframe-nUyzSU_S.js";import{b as i,r as d}from"./plugin-CYJstFDm.js";import{S as s}from"./Grid-DwDNjNmk.js";import{w as u}from"./appWrappers-uUi70V5A.js";import{T as f}from"./TemplateBackstageLogo-BlyGN-Jt.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BL-ThqI6.js";import"./componentData-BtNz5bOU.js";import"./useAnalytics-zfcNJTQf.js";import"./useApp-BPL8rQQ0.js";import"./useRouteRef-DTrAK6VX.js";import"./index-RHyzx4fN.js";import"./InfoCard-DSeh5j0l.js";import"./CardContent-DWcWYjWe.js";import"./ErrorBoundary-CNX_z6P8.js";import"./ErrorPanel-Dv6LBRqb.js";import"./WarningPanel-T0yxH3Lf.js";import"./ExpandMore-DrwTQ_nT.js";import"./AccordionDetails-BqLvXOa3.js";import"./index-B9sM2jn7.js";import"./Collapse-Qq71ZV2-.js";import"./MarkdownContent-CmKSX4Zr.js";import"./CodeSnippet-DiaoCVk2.js";import"./Box-CplorJ0g.js";import"./styled-D6A2oy1q.js";import"./CopyTextButton--QRyALeY.js";import"./useCopyToClipboard-CaxGIeMo.js";import"./useMountedState-Ck7bTrxM.js";import"./Tooltip-HC5n3ZHa.js";import"./Popper-DpFVguQf.js";import"./Portal-B4a8gD0I.js";import"./List-D6JW15z2.js";import"./ListContext-CXea3Vhu.js";import"./ListItem-PgZpHMG5.js";import"./ListItemText-Bd0mukYB.js";import"./LinkButton-DJUqKcTh.js";import"./Button-9eN5S7Qm.js";import"./Link-Dwrts35l.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CjXaRXp3.js";import"./Divider-B2c5GnvR.js";import"./CardActions-BHnQKqWp.js";import"./BottomLink-DLjeX_1_.js";import"./ArrowForward-CpJlCC58.js";import"./DialogTitle-CrBmctvX.js";import"./Modal-CyZtSQZC.js";import"./Backdrop-D6as2G6O.js";import"./useObservable-D1hu37r5.js";import"./useIsomorphicLayoutEffect-DDHF-UnU.js";import"./useAsync-D2jbTAhU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
