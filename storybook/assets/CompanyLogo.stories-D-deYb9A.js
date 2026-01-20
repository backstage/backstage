import{j as t,T as a,c,C as g,m as l}from"./iframe-BOihsBca.js";import{b as i,r as d}from"./plugin-BOMnHvz4.js";import{S as s}from"./Grid-1tirjwRV.js";import{w as u}from"./appWrappers-DK15oPID.js";import{T as f}from"./TemplateBackstageLogo-DNyjs5WI.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BAjUdbN7.js";import"./componentData-TxEje_0q.js";import"./useAnalytics-DhOW7dTn.js";import"./useApp-BZBzLwEw.js";import"./useRouteRef-C2F4nlr5.js";import"./index-D4IyxNBc.js";import"./InfoCard-CjT_VVPA.js";import"./CardContent-B5NTKqYg.js";import"./ErrorBoundary-CUIgcsCK.js";import"./ErrorPanel-NVtD5Fmz.js";import"./WarningPanel-CphllhCv.js";import"./ExpandMore-CS5zzKrc.js";import"./AccordionDetails-22y-25Aw.js";import"./index-B9sM2jn7.js";import"./Collapse-I_wLTjeF.js";import"./MarkdownContent-UpORQ4pi.js";import"./CodeSnippet-KsTffiAQ.js";import"./Box-CI5GVXvc.js";import"./styled-DdU_wQet.js";import"./CopyTextButton-D9S96eUG.js";import"./useCopyToClipboard-VRQ5LG6h.js";import"./useMountedState-BkgXJbA1.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";import"./Portal-B8qEj_11.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./ListItem-CxNFHnwj.js";import"./ListItemText-7EMyhNXk.js";import"./LinkButton-B1OFknhl.js";import"./Button-GN2E3NYf.js";import"./Link-Cl4hSzOR.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BfS5-4YN.js";import"./Divider-YwFpIHuT.js";import"./CardActions-Bs5c7L4W.js";import"./BottomLink-CXH5t2pM.js";import"./ArrowForward-DCIpWazW.js";import"./DialogTitle-CjKWEdsz.js";import"./Modal-jgY3Cn8t.js";import"./Backdrop-Cv_Xkr3N.js";import"./useObservable-C0lzDriu.js";import"./useIsomorphicLayoutEffect-DIFcbIH0.js";import"./useAsync-DYwiSXoB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
