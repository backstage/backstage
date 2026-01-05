import{j as t,T as a,c,C as g,m as l}from"./iframe-BuVoE93N.js";import{b as i,r as d}from"./plugin-DCfphdNv.js";import{S as s}from"./Grid-BS_RmjCI.js";import{w as u}from"./appWrappers-Dzyg-wjZ.js";import{T as f}from"./TemplateBackstageLogo-DqOUW45W.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-TD5MgFlM.js";import"./componentData-C8D74Psm.js";import"./useAnalytics-CGq4Uj37.js";import"./useApp-CzP5PYac.js";import"./useRouteRef-D1da1nJw.js";import"./index-CLOs8FQP.js";import"./InfoCard-CO5lDwDN.js";import"./CardContent-Cwgf28Tz.js";import"./ErrorBoundary-dEIU-zi8.js";import"./ErrorPanel-Ds2_o_Gr.js";import"./WarningPanel-Bli1S96p.js";import"./ExpandMore-DhETGfMT.js";import"./AccordionDetails-hMDXQ06y.js";import"./index-B9sM2jn7.js";import"./Collapse-1RctBr9q.js";import"./MarkdownContent-Bml6DDvX.js";import"./CodeSnippet-Djqp3Beh.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./CopyTextButton-DpoFWtPj.js";import"./useCopyToClipboard-B1o0Tb_t.js";import"./useMountedState-CTJrFvSG.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";import"./Portal-C8Go-sfs.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./ListItem-DWhn9oWM.js";import"./ListItemText-BhWjqHFt.js";import"./LinkButton-Dl9Eyitm.js";import"./Button-DitSkek8.js";import"./Link-2efb-DF8.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BtQ1V3nY.js";import"./Divider-Ccs-DDu6.js";import"./CardActions-DpYNDgHW.js";import"./BottomLink-B49jvA2-.js";import"./ArrowForward-DmYv927b.js";import"./DialogTitle-BbPlvqCJ.js";import"./Modal-DyZkcIsp.js";import"./Backdrop-BgdB2kxh.js";import"./useObservable-C2sfq9NY.js";import"./useIsomorphicLayoutEffect-JJ8yQdtm.js";import"./useAsync-Wgi4dREP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
