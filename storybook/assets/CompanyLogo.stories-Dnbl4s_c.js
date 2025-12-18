import{j as t,T as a,c,C as g,m as l}from"./iframe-BNEamOZA.js";import{b as i,r as d}from"./plugin-nCcrX0DP.js";import{S as s}from"./Grid-CRwHHoKE.js";import{w as u}from"./appWrappers-Cnm2FtIc.js";import{T as f}from"./TemplateBackstageLogo-C-ONnFLE.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BRYNsTLg.js";import"./componentData-Ci7GQLI0.js";import"./useAnalytics-CDZunouu.js";import"./useApp-D0ZSr7F9.js";import"./useRouteRef-B_Hzl5Hs.js";import"./index-eWkqxFkm.js";import"./InfoCard-CpGlQwlJ.js";import"./CardContent-BUa5iOGm.js";import"./ErrorBoundary-BGRkzeHn.js";import"./ErrorPanel-DFxFI8yn.js";import"./WarningPanel-DQQjxQBT.js";import"./ExpandMore-CsLuOGj_.js";import"./AccordionDetails-BJMgrmW8.js";import"./index-B9sM2jn7.js";import"./Collapse-OWL0PMb0.js";import"./MarkdownContent-DXsGFVRJ.js";import"./CodeSnippet-C1V19_EM.js";import"./Box-3EsxCCm9.js";import"./styled-vJQyp9py.js";import"./CopyTextButton-D-HwPeLy.js";import"./useCopyToClipboard-B1J-P2VS.js";import"./useMountedState-Dry2TiBQ.js";import"./Tooltip-Bujs_RiC.js";import"./Popper-DSZDidno.js";import"./Portal-DTr3SEhf.js";import"./List-DzzgZbq5.js";import"./ListContext-XsugHlK5.js";import"./ListItem-ZNxVQ_73.js";import"./ListItemText-DDE6HSA_.js";import"./LinkButton-_SotA3np.js";import"./Button-V9lH7kxA.js";import"./Link-CYOaEznZ.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-S5lLzdjZ.js";import"./Divider-DHY-OV0t.js";import"./CardActions-dpaYtDWI.js";import"./BottomLink-Dtlg51dV.js";import"./ArrowForward-IiBET2Zy.js";import"./DialogTitle-w4GpYJ__.js";import"./Modal-DO3msElT.js";import"./Backdrop-DFZc26u5.js";import"./useObservable-B3f76rj0.js";import"./useIsomorphicLayoutEffect-B3lwMs3P.js";import"./useAsync-DTLzs39j.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
