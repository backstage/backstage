import{j as t,T as a,c,C as g,m as l}from"./iframe-CMoZkI_V.js";import{b as i,r as d}from"./plugin-Bm43qfKP.js";import{S as s}from"./Grid-Cc5u-Kft.js";import{w as u}from"./appWrappers-CwLdvgVt.js";import{T as f}from"./TemplateBackstageLogo-D-moLroE.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Cw-agZnT.js";import"./componentData-C1GpKGWH.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./useRouteRef-BKopQGJE.js";import"./index-Dl6v8jff.js";import"./InfoCard-B7VpOy60.js";import"./CardContent-DxGlUsBp.js";import"./ErrorBoundary-p7Vx4hun.js";import"./ErrorPanel-4fnCiNRY.js";import"./WarningPanel-CrW_vej9.js";import"./ExpandMore-RbVyUBOe.js";import"./AccordionDetails-BpZtQ7qf.js";import"./index-B9sM2jn7.js";import"./Collapse-CttgXTbY.js";import"./MarkdownContent-BAnHPybQ.js";import"./CodeSnippet-CC5elSQb.js";import"./Box-DDWlRNcc.js";import"./styled-BPnpuM9w.js";import"./CopyTextButton-D_szYgc0.js";import"./useCopyToClipboard-LW0UmRxQ.js";import"./useMountedState-DXAXWcHb.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";import"./Portal-BsEe4NVr.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./ListItem-DQ5raIpn.js";import"./ListItemText-CMPMNvTt.js";import"./LinkButton-Br-4b2Az.js";import"./Button-CMlJ_q4q.js";import"./Link-_YMea8vG.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CDcSzNkn.js";import"./Divider-DAPmlDv6.js";import"./CardActions-DJqB9_Ii.js";import"./BottomLink-Cy-SqU1H.js";import"./ArrowForward-CYQeWInn.js";import"./DialogTitle-D9NQ_O8G.js";import"./Modal-JpNI_f-q.js";import"./Backdrop-t6uNU6s-.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./useAsync-nuZztPgy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
