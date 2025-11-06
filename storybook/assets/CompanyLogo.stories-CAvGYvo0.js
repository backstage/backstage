import{j as t,T as a,c,C as g,m as l}from"./iframe-D4YkWMPd.js";import{b as i,r as d}from"./plugin-seGdHiiS.js";import{S as s}from"./Grid-3dbGowTG.js";import{w as u}from"./appWrappers-BdS3ZXd0.js";import{T as f}from"./TemplateBackstageLogo-C_UZ6ajO.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CS5_JnCA.js";import"./componentData-C4oKpH_t.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./useRouteRef-Dr-zIQ4_.js";import"./index-Cb5ApCX3.js";import"./InfoCard-DekS9cui.js";import"./CardContent-CH-NP11H.js";import"./ErrorBoundary-Dj_BdtLc.js";import"./ErrorPanel-geXzwKYb.js";import"./WarningPanel-CPZUUyuU.js";import"./ExpandMore-Bpioo4yy.js";import"./AccordionDetails-DKrusFPL.js";import"./index-DnL3XN75.js";import"./Collapse-CyHojAhw.js";import"./MarkdownContent-DNug9PDQ.js";import"./CodeSnippet-Dl0gP_YZ.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./CopyTextButton-GQ6DbX_U.js";import"./useCopyToClipboard-CXAMfyh-.js";import"./useMountedState-BZeJdOiH.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";import"./Portal-GmGr81qv.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./ListItem-C4617hHA.js";import"./ListItemText-C8w1SX_U.js";import"./LinkButton-bYk9cqtO.js";import"./Button-bLTRgJ4c.js";import"./Link-Cg_HU4j2.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-B1-VM8pp.js";import"./Divider-DoiUQK47.js";import"./CardActions-CBi48CeD.js";import"./BottomLink-Ckmh1WY3.js";import"./ArrowForward-ZRQV-YG0.js";import"./DialogTitle-ikIQGFRt.js";import"./Modal-BPzxcCH2.js";import"./Backdrop-BWtXXt1T.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./useAsync-DFwDLbfT.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
