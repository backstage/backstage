import{j as t,T as a,c,C as g,m as l}from"./iframe-D-w6RxGv.js";import{b as i,r as d}from"./plugin-DpTs2s3G.js";import{S as s}from"./Grid-Dts7GzWa.js";import{w as u}from"./appWrappers-BDndsqAl.js";import{T as f}from"./TemplateBackstageLogo-BtA6PR1g.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CWxA29pF.js";import"./componentData-BrNCABFb.js";import"./useAnalytics-DPlXbgxY.js";import"./useApp-CFgLl9KI.js";import"./useRouteRef-DKWFMIlX.js";import"./index-BY4RoNki.js";import"./InfoCard-9JWpIulp.js";import"./CardContent-Daj9kNFa.js";import"./ErrorBoundary-DBPwAXOm.js";import"./ErrorPanel-BqOBprFq.js";import"./WarningPanel-8DIVHb20.js";import"./ExpandMore-BTmXorSC.js";import"./AccordionDetails-B5XR2THz.js";import"./index-DnL3XN75.js";import"./Collapse-efa4O20L.js";import"./MarkdownContent---Ocrjn1.js";import"./CodeSnippet-CVxT4o4G.js";import"./Box-PhnhPtmh.js";import"./styled-n-xY2yaY.js";import"./CopyTextButton-CDPhBR-t.js";import"./useCopyToClipboard-D_vXHP6Q.js";import"./useMountedState-CFUXa8RM.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";import"./Portal-DWcyIRvv.js";import"./List-CujjVc52.js";import"./ListContext-yRQd_P0Y.js";import"./ListItem-DC_Q_Qo-.js";import"./ListItemText-SKgMyQts.js";import"./LinkButton-cpdTg8QR.js";import"./Button-BFjkR3wc.js";import"./Link-Dhe_VRcU.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BkE3ViQm.js";import"./Divider-CtO0jY8z.js";import"./CardActions-BCtx-_t5.js";import"./BottomLink-mVcObROK.js";import"./ArrowForward-D69vUWDI.js";import"./DialogTitle-D3Q4uAmB.js";import"./Modal-Ds0hJkbL.js";import"./Backdrop-D0MNdkqU.js";import"./useObservable-CKEb6xrB.js";import"./useIsomorphicLayoutEffect-BdbRXj_e.js";import"./useAsync-BGWO1dGB.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
