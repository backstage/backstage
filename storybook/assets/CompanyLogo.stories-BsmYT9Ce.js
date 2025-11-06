import{j as t,T as a,c,C as g,m as l}from"./iframe-DKl1TaBY.js";import{b as i,r as d}from"./plugin-ofVW4ekV.js";import{S as s}from"./Grid-DucnE1Qv.js";import{w as u}from"./appWrappers-CQMFW9f8.js";import{T as f}from"./TemplateBackstageLogo-BC1U8Evc.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-Cp-tNdu1.js";import"./componentData-C9VKpHEQ.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./useRouteRef-CjGG19qw.js";import"./index-CAizWZSO.js";import"./InfoCard-BXfocUJP.js";import"./CardContent-BnHsAJ1f.js";import"./ErrorBoundary-pwMpy8Pl.js";import"./ErrorPanel-9AkQroOm.js";import"./WarningPanel-eVG4_neK.js";import"./ExpandMore-SNT8Gr9W.js";import"./AccordionDetails-5IM8yJG8.js";import"./index-DnL3XN75.js";import"./Collapse-DRCUh2Je.js";import"./MarkdownContent-Cd_tUbb9.js";import"./CodeSnippet-CNnnJvIp.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./CopyTextButton-TfPCFLIm.js";import"./useCopyToClipboard-BgwPpn9s.js";import"./useMountedState-Bg5ZLpHR.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";import"./Portal-t3ECfreD.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./ListItem-Cik-ImzB.js";import"./ListItemText-X8gsxozg.js";import"./LinkButton-Bm5eURQl.js";import"./Button-ho9zTU_x.js";import"./Link-BtYWFjac.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CZMAOeHX.js";import"./Divider-DdBr9tFd.js";import"./CardActions-BFLytzP8.js";import"./BottomLink-BpjWpCp6.js";import"./ArrowForward-DvHRQMuG.js";import"./DialogTitle-BfB3GFxp.js";import"./Modal-Dg-OYacR.js";import"./Backdrop-C6FYe0Ep.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./useAsync-6VrnLR2E.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
