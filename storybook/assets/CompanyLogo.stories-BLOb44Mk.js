import{j as t,U as a,V as c,W as g,m as l}from"./iframe-D7hFsAHh.js";import{b as i,r as d}from"./plugin-BJCQ9dlH.js";import{S as s}from"./Grid-BBTPNutj.js";import{w as u}from"./appWrappers-BPgQm-7I.js";import{T as f}from"./TemplateBackstageLogo-jXT1cBw5.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BOlTNLJ_.js";import"./componentData-B0-3b838.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./useRouteRef-BuKO7_g7.js";import"./index-CMWiNJrn.js";import"./InfoCard-DQx2F9Xz.js";import"./CardContent-CuI1c31y.js";import"./ErrorBoundary-B1MdgVzH.js";import"./ErrorPanel-REZtkXZm.js";import"./WarningPanel-BXBOJrST.js";import"./ExpandMore-e5K7_2D4.js";import"./AccordionDetails-Bs_9tEgl.js";import"./index-B9sM2jn7.js";import"./Collapse-CX1fKFyZ.js";import"./MarkdownContent-lDWK0lAQ.js";import"./CodeSnippet-DfGrFjGG.js";import"./Box-D-wD6_7y.js";import"./styled-CbYuIyxW.js";import"./CopyTextButton-NjimjsMr.js";import"./useCopyToClipboard-CaZKc_Tm.js";import"./useMountedState-jyZ6jmpg.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";import"./Portal-8ZiP_Sqy.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./ListItem-CLTebMeN.js";import"./ListItemText-Ben4oQC7.js";import"./LinkButton-tqpeZKNg.js";import"./Link-JoAHle2P.js";import"./lodash-Czox7iJy.js";import"./Button-Qm72mdor.js";import"./CardHeader-Bq5V7SOz.js";import"./Divider-DMcnu_lF.js";import"./CardActions-wVEVY7hR.js";import"./BottomLink-BbJ3fpw-.js";import"./ArrowForward-B95Ii3a7.js";import"./DialogTitle-I9jy4wXP.js";import"./Modal-DMtGtm-r.js";import"./Backdrop-DxPYSkiX.js";import"./useObservable-CtiHHxxM.js";import"./useIsomorphicLayoutEffect-CtVE3GbE.js";import"./useAsync-BELltm9_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
