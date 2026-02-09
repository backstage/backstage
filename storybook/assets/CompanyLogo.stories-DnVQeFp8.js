import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CZ56O-V9.js";import{b as i,r as d}from"./plugin-D7PDWxiM.js";import{S as s}from"./Grid-DjbHNKXL.js";import{w as u}from"./appWrappers-BeJ0xyiP.js";import{T as f}from"./TemplateBackstageLogo-DH7Cxjwo.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DZUy8-Yb.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./useRouteRef-CcFxojYp.js";import"./index-Ca3h4iDJ.js";import"./InfoCard-BF5bOwh8.js";import"./CardContent-DTAML6Xx.js";import"./ErrorBoundary-bCgK2ux4.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./index-B9sM2jn7.js";import"./Collapse-DPNvm9kr.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./CopyTextButton-wUac2sWa.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./useMountedState-ut5gwY4t.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";import"./Portal-rgcloK6u.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./ListItem-BtvfynNb.js";import"./ListItemText-Dn38yijY.js";import"./LinkButton-Bp2XTFR0.js";import"./Link-BQF_zimC.js";import"./lodash-Czox7iJy.js";import"./Button-DKgYvdYh.js";import"./CardHeader-BN2Aoi7y.js";import"./Divider-C407Z4rN.js";import"./CardActions-PhczM4sT.js";import"./BottomLink-B_bxfdsL.js";import"./ArrowForward-CzbSCcaK.js";import"./DialogTitle-C-1j8eOs.js";import"./Modal-CQLQBAd-.js";import"./Backdrop-DdZZM_yb.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./useAsync-BZsMG4pg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
