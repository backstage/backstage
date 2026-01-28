import{j as t,T as a,c,C as g,m as l}from"./iframe-Vo5gUnCl.js";import{b as i,r as d}from"./plugin-lMVp93OZ.js";import{S as s}from"./Grid-BEftOOde.js";import{w as u}from"./appWrappers-DRnMogOg.js";import{T as f}from"./TemplateBackstageLogo-_figyTkq.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BR2getLG.js";import"./componentData-CM3E1gm5.js";import"./useAnalytics-DHo0n9fb.js";import"./useApp-ByJEk4p0.js";import"./useRouteRef-P8yf-IQ-.js";import"./index-CkzVBa0W.js";import"./InfoCard-CoEudecg.js";import"./CardContent-CWdtLCwL.js";import"./ErrorBoundary-vSmrrcxN.js";import"./ErrorPanel-CECY8d1j.js";import"./WarningPanel-3Yi5HVAk.js";import"./ExpandMore-D0AdZzXp.js";import"./AccordionDetails-7QWkCXyJ.js";import"./index-B9sM2jn7.js";import"./Collapse-UgyrRMk3.js";import"./MarkdownContent-C2NiFE4k.js";import"./CodeSnippet-D6VjBC0k.js";import"./Box-DxK1aAZk.js";import"./styled-DKP2AsJk.js";import"./CopyTextButton-3h_uNDP1.js";import"./useCopyToClipboard-D18fnjgX.js";import"./useMountedState-Bh-KE1Jd.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";import"./Portal-D4JBSn9P.js";import"./List-DaH1cfBf.js";import"./ListContext-CeAVa15U.js";import"./ListItem-C_bA5RtL.js";import"./ListItemText-DwHyTgsb.js";import"./LinkButton-BVapmrqz.js";import"./Link-C_eXFj6m.js";import"./lodash-Czox7iJy.js";import"./Button-Cn1hZ8HW.js";import"./CardHeader-DNxPOFVY.js";import"./Divider-CM863GtP.js";import"./CardActions-C5WgvvEj.js";import"./BottomLink-B0-zVqyZ.js";import"./ArrowForward-0a0C5lHr.js";import"./DialogTitle-BVpOivUt.js";import"./Modal-Ccymkcf6.js";import"./Backdrop-tN9AW69-.js";import"./useObservable-Cde_jjGr.js";import"./useIsomorphicLayoutEffect-DzFgYOQ-.js";import"./useAsync-DeuSsByy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
