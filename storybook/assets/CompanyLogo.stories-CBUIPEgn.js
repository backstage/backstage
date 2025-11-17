import{j as t,T as a,c,C as g,m as l}from"./iframe-DQwDoo1H.js";import{b as i,r as d}from"./plugin-dmErilqI.js";import{S as s}from"./Grid-C1mkfO-A.js";import{w as u}from"./appWrappers-DVOHFJoQ.js";import{T as f}from"./TemplateBackstageLogo-BtnhS-aS.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CD-n_nwk.js";import"./componentData-CtVPpLvp.js";import"./useAnalytics-CM26OCnx.js";import"./useApp-DwlOIlXY.js";import"./useRouteRef-ygb9ecnn.js";import"./index-HojQYYpO.js";import"./InfoCard-BtXgYcU_.js";import"./CardContent-BD09Z7SB.js";import"./ErrorBoundary-m70byrMj.js";import"./ErrorPanel-BmTSQtWv.js";import"./WarningPanel-DrLC6u8B.js";import"./ExpandMore-fAUa6rkR.js";import"./AccordionDetails-DSyZkU1w.js";import"./index-DnL3XN75.js";import"./Collapse-BgsL6NY8.js";import"./MarkdownContent-u_spSNfd.js";import"./CodeSnippet-D0jouXxL.js";import"./Box-8SFFKrct.js";import"./styled-B2hRU9Pw.js";import"./CopyTextButton-CpIDND41.js";import"./useCopyToClipboard-DsqKZmF6.js";import"./useMountedState-nYgtVuR7.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";import"./Portal-0E-kgImq.js";import"./List-mWa-4ocl.js";import"./ListContext-Cn7bnyCl.js";import"./ListItem-Dwvy6ya2.js";import"./ListItemText-BtoENYOw.js";import"./LinkButton-yeg5JieK.js";import"./Button-DxB0Mkn2.js";import"./Link-Cd-y_3kz.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BqO5cyWU.js";import"./Divider-DgNlfm7L.js";import"./CardActions-BUmLQ9hm.js";import"./BottomLink-DsmJq7Bq.js";import"./ArrowForward-BWgfYpnj.js";import"./DialogTitle-BfXc2ZX9.js";import"./Modal-BBquywqf.js";import"./Backdrop-BnvfdWzz.js";import"./useObservable-BprdzNtB.js";import"./useIsomorphicLayoutEffect-DKvvtE9T.js";import"./useAsync-NIOp2rsC.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
