import{j as t,T as a,c,C as g,m as l}from"./iframe-DEXNC9RX.js";import{b as i,r as d}from"./plugin-CLlU_Cp6.js";import{S as s}from"./Grid-DwntcsAr.js";import{w as u}from"./appWrappers-ZgtTfHmd.js";import{T as f}from"./TemplateBackstageLogo-C6tE-aKG.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C9BoD7po.js";import"./componentData-CWUzWtHA.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./useRouteRef-ZxZLNpb-.js";import"./index-BlCxWptt.js";import"./InfoCard-BW4VKxa5.js";import"./CardContent-Dv0KIfNv.js";import"./ErrorBoundary-BM8aEPeZ.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./ExpandMore-Df24YjII.js";import"./AccordionDetails-K4eNqGeL.js";import"./index-B9sM2jn7.js";import"./Collapse-DklbiL-j.js";import"./MarkdownContent-yMYvzVpl.js";import"./CodeSnippet-D4GvPAYc.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./CopyTextButton-DdSDl_l7.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./useMountedState-DIp_Aeij.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./Portal-O6zOHTQ9.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./ListItem-BsFeXcoa.js";import"./ListItemText-SZBW9x2i.js";import"./LinkButton-CVg2ID4w.js";import"./Button-F3mebnqD.js";import"./Link-7jnzHmir.js";import"./lodash-Czox7iJy.js";import"./CardHeader-D25g89XU.js";import"./Divider-DNnZbvf9.js";import"./CardActions-BRmKXnBD.js";import"./BottomLink-Bps-KGLO.js";import"./ArrowForward-epoaBmEz.js";import"./DialogTitle-Cdw2QC1n.js";import"./Modal-qxnLeQlM.js";import"./Backdrop-DWlQwWtV.js";import"./useObservable-pijbHhQ1.js";import"./useIsomorphicLayoutEffect-RgkXVcsu.js";import"./useAsync-BAn5CjI7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
