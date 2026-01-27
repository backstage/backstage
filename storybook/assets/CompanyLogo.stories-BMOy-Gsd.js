import{j as t,T as a,c,C as g,m as l}from"./iframe-C1ohgxPY.js";import{b as i,r as d}from"./plugin-DEyj1dW0.js";import{S as s}from"./Grid-ClUEh4fm.js";import{w as u}from"./appWrappers-53W6Z_Fl.js";import{T as f}from"./TemplateBackstageLogo-Bl8zHos2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-cKXSvaFH.js";import"./componentData-CLq0rdgK.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./useRouteRef-ayjdeWHT.js";import"./index-pzwzu_48.js";import"./InfoCard-BI6fiYg-.js";import"./CardContent-QS0yr0Ka.js";import"./ErrorBoundary-DUAUzTN6.js";import"./ErrorPanel-Cu206NQf.js";import"./WarningPanel-Cqk4HdYp.js";import"./ExpandMore-BahcoyIm.js";import"./AccordionDetails-Ci8EIrXK.js";import"./index-B9sM2jn7.js";import"./Collapse-BVJkjsmV.js";import"./MarkdownContent-CG5N0PWp.js";import"./CodeSnippet-CdNwSyzj.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./CopyTextButton-Cqy0wuG-.js";import"./useCopyToClipboard-ByZDolH4.js";import"./useMountedState-m4mlNTW7.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";import"./Portal-CA7fRi5Y.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItem-Ck2-kEA7.js";import"./ListItemText-Bu4Q5VY7.js";import"./LinkButton-C8n9_7UA.js";import"./Link-DLDptLAM.js";import"./lodash-Czox7iJy.js";import"./Button-aR7p6seP.js";import"./CardHeader-B400OvSW.js";import"./Divider-D8U2y_Q5.js";import"./CardActions-B2UPjdQO.js";import"./BottomLink-Bwy_Zoku.js";import"./ArrowForward-DrZLn-s7.js";import"./DialogTitle-DrsqXQow.js";import"./Modal-EWqQvSRV.js";import"./Backdrop-D03isVae.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./useAsync-TxDBlLIm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
