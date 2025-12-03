import{j as t,T as a,c,C as g,m as l}from"./iframe-C9zrakkc.js";import{b as i,r as d}from"./plugin-FvNGz4xC.js";import{S as s}from"./Grid-JwSod7uj.js";import{w as u}from"./appWrappers-D30AEFfJ.js";import{T as f}from"./TemplateBackstageLogo-C4zRhTg2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DYqBkcEW.js";import"./componentData-CTZUzyGA.js";import"./useAnalytics-DAZilNqi.js";import"./useApp-5u7uhQnf.js";import"./useRouteRef-u0DWcSPD.js";import"./index-kZEKiPjo.js";import"./InfoCard-RbAMJy0N.js";import"./CardContent-o9HZeIUg.js";import"./ErrorBoundary-DT6g9ILI.js";import"./ErrorPanel-C1y9p2wT.js";import"./WarningPanel-BpsyaNdk.js";import"./ExpandMore-BmhSC8QK.js";import"./AccordionDetails-CO835Xyy.js";import"./index-B9sM2jn7.js";import"./Collapse-BSaPuFEG.js";import"./MarkdownContent-DnFMmDme.js";import"./CodeSnippet-DR38SpuH.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./CopyTextButton-ClvHCzDa.js";import"./useCopyToClipboard-hqcagNht.js";import"./useMountedState-C5AiKHab.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";import"./Portal-CYobuNZx.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./ListItem-DN7mBFNT.js";import"./ListItemText-u9zyj5b2.js";import"./LinkButton-C-LjwduR.js";import"./Button-CmMZjW_f.js";import"./Link-C1eBfv8e.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BJEjS_-7.js";import"./Divider-BvnOZNSI.js";import"./CardActions-C42Lpz0g.js";import"./BottomLink-CXlh_zpn.js";import"./ArrowForward-B_STm-OI.js";import"./DialogTitle-Bu0pvr4n.js";import"./Modal-BI7VDIZ7.js";import"./Backdrop-CAN_1fph.js";import"./useObservable-DNrCFxZS.js";import"./useIsomorphicLayoutEffect-BN5wUfcv.js";import"./useAsync-ClKr9TyR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
