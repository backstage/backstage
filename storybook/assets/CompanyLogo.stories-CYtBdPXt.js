import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CqNqnb74.js";import{b as i,r as d}from"./plugin-Xa30wQur.js";import{S as s}from"./Grid-Caq84KkR.js";import{w as u}from"./appWrappers-C_psOORT.js";import{T as f}from"./TemplateBackstageLogo-CWirHFPW.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DYku7kmG.js";import"./componentData-FAAyaxJE.js";import"./useAnalytics-BT9M_UlL.js";import"./useApp-IKd96EAr.js";import"./useRouteRef-C3TAPCF-.js";import"./index-CfXjUdjY.js";import"./InfoCard-CG5avwIW.js";import"./CardContent-Dm5YK7Lf.js";import"./ErrorBoundary-BxcDMcm2.js";import"./ErrorPanel-BYm0Mdkb.js";import"./WarningPanel-BCw9VL3x.js";import"./ExpandMore-CaaJdVfs.js";import"./AccordionDetails-DNjlLobr.js";import"./index-B9sM2jn7.js";import"./Collapse-D1DbSfAq.js";import"./MarkdownContent-CAUU14sj.js";import"./CodeSnippet-DP3MYkIR.js";import"./Box-BOvD5Bg7.js";import"./styled-_PBYdDbi.js";import"./CopyTextButton-DzB5MTRG.js";import"./useCopyToClipboard-D6T0fjGN.js";import"./useMountedState-DTFeLOhk.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";import"./Portal-Czxz0PR0.js";import"./List-aEU9IVP1.js";import"./ListContext-D4KOPpIf.js";import"./ListItem-CO20Ch0Y.js";import"./ListItemText-qCutXsPN.js";import"./LinkButton-FESOt-od.js";import"./Link-CAxa2nmx.js";import"./lodash-Czox7iJy.js";import"./Button-BIN6mxNu.js";import"./CardHeader-CmAP5YfK.js";import"./Divider-zsbty3yZ.js";import"./CardActions-CAm3b56u.js";import"./BottomLink-7YaXAONt.js";import"./ArrowForward-PIPGF8mw.js";import"./DialogTitle-CooOy-k1.js";import"./Modal-DG_DwVZd.js";import"./Backdrop-Bu5rdiX9.js";import"./useObservable-BIXBQOil.js";import"./useIsomorphicLayoutEffect-BPmaJ8UY.js";import"./useAsync-BA3GFE0D.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
