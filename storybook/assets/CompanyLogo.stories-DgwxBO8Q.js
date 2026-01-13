import{j as t,T as a,c,C as g,m as l}from"./iframe-DFN6SAj3.js";import{b as i,r as d}from"./plugin-DM50B3FE.js";import{S as s}from"./Grid-CnDsPTZJ.js";import{w as u}from"./appWrappers-Ctv9hZvN.js";import{T as f}from"./TemplateBackstageLogo-DZkRc0O_.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D6woGNMR.js";import"./componentData-BPXI-FVd.js";import"./useAnalytics-B9OoIKEa.js";import"./useApp-B_iVMZKS.js";import"./useRouteRef-CsRrhzNw.js";import"./index-BUG12Py2.js";import"./InfoCard-BgV_KJQF.js";import"./CardContent-Cdt1ySKT.js";import"./ErrorBoundary-C26hs5Ah.js";import"./ErrorPanel-DGkagluo.js";import"./WarningPanel-CcjMMskt.js";import"./ExpandMore-Baqg86ni.js";import"./AccordionDetails-BCiojWwT.js";import"./index-B9sM2jn7.js";import"./Collapse-Dmxu6_xf.js";import"./MarkdownContent-C7YoEea1.js";import"./CodeSnippet-DP1ZDnW-.js";import"./Box-CrX2Agh3.js";import"./styled-UJWvm5Ja.js";import"./CopyTextButton-bz5fwOjo.js";import"./useCopyToClipboard-S8C7f3cV.js";import"./useMountedState-0rCkRX95.js";import"./Tooltip-B6ATafnk.js";import"./Popper-BPOHrmiw.js";import"./Portal-6-SOUMqq.js";import"./List-CNrJvNp3.js";import"./ListContext-B6gycCKe.js";import"./ListItem-khPUul4I.js";import"./ListItemText-CEkrmQrS.js";import"./LinkButton-BrLVtOkM.js";import"./Button-DZ6ggl2r.js";import"./Link-DZVnE3x4.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CDDCJ9fq.js";import"./Divider-C4fHH6xB.js";import"./CardActions-CeC0kwcP.js";import"./BottomLink-BR0unUwa.js";import"./ArrowForward-DrIDPrkh.js";import"./DialogTitle-CELxYlfT.js";import"./Modal-B95o4eGb.js";import"./Backdrop-CFExy8rC.js";import"./useObservable-HXm7xrFW.js";import"./useIsomorphicLayoutEffect-DE10RVz8.js";import"./useAsync-Aw_hIc9t.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
