import{j as t,T as a,c,C as g,m as l}from"./iframe-cIBAsfTm.js";import{b as i,r as d}from"./plugin-Cb3_xcRa.js";import{S as s}from"./Grid-Dgo5ACik.js";import{w as u}from"./appWrappers-C9lQTpTI.js";import{T as f}from"./TemplateBackstageLogo-C4BJSz9T.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CWbQlcVn.js";import"./componentData-DBqEb6G1.js";import"./useAnalytics-Cn11G-Da.js";import"./useApp-BnMckP-G.js";import"./useRouteRef-tsZqa-xk.js";import"./index-BkxQC8j2.js";import"./InfoCard-BL8MQepQ.js";import"./CardContent-BgcXPZYc.js";import"./ErrorBoundary-CqfBeslE.js";import"./ErrorPanel-BVO-icJS.js";import"./WarningPanel-DCLMi1dI.js";import"./ExpandMore-Fefrqwki.js";import"./AccordionDetails-DeQbQa7K.js";import"./index-DnL3XN75.js";import"./Collapse-BkfRpfT3.js";import"./MarkdownContent-CaLyrJfC.js";import"./CodeSnippet-kFMDpIw3.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./CopyTextButton-Dc9zjtfe.js";import"./useCopyToClipboard-B_-Fejqp.js";import"./useMountedState-DDQ1veKw.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";import"./Portal-C3RNSs6Y.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./ListItem-DDKzfBu6.js";import"./ListItemText-CP0ZRpAu.js";import"./LinkButton-Di3tjDC2.js";import"./Button-D8Pwv3bO.js";import"./Link-BTtSeEzC.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DpWbaMe6.js";import"./Divider-Cpot2Ubt.js";import"./CardActions-C3tcN7S7.js";import"./BottomLink-U2EHDAiC.js";import"./ArrowForward-Hao0JHUH.js";import"./DialogTitle-DpcONI-S.js";import"./Modal-BGf4XJgV.js";import"./Backdrop-BVSi2zmG.js";import"./useObservable-5q0VJedC.js";import"./useIsomorphicLayoutEffect-nJ3cOO7G.js";import"./useAsync-DPpw4t_L.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
