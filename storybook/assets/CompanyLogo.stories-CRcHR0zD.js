import{j as t,T as a,c,C as g,m as l}from"./iframe-C8uhRVJE.js";import{b as i,r as d}from"./plugin-DoC2GKUp.js";import{S as s}from"./Grid-C5ZyGaTv.js";import{w as u}from"./appWrappers-BWLcUcVY.js";import{T as f}from"./TemplateBackstageLogo-UZYpZq3g.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-_vQLgw_y.js";import"./componentData-COYXa6k6.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./useRouteRef-B0Vi5G0u.js";import"./index-BYn64cw2.js";import"./InfoCard-Bk92sx2c.js";import"./CardContent-DO-1k1lO.js";import"./ErrorBoundary-Cfj40CJD.js";import"./ErrorPanel-ByR9HTcg.js";import"./WarningPanel-DEmZ2skU.js";import"./ExpandMore-hZ2c00bV.js";import"./AccordionDetails-CeLa6pif.js";import"./index-B9sM2jn7.js";import"./Collapse-DlLfqGWf.js";import"./MarkdownContent-BWUzH6fM.js";import"./CodeSnippet-BrHkgkym.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./CopyTextButton-DUWRsVAM.js";import"./useCopyToClipboard-Btd4dIqz.js";import"./useMountedState-D0BWMouD.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";import"./Portal-DGxbDxZD.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./ListItem-CMqPdlpf.js";import"./ListItemText-u8pHhn01.js";import"./LinkButton-CZufjSdE.js";import"./Button-BSbGK_Ct.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-HGudaM0-.js";import"./Divider-BSVlJEqX.js";import"./CardActions-CbO-K8b_.js";import"./BottomLink-CsfZ_ZcK.js";import"./ArrowForward-DNYazqhw.js";import"./DialogTitle-gHgKDmm6.js";import"./Modal-BCg34ymo.js";import"./Backdrop-BYegWcH-.js";import"./useObservable-BasahIcU.js";import"./useIsomorphicLayoutEffect-B6F3ekP_.js";import"./useAsync-CISCSNua.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
