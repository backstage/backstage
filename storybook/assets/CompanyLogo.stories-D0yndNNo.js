import{j as t,U as a,V as c,W as g,m as l}from"./iframe-ByNNXeiS.js";import{b as i,r as d}from"./plugin-B_nDKzso.js";import{S as s}from"./Grid-COH9vICu.js";import{w as u}from"./appWrappers-DatLzHRZ.js";import{T as f}from"./TemplateBackstageLogo-C5GcOCqm.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-pqbE9k03.js";import"./componentData-CBWBgxbI.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./useRouteRef-BhZuTamD.js";import"./index-BTmRWwN6.js";import"./InfoCard-Df34tp0q.js";import"./CardContent-CsWdY3wg.js";import"./ErrorBoundary-BtTult0-.js";import"./ErrorPanel-CTICeqhn.js";import"./WarningPanel-fBpuhxcO.js";import"./ExpandMore-BLvu8MU4.js";import"./AccordionDetails-C7U2wsbT.js";import"./index-B9sM2jn7.js";import"./Collapse-BjluhvND.js";import"./MarkdownContent-Czdavqjx.js";import"./CodeSnippet-DyKHxpoR.js";import"./Box-bD4mu6aM.js";import"./styled-CuXflSyU.js";import"./CopyTextButton-DCj9B9eD.js";import"./useCopyToClipboard-k9NuIUEn.js";import"./useMountedState-BOphWm7n.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";import"./Portal-0sot7Ylp.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./ListItem-CKlTPKne.js";import"./ListItemText-DCU7V9rR.js";import"./LinkButton-BZMJ8Uvy.js";import"./Link-B8WLAU68.js";import"./lodash-Czox7iJy.js";import"./Button-DOFZXYjQ.js";import"./CardHeader-Crj5_jlj.js";import"./Divider-DmVn_tUx.js";import"./CardActions-DyrSilUZ.js";import"./BottomLink-DJ3O32BK.js";import"./ArrowForward-CwrmR3h3.js";import"./DialogTitle-YYVkYrji.js";import"./Modal-Sjev8ZKO.js";import"./Backdrop-CnaZtlJi.js";import"./useObservable-GGfqox2V.js";import"./useIsomorphicLayoutEffect-BQxAPDGa.js";import"./useAsync-CQMi4841.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
