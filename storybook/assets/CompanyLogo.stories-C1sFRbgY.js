import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CDQkRPtg.js";import{b as i,r as d}from"./plugin-CahDXici.js";import{S as s}from"./Grid-CLxLLrBH.js";import{w as u}from"./appWrappers-CE0QY808.js";import{T as f}from"./TemplateBackstageLogo-DHkVdLHG.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-7Q4zKQYi.js";import"./componentData-DYzzNs7d.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./useRouteRef-BSUaPuHo.js";import"./index-SymPTtRB.js";import"./InfoCard-dA-QAsvX.js";import"./CardContent-DzRD3wyO.js";import"./ErrorBoundary-BlIVd69u.js";import"./ErrorPanel-BvnDxryc.js";import"./WarningPanel-DP_PPUp-.js";import"./ExpandMore-Bwto4mGt.js";import"./AccordionDetails-Cp5Nx1Lx.js";import"./index-B9sM2jn7.js";import"./Collapse-DIN7Ymif.js";import"./MarkdownContent-aPcN5Cf2.js";import"./CodeSnippet-CRThj8mN.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./CopyTextButton-D-Xv6vTC.js";import"./useCopyToClipboard-DyF_TS4U.js";import"./useMountedState-C2nQ5XSq.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";import"./Portal-uMAxVVb4.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./ListItem-CsL3oSDi.js";import"./ListItemText-DHloRduP.js";import"./LinkButton-bAeWiGNF.js";import"./Link-BIWx4pmj.js";import"./lodash-m4O8l6WS.js";import"./Button-CJBsb64p.js";import"./CardHeader-D827vOQ6.js";import"./Divider-o218nSC0.js";import"./CardActions-Cyv3XIno.js";import"./BottomLink-BRs4vojn.js";import"./ArrowForward-hXXdPwwK.js";import"./DialogTitle-DWkQ60T4.js";import"./Modal-BVCBWYhk.js";import"./Backdrop-ZHSEXCO8.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./useAsync-BT3fPnna.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
