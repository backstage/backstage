import{j as t,T as a,c,C as g,m as l}from"./iframe-BUNFJ-LL.js";import{b as i,r as d}from"./plugin-DfsIxsAq.js";import{S as s}from"./Grid-DBxLs0pG.js";import{w as u}from"./appWrappers-DwaX-D8B.js";import{T as f}from"./TemplateBackstageLogo-D6AU_moS.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CX2F1Eyu.js";import"./componentData-zDZJvmdk.js";import"./useAnalytics-BrGJTKfU.js";import"./useApp-DBsIRrNl.js";import"./useRouteRef-DmkHHcok.js";import"./index-SSMRT9Bs.js";import"./InfoCard-OqQGZWM2.js";import"./CardContent-CxGOKSZj.js";import"./ErrorBoundary-D8c7Pies.js";import"./ErrorPanel-B1RREPgC.js";import"./WarningPanel-Ba3usJjp.js";import"./ExpandMore-BvmDc48x.js";import"./AccordionDetails-NEVFuKGX.js";import"./index-B9sM2jn7.js";import"./Collapse-oWd9G09k.js";import"./MarkdownContent-Baqdegrk.js";import"./CodeSnippet-BIdXEEly.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./CopyTextButton-Do76HFgY.js";import"./useCopyToClipboard-TXjlrrXP.js";import"./useMountedState-ykOrhzDb.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";import"./Portal-j32zjom2.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./ListItem-DqtCuPtR.js";import"./ListItemText-Csz7vtMz.js";import"./LinkButton-k4dDLleo.js";import"./Button-D5VZkG9s.js";import"./Link-9uhrDkOF.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CfmBdIWt.js";import"./Divider-CRo1EOKz.js";import"./CardActions-BfUIEmfS.js";import"./BottomLink-BlsmOo41.js";import"./ArrowForward-d_wnYzhM.js";import"./DialogTitle-hXdjHSFc.js";import"./Modal-Cwa9uuB3.js";import"./Backdrop-BXminUHH.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./useAsync-BJYhKhAw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
