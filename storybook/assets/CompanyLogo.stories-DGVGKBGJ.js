import{j as t,T as a,c,C as g,m as l}from"./iframe-C8yOC2Gz.js";import{b as i,r as d}from"./plugin-C5Nls2ei.js";import{S as s}from"./Grid-CFxNiZTj.js";import{w as u}from"./appWrappers-BwqhmqR7.js";import{T as f}from"./TemplateBackstageLogo-BG4ZKQWJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BKrfKbSW.js";import"./componentData-BzMhRHzP.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./useRouteRef-Csph2kF6.js";import"./index-CL1m9NR9.js";import"./InfoCard-NdZuYaRN.js";import"./CardContent-BTwSHN8c.js";import"./ErrorBoundary-BZIgoJeC.js";import"./ErrorPanel-C1UVhDOE.js";import"./WarningPanel-k1eYB_NT.js";import"./ExpandMore-DevN-S2O.js";import"./AccordionDetails-ClHZ_AqU.js";import"./index-B9sM2jn7.js";import"./Collapse-BMBJHt31.js";import"./MarkdownContent-C9TrxeVt.js";import"./CodeSnippet-CcjaZ8oG.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./CopyTextButton-BJf8FGQ0.js";import"./useCopyToClipboard-Cdth3J8w.js";import"./useMountedState-Bkd0wkwf.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./Portal-CjckT897.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./ListItem-BMFOx_2Q.js";import"./ListItemText-CyJt0pMj.js";import"./LinkButton-B4FRoGfy.js";import"./Button-BKAaE2BP.js";import"./Link-CUs49TGY.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CK7GWSaa.js";import"./Divider-9e41O7nq.js";import"./CardActions-DjE-ZFS5.js";import"./BottomLink-hnT-aCrJ.js";import"./ArrowForward-CyzdqpLN.js";import"./DialogTitle-BkYEluNi.js";import"./Modal-D0M0Hit_.js";import"./Backdrop-CgVSzXAJ.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./useAsync-A762jT4V.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
