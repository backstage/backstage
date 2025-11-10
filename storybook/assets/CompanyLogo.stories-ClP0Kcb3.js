import{j as t,T as a,c,C as g,m as l}from"./iframe-Dg7jNfgV.js";import{b as i,r as d}from"./plugin-BpfyQ0vQ.js";import{S as s}from"./Grid-DZoxUphm.js";import{w as u}from"./appWrappers-Dhyq66xu.js";import{T as f}from"./TemplateBackstageLogo-DpKNgyCS.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-G9-uH3UY.js";import"./componentData-CzpKGprp.js";import"./useAnalytics-DDAI3Sby.js";import"./useApp-DBejBM5d.js";import"./useRouteRef-BE4yvNyY.js";import"./index-DJhhhiwK.js";import"./InfoCard-YTF1zP1R.js";import"./CardContent-YBBmqTdA.js";import"./ErrorBoundary-DF2UJt6Z.js";import"./ErrorPanel-CFu8Rfin.js";import"./WarningPanel-D2enhZvg.js";import"./ExpandMore-B7ltQ0WG.js";import"./AccordionDetails-CFRyv9zh.js";import"./index-DnL3XN75.js";import"./Collapse-BXYqoVfQ.js";import"./MarkdownContent-XjtKEh5y.js";import"./CodeSnippet-DJ-lPCL_.js";import"./Box-Bmqbh7u4.js";import"./styled-CMe42Sps.js";import"./CopyTextButton-CNGlDDM9.js";import"./useCopyToClipboard-CoeOzktD.js";import"./useMountedState-6AheAbGL.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";import"./Portal-DaCRxhVb.js";import"./List-CB5Cl-bM.js";import"./ListContext-DjmviigF.js";import"./ListItem-WexTgdCu.js";import"./ListItemText-DJB03TAT.js";import"./LinkButton-CpCeZYF_.js";import"./Button-CrARaf08.js";import"./Link-gNdToM-H.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-W6MdNAvW.js";import"./Divider-ithO4Mrh.js";import"./CardActions-CH0H7gTz.js";import"./BottomLink-DgZkINS1.js";import"./ArrowForward-B5pYWWYy.js";import"./DialogTitle-BGuqEob6.js";import"./Modal-CaeBjbT7.js";import"./Backdrop-INLhdtBn.js";import"./useObservable-BZnIpjCU.js";import"./useIsomorphicLayoutEffect-BlM3Hzgi.js";import"./useAsync-DkNvCakU.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
