import{j as t,T as a,c,C as g,m as l}from"./iframe-BFEEYdl1.js";import{b as i,r as d}from"./plugin-DKiRlTDL.js";import{S as s}from"./Grid-_pxMEZfk.js";import{w as u}from"./appWrappers-Drr8kDaZ.js";import{T as f}from"./TemplateBackstageLogo-1GZI11PR.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-EFweYiy3.js";import"./componentData-fXGhNbVj.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./useRouteRef-Djz7qv6Y.js";import"./index-DFzOTOJF.js";import"./InfoCard-BJpJ1bY7.js";import"./CardContent-C0IdQT8E.js";import"./ErrorBoundary-BrFvpfH8.js";import"./ErrorPanel-ByBjA_Oh.js";import"./WarningPanel-Ca_owezB.js";import"./ExpandMore-Ctn3qfGH.js";import"./AccordionDetails-BWiYd2nY.js";import"./index-DnL3XN75.js";import"./Collapse-DQjjdB13.js";import"./MarkdownContent-BVMx6-i7.js";import"./CodeSnippet-DKeVSYKZ.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./CopyTextButton-CPUbqQk2.js";import"./useCopyToClipboard-CNm0_dns.js";import"./useMountedState-SzYJvnyY.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";import"./Portal-CS1cCsNf.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./ListItem-CoJRgtBh.js";import"./ListItemText-B34yPKAV.js";import"./LinkButton-CtAJOX-o.js";import"./Button-Ci5q7ey2.js";import"./Link-BzkurKFl.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-aKIXN66o.js";import"./Divider-CYSzQ_1E.js";import"./CardActions-BCgG5ICW.js";import"./BottomLink-Z_9FJnlR.js";import"./ArrowForward-CQW_bFSW.js";import"./DialogTitle-C53FTZ8W.js";import"./Modal-DNwlsaiG.js";import"./Backdrop-Cc0uQTMy.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./useAsync-CK6ps4Gs.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
