import{j as t,T as a,c,C as g,m as l}from"./iframe-D1GFiJZo.js";import{b as i,r as d}from"./plugin-CKgXZTOa.js";import{S as s}from"./Grid-C_DJ7CXy.js";import{w as u}from"./appWrappers-DsMAuWKH.js";import{T as f}from"./TemplateBackstageLogo-Eo5gry6B.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DzFxQMSf.js";import"./componentData-B3mVAfsp.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./useRouteRef-DO_E-PIP.js";import"./index-DKQ8ROEi.js";import"./InfoCard-DNXQeFaq.js";import"./CardContent-CDDk_fHy.js";import"./ErrorBoundary-BGnIfumD.js";import"./ErrorPanel-DW_UBsf7.js";import"./WarningPanel-Cp7h97Xz.js";import"./ExpandMore-C5Qt4VBZ.js";import"./AccordionDetails-CHtH84ap.js";import"./index-DnL3XN75.js";import"./Collapse-DDq3EAkH.js";import"./MarkdownContent-B_nTIlyA.js";import"./CodeSnippet-C5RtD8fm.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./CopyTextButton-p_Y8WBTg.js";import"./useCopyToClipboard-BYpPSSth.js";import"./useMountedState-qz1JMqOw.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";import"./Portal-B8zTs1MC.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./ListItem-DWHRsh5J.js";import"./ListItemText-ioovX8R3.js";import"./LinkButton-CABNA6l3.js";import"./Button-DZDIOJUc.js";import"./Link-B1KKwcLj.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-HwFA-nax.js";import"./Divider-CCA28OD_.js";import"./CardActions-BH1q8i_s.js";import"./BottomLink-BFyTmqMM.js";import"./ArrowForward-DKYzAO2n.js";import"./DialogTitle-BrPPzfXC.js";import"./Modal-Cfmtm0OK.js";import"./Backdrop-ClAhZkYO.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./useAsync-B9mAtbAn.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
